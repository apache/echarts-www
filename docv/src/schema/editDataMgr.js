/**
 * edit data manager
 */
define(function (require) {

    var dtLib = require('dt/lib');
    var docUtil = require('../common/docUtil');
    var schemaHelper = require('../common/schemaHelper');
    // 改变属性名称时属性顺序会变，这小工具，没工夫细细研究了，临时改成了mockImmutable。
    var immutable = mockImmutable(); // require('immutable');

    var UNDEFINED;

    /**
     * @public
     * @type {Object}
     */
    var mgr = {};

    var originalSchema; // May be for diff.
    var currentSchema; // Just for cache.
    var currentSchemaRenderTree; // Just for cache.
    var currentSchemaStatistic; // Just for cache.
    var historyStack = [];
    var historyNextIndex = 0;
    var currentWorldOpt = {authKey: Math.random() + '', force: true};
    var currentWorldOb = dtLib.ob(null, null, currentWorldOpt);

    /**
     * @public
     */
    mgr.TimelineMoveType = {
        MOVE_ON: 'moveOn',
        JUMP: 'jump'
    };

    /**
     * @pubilc
     * @param {Object} schema
     */
    mgr.init = function (schema) {
        dtLib.assert(schema);
        originalSchema = schema;
        worldMoveOn({immutableSchema: immutable.fromJS(schema)});
    };

    /**
     * @public
     */
    mgr.getSchema = function () {
        if (!currentSchema) {
            currentSchema = getCurrent().immutableSchema.toJS();
        }
        return currentSchema;
    };

    /**
     * @public
     */
    mgr.getSchemaText = function () {
        var schema = this.getSchema();
        try {
            return JSON.stringify(schema, null, 4);
        }
        catch (e) {
            docUtil.log('Generate schema error!');
        }
    };

    /**
     * @public
     */
    mgr.getSchemaRenderTree = function () {
        if (!currentSchemaRenderTree) {
            currentSchemaRenderTree = makeRenderTree();
        }
        return currentSchemaRenderTree;
    };

    /**
     * @pubilc
     */
    mgr.getSchemaStatistic = function () {
        if (!currentSchemaStatistic) {
            currentSchemaStatistic = schemaHelper.statisticSchema(mgr.getSchema());
        }
        return currentSchemaStatistic;
    };

    /**
     * @inner
     */
    function makeRenderTree() {
        var renderBase = {};
        schemaHelper.buildDoc(
            mgr.getSchema(),
            renderBase,
            mgr.getSchemaStatistic().universal,
            schemaHelper.buildDoc.schemaJsonRenderer,
            'schema'
        );

        return {
            value: 'definitions',
            text: 'definitions',
            itemName: 'definitions',
            schemaPath: [],
            editable: {},
            children: renderBase.children[0].children,
            expanded: true
        };
    }

    /**
     * @public
     */
    mgr.isOnRoot = function (val) {
        var renderTree = mgr.getSchemaRenderTree();
        return renderTree && renderTree.value === val;
    };

    /**
     * @public
     */
    mgr.getHistoryNextIndex = function () {
        return historyNextIndex;
    };

    /**
     * @public
     */
    mgr.getHistoryCount = function () {
        return historyStack.length;
    };

    /**
     * @public
     * @param {string} path
     * @param {*} val It means "delete" when val is undefined.
     */
    mgr.updateSchemaDataItem = function (path, val) {
        var newPath = path.slice();
        var basePath = path.slice(0, path.length - 1);
        newPath.unshift('definitions');
        docUtil.log(
            'persistent: [' + newPath.join('.') + '] = '
            + (val === UNDEFINED ? '(delete)' : val)
        );

        var eventArgs = {selectedValue: basePath.join('.')};
        var currImmu = getCurrent().immutableSchema;
        var record = {
            immutableSchema: val === UNDEFINED
                ? currImmu.deleteIn(newPath)
                : currImmu.setIn(newPath, val),
            selectedValue: eventArgs.selectedValue
        };
        worldMoveOn(record, eventArgs);
    };

    /**
     * @public
     */
    mgr.renamePropertySchemaDataItem = function (path, newPropertyName) {
        dtLib.assert(path.length);
        var basePath = path.slice(0, path.length - 1);
        basePath.unshift('definitions');
        var originalPropertyName = path[path.length - 1];

        if (originalPropertyName === newPropertyName) {
            return;
        }

        docUtil.log('persistent: [' + path.join('.') + '] = ' + newPropertyName);

        // 需要更新完后顺序也对
        var im = getCurrent().immutableSchema;
        var bak = im.getIn(basePath).toJS();
        bak[newPropertyName] = bak[originalPropertyName];
        bak = docUtil.changeIterationSequence(bak, newPropertyName, 'after', originalPropertyName);
        delete bak[originalPropertyName];
        im = im.deleteIn(basePath);
        im = im.setIn(basePath, immutable.fromJS(bak));

        var eventArgs = {
            selectedValue: path.slice(0, path.length - 1).concat([newPropertyName]).join('.')
        };
        worldMoveOn({immutableSchema: im, selectedValue: eventArgs.selectedValue}, eventArgs);
    };

    /**
     * @public
     */
    mgr.canTimelineJump = function (offset) {
        return getTimelineMoveNextIndex(offset) != null;
    };

    /**
     * @public
     */
    mgr.timelineJump = function (offset) {
        var nextIndex = getTimelineMoveNextIndex(offset);
        if (nextIndex != null) {
            historyNextIndex = nextIndex;
            clearCache();
            var current = getCurrent();
            // Trigger event.
            var args = {
                moveType: mgr.TimelineMoveType.JUMP,
                selectedValue: current.selectedValue
            };
            currentWorldOb(args, null, currentWorldOpt);
        }
    };

    /**
     * @public
     */
    mgr.subscribeTimelineMove = function (onChange, scope) {
        currentWorldOb.subscribe(onChange, scope);
    };

    /**
     * @inner
     */
    function getTimelineMoveNextIndex(offset) {
        var nextIndex = historyNextIndex + offset;
        return nextIndex > 0 && nextIndex <= historyStack.length
            ? nextIndex : null;
    }

    /**
     * @inner
     */
    function getCurrent() {
        return historyStack[historyNextIndex - 1];
    }

    /**
     * @inner
     */
    function worldMoveOn(record, eventArgs) {
        var len = historyStack.length;
        var item = {
            immutableSchema: record.immutableSchema,
            selectedValue: record.selectedValue,
            timestamp: +new Date()
        };

        historyStack.splice(historyNextIndex, len - historyNextIndex, item);
        historyNextIndex++;
        clearCache();

        // Trigger event.
        eventArgs = dtLib.assign({moveType: mgr.TimelineMoveType.MOVE_ON}, eventArgs);
        currentWorldOb(eventArgs, null, currentWorldOpt);
    }

    /**
     * @inner
     */
    function clearCache() {
        currentSchema = null;
        currentSchemaRenderTree = null;
        currentSchemaStatistic = null;
    }

    /**
     * @inner
     */
    function mockImmutable() {
        function Immu(raw) {
            this._raw = raw;
        }
        var proto = Immu.prototype;

        proto.toJS = function () {
            return dtLib.clone(this._raw, true);
        };

        proto.setIn = function (path, val) {
            if (val instanceof Immu) {
                val = val.toJS();
            }
            var newRaw = dtLib.clone(this._raw, true);
            dtLib.setByPath(path.join('.'), val, newRaw);
            return new Immu(newRaw);
        };

        proto.getIn = function (path) {
            return new Immu(dtLib.getByPath(path.join('.'), this._raw));
        };

        proto.deleteIn = function (path) {
            var newRaw = dtLib.clone(this._raw, true);
            dtLib.deleteByPath(path.join('.'), newRaw);
            return new Immu(newRaw);
        };

        return {
            fromJS: function (raw) {
                return new Immu(dtLib.clone(raw, true));
            }
        };
    }

    return mgr;
});
