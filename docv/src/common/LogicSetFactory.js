/**
 * @file A simple logic set
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    /**
     * Usage:
     *
     * var factory = new LogicSetFactory({
     *     universal: ['line', 'bar', 'pie', 'map'],
     *     parseMode: LogicSetFactory.NO_POSITIVE_MEANS_UNIVERSAL
     * })
     *
     * var logicSet = factory.creatSet(['line', 'bar']);
     * means: (is 'line' || is 'bar')
     * or: ('line' union 'bar')
     *
     * var logicSet = factory.creatSet(['!line', '!bar']);
     * means: !(is 'line' || is 'bar')
     * or: (universal subtracts ('line' union 'bar'))
     *
     * var logicSet = factory.creatSet(['pie', 'map', '!line', '!bar']);
     * means: (is 'pie' || is 'map') && !(is 'line' || is 'bar')
     * or: ('pie' union 'map') intersects (universal subtracts ('line' union 'bar'))
     * which euqals to: ('pie' union 'map')
     *
     * Terms:
     * 'positiveItem' means item without '!'.
     * 'negativeItem' means item with '!'.
     * 'no positive' means there is no positive item.
     *
     * parseMode:
     * Describing how to parse input.
     * (1) parseMode === logicSetFactory.NO_POSITIVE_MEANS_UNIVERSAL:
     *     For example:
     *     null means empty set.
     *     [] means empty set.
     *     ['!line'] means
     *         (empty intersects (universal subtracts 'line')),
     *         which equals to empty set.
     *     Thus negativeItem is no use in this mode.
     * (2) parseMode === logicSetFactory.NO_POSITIVE_MEANS_EMPTY: (default)
     *     For example:
     *     null means universal set.
     *     [] means universal set.
     *     ['!line'] means
     *         (universal subtract 'line').
     */

    var $ = require('jquery');
    var dtLib = require('dt/lib');
    var innerFactory = dtLib.makeInner();
    var innerSet = dtLib.makeInner();

    // 'instanceof' is not reliable (in crossing iframe and some postMessage scene).
    var SET_MARK = '__\x06isLogicSet';
    var UNIVERSAL_SET = new dtLib.Set();

    /**
     * @public
     */
    var ParseMode = {
        NO_POSITIVE_MEANS_UNIVERSAL: 'NoPositiveMeansUniversal',
        NO_POSITIVE_MEANS_EMPTY: 'NoPositiveMeansEmpty'
    };


    // --------------------------------------------
    // LogicSetFactory
    // --------------------------------------------


    /**
     * @pubilc
     * @param {Object=} options
     * @param {string|Array.<string>|Set=} [options.universal]
     * @param {string=} [options.parseMode]
     * @param {boolean=} [options.toLowerCase]
     */
    var LogicSetFactory = function (options) {
        options = options || {};
        var innerThis = innerFactory(this);
        innerThis.parseMode = options.parseMode || ParseMode.NO_POSITIVE_MEANS_UNIVERSAL;
        innerThis.toLowerCase = options.toLowerCase;
        innerThis.universal = new dtLib.Set.getSet(options.universal);

        if (innerThis.toLowerCase) {
            innerThis.universal = innerThis.universal.map(mapToLowerCase);
        }
    };

    LogicSetFactory.prototype = {
        /**
         * @public
         * @param {string|Array.<string>|Set|LogicSet} value like:
         *                                                   'line',
         *                                                   or ['line', 'pie', '!bar'],
         *                                                   or 'line, pie'
         * @param {Object=} options
         * @param {string=} [options.parseMode]
         * @param {string=} [options.dontValidate] default false
         */
        createSet: function (value, options) {
            return new LogicSet(value, options, this);
        },
        /**
         * @public
         */
        getUniversal: function () {
            return innerFactory(this).universal;
        }
    };

    LogicSetFactory.prototype.constructor = LogicSetFactory;

    $.extend(LogicSetFactory, ParseMode);

    innerFactory.attach(LogicSetFactory);


    // --------------------------------------------
    // LogicSet
    // --------------------------------------------


    /**
     * @private
     * @class
     */
    var LogicSet = function (value, options, factory) {
        options = options || {};
        var innerThis = innerSet(this);
        var innerFac = innerFactory(factory);
        innerThis.parseMode = options.parseMode || innerFac.parseMode;
        innerThis.toLowerCase = innerFac.toLowerCase;
        innerThis.factory = factory;
        this[SET_MARK] = true;
        this.reset(value);
    };

    /**
     * Whether the input is an instance of Set.
     *
     * @public
     * @static
     * @param {*} value
     * @return {boolean} is set
     */
    LogicSet.isLogicSet = function (value) {
        return isObject(value) && !!value[SET_MARK];
    };

    LogicSet.prototype = {

        /**
         * @public
         * @param {string|Array.<string>|Set|LogicSet} value
         * @return {Set}
         */
        reset: function (value) {
            $.extend(innerSet(this), this._normalize(value));
            return this;
        },

        /**
         * Make intersection.
         *
         * @public
         * @param {LogicSet} logicSet
         * @return {LogicSet}
         */
        intersects: function (logicSet) {
            dtLib.assert(this.getFactory() === logicSet.getFactory());

            // Logic description:
            // (A_positive intersects (universal subtracts A_negative))
            // intersects
            // (B_positive intersects (universal subtracts B_negative))
            // ===
            // (A_positive intersects B_positive)
            // subtracts
            // (A_negative union B_negative)

            var pSet = intersects(getSet(this, true), getSet(logicSet, true));
            var nSet = union(getSet(this, false), getSet(logicSet, false));
            var result = subtracts(pSet, nSet);

            var resultLogicSet = new LogicSet(null, null, this.getFactory());
            $.extend(innerSet(resultLogicSet), result);
            return resultLogicSet;
        },

        /**
         * @public
         * @return {boolean}
         */
        isEmpty: function () {
            return this.count() === 0;
        },

        /**
         * @public
         */
        isUniversal: function () {
            var innerThis = innerSet(this);
            return innerThis.isUniversal
                || innerThis.set.count() === (
                        innerThis.isNegative
                            ? 0 : this.getFactory().getUniversal().count()
                    );
        },

        /**
         * @public
         */
        count: function () {
            var innerThis = innerSet(this);
            var universal = this.getFactory().getUniversal();

            if (innerThis.isUniversal) {
                return universal.count();
            }
            else if (innerThis.isNegative) {
                return universal.subtracts(innerThis.set).count();
            }
            else {
                return innerThis.set.count();
            }
        },

        /**
         * @public
         */
        list: function (allPositive) {
            var innerThis = innerSet(this);
            var universal = this.getFactory().getUniversal();

            if (innerThis.isUniversal) {
                return universal.list();
            }
            if (innerThis.isNegative) {
                if (allPositive) {
                    return universal.subtracts(innerThis.set).list();
                }
                else {
                    return innerThis.set.map(function (item) {
                        return '!' + item;
                    }).list();
                }
            }
            else {
                return innerThis.set.list();
            }
        },

        /**
         * @private
         * @param {string|Array.<string>|Set|LogicSet} value
         * @return {Object}
         */
        _normalize: function (value) {
            var innerThis = innerSet(this);
            var factory = this.getFactory();
            var toLowerCase = innerThis.toLowerCase;

            if (LogicSet.isLogicSet(value)) {
                dtLib.assert(value.getFactory() === factory);
                var cloned = cloneLogicSet(value, factory);
                if (toLowerCase) {
                    cloned.set = cloned.set.map(mapToLowerCase);
                }
                return;
            }

            var inputSet = dtLib.Set.getSet(value);
            if (toLowerCase) {
                inputSet = inputSet.map(mapToLowerCase);
            }

            var classifyResult = inputSet.classify(classifier, ['positiveSet', 'negativeSet']);

            if (!innerThis.dontValidate) {
                dtLib.assert(factory.getUniversal().contains(classifyResult.positiveSet));
                dtLib.assert(factory.getUniversal().contains(classifyResult.negativeSet));
            }

            if (innerThis.parseMode === ParseMode.NO_POSITIVE_MEANS_UNIVERSAL
                && classifyResult.positiveSet !== UNIVERSAL_SET
                && classifyResult.positiveSet.isEmpty()
            ) {
                classifyResult.positiveSet = UNIVERSAL_SET;
            }

            // Logic description:
            // (A_positive intersects (universal subtracts A_negative))
            // equals to
            // (A_positive subtracts A_negative)

            return subtracts(classifyResult.positiveSet, classifyResult.negativeSet);
        },

        /**
         * @public
         */
        getFactory: function () {
            return innerSet(this).factory;
        }
    };

    function isObject(value) {
        return Object(value) === value;
    }

    LogicSet.prototype.constructor = LogicSet;

    innerSet.attach(LogicSet);

    /**
     * @inner
     */
    function classifier(applicableStr) {
        return applicableStr.indexOf('!') === 0
            ? {negativeSet: applicableStr.slice(1)}
            : {positiveSet: applicableStr};
    }

    /**
     * @inner
     */
    function cloneLogicSet(inputLogicSet, factory) {
        var ret = new LogicSet(null, null, factory);
        var innerRet = innerSet(ret);
        innerRet.isUniversal = inputLogicSet.isUniversal;
        innerRet.isNegative = inputLogicSet.isNegative;
        innerRet.set = inputLogicSet.set.clone();
        return ret;
    }

    /**
     * @inner
     */
    function intersects(a, b) {
        if (a === UNIVERSAL_SET) {
            return b === UNIVERSAL_SET ? b : b.clone();
        }
        else if (b === UNIVERSAL_SET) {
            return a === UNIVERSAL_SET ? a : a.clone();
        }
        else {
            return a.intersects(b);
        }
    }

    /**
     * @inner
     */
    function union(a, b) {
        if (a === UNIVERSAL_SET || b === UNIVERSAL_SET) {
            return UNIVERSAL_SET;
        }
        else {
            var ret = new dtLib.Set();
            ret.add(a).add(b);
            return ret;
        }
    }

    /**
     * @inner
     */
    function mapToLowerCase(item) {
        return $.type(item) === 'string' ? item.toLowerCase() : item;
    }

    /**
     * @inner
     */
    function subtracts(a, b) {
        var result = {set: new dtLib.Set(), isNegative: false, isUniversal: false};

        if (b !== UNIVERSAL_SET) {
            if (a === UNIVERSAL_SET) {
                if (b.isEmpty()) {
                    result.isUniversal = true;
                }
                else {
                    result.set = new dtLib.Set(b);
                    result.isNegative = true;
                }
            }
            else { // a !== UNIVERSAL_SET
                result.set = a.subtracts(b);
            }
        }

        return result;
    }

    /**
     * Get positive set or negative set from a logic set.
     *
     * @inner
     */
    function getSet(logicSet, getPositive) {
        var innerObj = innerSet(logicSet);
        if (innerObj.isUniversal) {
            return UNIVERSAL_SET;
        }
        else if (
            (getPositive && !innerObj.isNegative)
            || (!getPositive && innerObj.isNegative)
        ) {
            return innerObj.set;
        }
        else if (getPositive) {
            return UNIVERSAL_SET;
        }
        else { // !getPositive
            return new dtLib.Set();
        }
    }

    return LogicSetFactory;
});