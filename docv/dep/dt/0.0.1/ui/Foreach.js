/**
 * @file 顺序表容器
 * @author sushuang(sushuang@baidu.com)
 * @date 2014-03
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var Component = require('./Component');
    var ChangeKey = lib.obArray.ChangeKey;

    var ITEMS_PROP = '\x0E\x0E-foreach-items-prop';

    /**
     * 顺序表。能够根据viewModel的变化动态改变。
     * 输入的viewModel须是一个lib.obArray。
     * 模板中的声明方式：
     *
     * <div data-cpt="
     *     type: 'foreach',
     *     viewModelGet: 'someObArray', // foreach本身的viewModel，是一个lib.obArray。
     *                                  // 里面每项是item的viewModel。
     *     itemType: 'someItemClz', // 表示每项使用的Component类，缺省则使用默认的Foreach.prototype.Item。
     *     itemTplTarget: 'xxx', // 表示用于渲染每项节点html的tplTarget，缺省则为一个空的<div></div>。
     *                           // 注意，此tpl中的dom须有个单个根节点，而不可多个dom根节点并列。
     *     itemTplParam: {aaa: 'xxx', bbb: 'yyy', ... } // 表示渲染节点时可传入的参数，可缺省。
     *                                                  // 只用于模板渲染。如果只是用viewModel向item传递参数，
     *                                                  // 不需要这个，只需在someObArray中定义即可。
     *                                                  // 可在模板中这么使用${viewModel.itemTplParam.aaa}。
     *     "></div>
     *
     * 如果需要对每个item分别定义，则：
     *
     * <div data-cpt="
     *     type: 'foreach',
     *     itemConfigAttr: 'attr1', // 表示从item的viewModel的attr1中取itemConfig。
     *     ...
     * itemConfig的结构是 {
     *     itemType: 'TheItemType', // 解释同上
     *     itemTplTarget: 'xxx', // 解释同上
     *     itemTplParam: {aaa: 'xxx', bbb: 'yyy', ... } // 解释同上
     * }
     */
    var Foreach = Component.extend({

        _define: {
            viewModel: function () {
                return {
                    data: lib.obArray([])
                };
            },
            viewModelPublic: ['data'],
            css: 'cpt-foreach'
        },

        /**
         * @override
         */
        _prepare: function () {
            var data = this._viewModel().data;

            this._sub(ITEMS_PROP, []);
            this._setItemsContainer();

            // 监听list改变
            this._disposable(
                data.subscribe(handleChange, this, 'arrayChange')
            );

            // 初始设值
            var initChangeOp = {
                key: ChangeKey.SPLICE,
                index: 0,
                removeCount: 0,
                added: []
            };
            for (var i = 0, arr = data.peek(), len = arr.length; i < len; i++) {
                initChangeOp.added.push(arr[i]);
            }
            handleChange.call(this, initChangeOp);
        },

        /**
         * @override
         */
        _dispose: function () {
            this.foreach(function (index, item) {
                item.dispose();
            });
        },

        /**
         * @override
         */
        _parseViewModel: function (inputViewModel) {
            lib.assert(lib.obTypeOf(inputViewModel) === 'obArray');
            return {data: inputViewModel};
        },

        /**
         * 遍历所有item cpt
         *
         * @public
         * @param {Function} callback 参数是：index, itemCptInstance
         */
        foreach: function (callback) {
            var items = this._items();
            for (var i = 0, len = items.length; i < len; i++) {
                callback(i, items[i]);
            }
        },

        /**
         * 根据index得到item cpt
         *
         * @public
         * @param {number} index index
         * @return {Object} item cpt instance
         */
        getItemAt: function (index) {
            return this._items()[index];
        },

        /**
         * 得到item数量
         *
         * @public
         * @return {number} item数量
         */
        count: function () {
            return this._viewModel().data.count();
        },

        /**
         * 得到items数组
         *
         * @protected
         * @return {Object} item
         */
        _items: function () {
            return this._sub(ITEMS_PROP);
        },

        /**
         * 设置内容的容器。默认为this.$el()本身。如果有派生类则可override
         *
         * @protected
         */
        _setItemsContainer: function () {
            this._prop('$itemsContainer', this.$el());
        },

        /**
         * @protected
         * @param {string} name config attr name
         * @return {*} config content
         */
        _getCommonConfig: function (name) {
            // 传入的cptDef优先级高，派生类设置的优先级低。
            return this.getCptDef(name) || this._getDefineProperty(name);
        }

    });

    // @see lib.obArray.ChangeKey in dataDriven.js
    function handleChange(changeOp) {
        changeOpMethods[changeOp.key].call(this, changeOp); // eslint-disable-line no-use-before-define
    }

    var changeOpMethods = {};

    changeOpMethods[ChangeKey.REMOVE] = function (changeOp) {
        var indexes = changeOp.indexes;
        for (var i = 0, len = indexes.length; i < len; i++) {
            removeItems.call(this, indexes[i], 1);
        }
    };

    changeOpMethods[ChangeKey.SPLICE] = function (changeOp) {
        if (changeOp.removeCount) {
            removeItems.call(this, changeOp.index, changeOp.removeCount);
        }
        if (changeOp.added.length) {
            addItems.call(this, changeOp.index, changeOp.added);
        }
    };

    changeOpMethods[ChangeKey.MOVE] = function (changeOp) {
        moveItem.call(this, changeOp.originIndex, changeOp.finalIndex);
    };

    /**
     * 增加节点
     *
     * @private
     * @param {number} index index
     * @param {Array} values 要增加的节点
     */
    function addItems(index, values) {
        var items = this._items();

        // 共有的item定义
        var itemTplTarget = this._getCommonConfig('itemTplTarget');
        var itemTplParam = this._getCommonConfig('itemTplParam');
        var itemType = this._getCommonConfig('itemType');
        var ItemClz = itemType ? this.getCptClass(itemType) : this.Item;

        for (var i = 0, len = values.length; i < len; i++) {
            var subViewModel = values[i];

            // 每项的item定义（如果有的话）可覆盖共有的item定义
            var itemConfigAttr = this.getCptDef('itemConfigAttr');
            if (itemConfigAttr && subViewModel) {
                var itemConf = subViewModel[itemConfigAttr];
                itemConf.itemType && (ItemClz = this.getCptClass(itemConf.itemType));
                itemConf.itemTplTarget && (itemTplTarget = itemConf.itemTplTarget);
                itemConf.itemTplParam && (itemTplParam = itemConf.itemTplParam);
            }

            // 插入dom
            var $newEl = $(
                itemTplTarget
                    ? this._renderTpl(
                        itemTplTarget,
                        {index: index + i, itemTplParam: itemTplParam}
                    )
                    : '<div></div>'
            );
            lib.assert($newEl.length === 1); // 需要有单个根节点，而不可是多个根节点并列。
            insertItemEl.call(this, $newEl, index + i);

            // 初始化item实例
            var newItem = new ItemClz($newEl, subViewModel);
            items.splice(index + i, 0, newItem);
        }
    }

    /**
     * 删除节点
     *
     * @private
     * @param {number} index index
     * @param {number} removeCount removeCount
     */
    function removeItems(index, removeCount) {
        var items = this._items();
        var removed = items.splice(index, removeCount);

        for (var i = 0, len = removed.length; i < len; i++) {
            var item = removed[i];
            var $itemEl = item.$el();
            item.dispose();
            $itemEl.remove();
        }
    }

    /**
     * 移动节点
     *
     * @private
     * @param {number} originIndex originIndex
     * @param {number} finalIndex finalIndex
     */
    function moveItem(originIndex, finalIndex) {
        var items = this._items();
        var item = items[originIndex];
        var $itemEl = item.$el();
        var $refItemEl = items[finalIndex].$el();

        if (finalIndex > originIndex) {
            $itemEl.insertAfter($refItemEl);
        }
        else {
            $itemEl.insertBefore($refItemEl);
        }

        items.splice(originIndex, 1)[0];
        items.splice(finalIndex, 0, item);
    }

    /**
     * 插入el
     *
     * @private
     * @param {jQuery} $newEl new el
     * @param {number} index index
     * @return {jQuery} new el
     */
    function insertItemEl($newEl, index) {
        var items = this._items();
        if (!items.length || index >= items.length) {
            return $newEl.appendTo(this._prop('$itemsContainer'));
        }
        else {
            return $newEl.insertBefore(items[index].el());
        }
    }

    /**
     * 默认使用的顺序表项
     * 可在tpl中设置 itemType 来替换，或者被继承。
     *
     * @public
     * @class
     */
    Foreach.prototype.Item = Component.extend({
        _define: {
            css: 'dtui-foreach-item',
            // view model 可以任意透传
            viewModelOnlyAccessDeclaredProperties: false
        }
    });

    // /**
    //  * @see ko.utils.compareArrays 因为此算法太繁杂也不完全全面，启用
    //  * changes中每项的格式：
    //  * status: 枚举：'deleted', 'added', 'retained'（不会出现retained，因为指定了sparse）
    //  * moved: 表示移动（added时表示从哪个index移来，deleted时表示从哪个index移走）
    //  * value: 项的值
    //  * index: changes是按照index升序排列的。
    //  *      index表示“在比自身小的最后的changeItem操作结束后的index”（所以顺序遍历changes可还原操作过程）（这句话怀疑是错误的的，如splice清空时）。
    //  *      而index同样的项，只有可能出现一个added一个deleted，这两个顺序不一定
    //  *      （看oldarr.length和newArr.lengh谁大，因为内部逻辑是compareSmallArrayToBigArray）
    //  *      例如可能出现 [..., {index: 4, status: 'added'}, {index: 4, status: 'deleted'} ... ]，也有可能反之。
    //  *      同为added 或 同为deleted 的项的 index 不会重复。
    //  */
    // _handleChange: function (changes) {
    //     // FIXME
    //     // 对于用splice清空数组的情况，下面算法的实现是错误的！

    //     // FIXME
    //     // 此方法欠严格测试：
    //     // ko.utils.compareArrays(..., {sparse: true})
    //     // ['t', 't', 't', 't', 'a', 'b', 'c', 'd'], ['t', 't', 't', 't', 'a', '99', '66', 'c', 'd']
    //     // ['t', 't', 't', 't', 'a', 'b'], ['t', 't', 't', 't', 'a', 'b', '66', 'c', 'd']
    //     // ['t', 't', 't', 't', 'a', 'b'], ['t', 't', 't', 't', 'a', '66', 'c', 'b']
    //     // ['t', 't', 't', 't', 'a', 'b'], ['t', 't', 't', 't', '999', 'a', 'c', 'b']
    //     // ['t', 't', 't', 't', 'a', 'b'], ['t', 't', 't', 't', '999', 'b', 'a']
    //     // ['t', 't', 't', 't', '999', 'a', 'b'], ['t', 't', 't', 't', 'b', 'a']
    //     // ['t', 't', 't', 't', '999', 'a', 'b'], ['t', 't', 't', 't', 'b', 'x']
    //     // ['t', 't', 't', 't', '999', 'a', 'b'], ['t', 't', 't', 't', 'x', 'x']
    //     // ['t', 't', 't', 't', '999', 'a', 'b'], ['t', 't', 't', 't', 'x']
    //     // ['t', 't', 't', 't', '999', 'a'], ['t', 't', 't', 't', 'x']
    //     // ['t', 't', 't', 't', '999'], ['t', 't', 't', 't', 'x']
    //     // 下面这两个个例子里delete后的index规则不同，不理解
    //     // ['t', 't', 't', 't', 'a', 'e', 'f'], ['t', 't', 't', 't', 'a']
    //     // ['t', 't', 't', 't', 'a', 'e', 'f'], ['t', 't', 't', 't', 'a', 'f', 'r']
    //     // 下面这个例子没有探测出move，看来这个算法不理解。
    //     // ['t', 't', 't', 't', 'a', 'e', 'e1', 'g', 'f'], ['t', 't', 't', 't', 'a', 'g', 'f', 'r']
    //     // ['t', 't', 't', 't', 'a', 'e', 'b', 'f', 'c'], ['t', 't', 't', 't', 'a', 'b', 'c', 'r']

    //     // TODO
    //     // 批量修改优化：连续added、连续deleted、连续added/deleted交错

    //     this._prop('moveTemp', {});

    //     for (var i = 0, thisIndex = -1, thisAdded, thisDeleted, len = changes.length;
    //         i < len;
    //         i++
    //     ) {
    //         var thisChange = changes[i];
    //         var nextChange = changes[i + 1];

    //         if (thisChange.index > thisIndex) {
    //             thisIndex = thisChange.index;
    //             thisAdded = thisDeleted = null;
    //         }

    //         if (thisChange.status === 'added') {
    //             thisAdded = thisChange;
    //         }
    //         else if (thisChange.status === 'deleted') {
    //             thisDeleted = thisChange;
    //         }
    //         else {
    //             continue;
    //         }

    //         if (nextChange && nextChange.index === thisChange.index) {
    //             continue;
    //         }

    //         // 此时已经准备好本index层级的 thisAdded 和 thisDeleted。
    //         // 先delete 再 add。
    //         thisDeleted && removeItem.call(this, thisChange);
    //         thisAdded && addItem.call(this, thisChange);
    //     }

    //     // 最后替换所有为move而做的fake
    //     var items = this._items();
    //     for (var i = 0, len = items.length; i < len; i++) {
    //         replaceFake.call(this, items[i], i);
    //     }

    //     this._prop('moveTemp', null);
    // }


    return Foreach;
});
