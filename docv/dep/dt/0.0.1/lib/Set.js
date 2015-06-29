/**
 * @file A simple 'set'
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var $ = require('jquery');

    // 'instanceof' is not reliable (in crossing iframe and some postMessage scene).
    var SET_MARK = '__\x06isDTLibSet';

    /**
     * A simple 'set'
     *
     * @public
     * @class
     * @param {string|Array.<string>|Set} value like: 'line', or ['line', 'pie'], or 'line, pie'
     */
    var Set = function (value) {
        this._valueSet = {};
        this[SET_MARK] = true;
        this.reset(value);
    };

    /**
     * If input is set, then return it, Otherwise create set.
     *
     *
     * @public
     * @static
     * @param {*} value
     * @return {Set}
     */
    Set.getSet = function (value) {
        return Set.isSet(value) ? value : new Set(value);
    };

    /**
     * Whether the input is an instance of Set.
     *
     * @public
     * @static
     * @param {*} value
     * @return {boolean} is set
     */
    Set.isSet = function (value) {
        return isObject(value) && !!value[SET_MARK];
    };

    Set.prototype = {

        /**
         * @public
         * @param {string|Array.<string>|Set} value
         * @return {Set}
         */
        add: function (value) {
            $.extend(this._valueSet, this._normalize(value));
            return this;
        },

        /**
         * @public
         * @param {string|Array.<string>|Set} value
         * @return {Set}
         */
        reset: function (value) {
            this._valueSet = this._normalize(value);
            return this;
        },

        /**
         * @public
         * @param {string|Array.<string>|Set} value
         * @return {boolean}
         */
        contains: function (value) {
            var inputSet = this._normalize(value);
            for (var key in inputSet) {
                if (inputSet.hasOwnProperty(key) && !this._valueSet.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Make intersection.
         *
         * @public
         * @param {string|Array.<string>|Set} value
         * @return {boolean}
         */
        intersects: function (value) {
            var inputSet = this._normalize(value);
            var intersection = [];
            for (var key in inputSet) {
                if (inputSet.hasOwnProperty(key) && this._valueSet.hasOwnProperty(key)) {
                    intersection.push(key);
                }
            }
            return new Set(intersection);
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
         * @return {number}
         */
        count: function () {
            var count = 0;
            for (var value in this._valueSet) {
                if (this._valueSet.hasOwnProperty(value)) {
                    count++;
                }
            }
            return count;
        },

        /**
         * @pubilc
         * @return {Array.<string>}
         */
        list: function () {
            var set = this._valueSet;
            var list = [];
            for (var key in set) {
                if (set.hasOwnProperty(key)) {
                    list.push(key);
                }
            }
            return list;
        },

        /**
         * @public
         * @return {Set}
         */
        clone: function () {
            return new Set(this);
        },

        /**
         * @inner
         * @param {string|Array.<string>|Set} value
         * @return {Object}
         */
        _normalize: function (value) {
            var set = {};
            var type = $.type(value);

            if (!value) {
                return set;
            }

            if (Set.isSet(value)) {
                value = value.list();
            }
            else if (type === 'string') {
                value = value.split(',');
                for (var i = 0, len = value.length; i < len; i++) {
                    value[i] = $.trim(value[i]);
                }
            }
            else if (type !== 'array') {
                throw new Error();
            }

            for (var i = 0, len = value.length; i < len; i++) {
                set[value[i]] = 1;
            }
            return set;
        }
    };

    function isObject(value) {
        return Object(value) === value;
    }

    Set.prototype.constructor = Set;

    return Set;
});