/**
 * @file Tree list (forest)
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var Component = require('./Component');
    var encodeHTML = lib.encodeHTML;

    // Constant
    var PATH_ATTR = 'data-item-path';
    var LEVEL_ATTR = 'data-item-level';
    var SLIDE_INTERVAL = 500;
    var UNDEFINED;

    /**
     * @class
     * @extends dt/ui/Component
     */
    var TreeSelect = Component.extend({

        _define: {
            css: 'dtui-treelist',
            viewModel: function () {
                return {
                    /**
                     * 如果是lib.ob则表示单选，其值对应于datasource中的value，表示选中的项。
                     * 如果是lib.obArray则表示多选，其中：obArray中每项是value
                     * 可在valueInfo中设置参数：{
                     *     noAnimation: boolean 关闭动画，默认false
                     *     scrollToTarget: 滚屏到第一个目标。默认undefined（不滚屏）。
                     *                     {Object} 表示滚屏到第一个目标在浏览器窗口中所处的位置，
                     *                     Object内容为：{clientX: number}。
                     *     collapseLevel: number 用于达到“先折叠再展开”的效果。
                     *                           默认null即不collapse。
                     *                           传入collapse level，即最高折叠到树的这层，最高是0层。
                     *     onSlideEnd: Function 动画结束的回调。关闭动画时也会异步触发之。
                     * }
                     * 可以对此ob进行监听：
                     * treeList.viewModel('selected').subscribe(function (nextValue, ob) {
                     *     // 这里nextValue 就是树节点上的value字段
                     *     // 如果要获取整个树节点的信息(dataItem)，使用：
                     *     var dataItem = ob.peekValueInfo('dataItem');
                     * });
                     */
                    selected: lib.ob(),
                    /**
                     * hovered
                     * 可在valueInfo中设置参数以及监听：同viewModel.selected
                     */
                    hovered: lib.ob(),
                    /**
                     * highlighted
                     * 可在valueInfo中设置参数：同viewModel.selected
                     */
                    highlighted: lib.obArray(),
                    /**
                     * @type {Array.<Object>}
                     *
                     * 每项为：
                     * {
                     *  value: ..., // 不禁止value重复。如果重复，同value的项会同时被选中。不可为undefined。
                     *  text: ...,
                     *  tooltip: ..., // 鼠标hover提示文字，如果需要的话，string。
                     *  tooltipEncodeHTML: ... // 文字是否要encdeHTML，默认为true。
                     *  children: [ {同构子项}, {}, ... ]
                     *  childrenPre: // children前文字，如 ": {"
                     *  childrenPost: // children后文字，如 "}"
                     *  childrenBrief: // chilren折叠时显示的文字，如 "..."
                     *  expanded: {boolean} 初始状态是展开还是折叠。默认折叠（false）
                     * }
                     * 不能有空项。value可为任意基本类型。
                     */
                    datasource: [],
                    /**
                     * 大小改变事件。展开折叠时触发。
                     */
                    resizeEvent: lib.ob()
                };
            },
            viewModelPublic: ['selected', 'hovered', 'highlighted', 'resizeEvent']
        },

        /**
         * @override
         */
        _init: function () {
            var viewModel = this._viewModel();
            lib.assert(lib.obTypeOf(viewModel.selected));
            lib.assert(lib.obTypeOf(viewModel.highlighted) === 'obArray');

            this._initContent();
            this._initTooltip();
            this._initChange();
            this._initMouse();
            this._initExpand();
        },

        /**
         * @private
         */
        _getCss: function (type) {
            var suffix = ({
                item: '-i',
                thumb: '-thumb',
                text: '-text',
                textActive: '-text-active',
                textHover: '-text-hover',
                textHighlight: '-text-highlight',
                list: '-list',
                parent: '-parent',
                collapsed: '-collapsed',
                expanded: '-expanded',
                post: '-post'
            })[type || ''];

            return this.css() + suffix;
        },

        /**
         * @private
         */
        _initContent: function () {
            var itemCss = this._getCss('item');
            var parentCss = this._getCss('parent');
            var thumbCss = this._getCss('thumb');
            var collapsedCss = this._getCss('collapsed');
            var textCss = this._getCss('text');
            var listCss = this._getCss('list');
            var postCss = this._getCss('post');
            var html = [];

            this._travelData(
                this._viewModel().datasource,
                {
                    preList: function (treeList, thisPath, parent) {
                        // 第一层（树林的根）展开，其他默认收缩。
                        var display = thisPath === '' ? '' : 'display:none';
                        html.push('<ul class="', listCss, '" style="', display, '">');
                    },
                    postList: function () {
                        html.push('</ul>');
                    },
                    preChildren: function (dataItem, thisPath, parent, isLast, level) {
                        var otherCss = (dataItem.children && dataItem.children.length)
                            ? (parentCss + ' ' + collapsedCss)
                            : '';
                        var dataPath = ' ' + PATH_ATTR + '="' + thisPath + '" ';
                        var dataLevel = ' ' + LEVEL_ATTR + '="' + level + '" ';
                        var anchor = dataItem.anchor ? ' name="' + dataItem.anchor + '" ' : ' ';
                        var textHTML = encodeHTML(dataItem.text);
                        var childrenPreHTML = encodeHTML(dataItem.childrenPre || '');
                        var childrenPostHTML = encodeHTML(dataItem.childrenPost || '');
                        var childrenBriefHTML = encodeHTML(dataItem.childrenBrief || '');

                        html.push(
                            '<li class="', itemCss, ' ', otherCss, '" ', dataPath, dataLevel, '>',
                            '<i class="', thumbCss, '"></i>', // 展开收起的控制器。
                            anchor,
                            '<span href="#', thisPath,
                                '" class="', textCss, '" ', dataPath,
                                ' data-text="', textHTML,
                                '" data-children-pre="', childrenPreHTML,
                                '" data-children-post="', childrenPostHTML,
                                '" data-children-brief="', childrenBriefHTML,
                                '">',
                                textHTML, childrenPreHTML, childrenBriefHTML, childrenPostHTML,
                            '</span>'
                        );
                    },
                    postChildren: function (dataItem, thisPath, parent, isLast) {
                        html.push('</li>');
                        if (isLast && parent && parent.childrenPost) {
                            html.push('<li class="' , postCss, '">', encodeHTML(parent.childrenPost), '</li>');
                        }
                    }
                }
            );

            this.el().innerHTML = html.join('');
        },

        /**
         * @private
         */
        _initTooltip: function () {
            var datasource = this._viewModel().datasource;
            var loc = {
                x: 0,
                y: -15,
                xAnchor: 'center',
                yAnchor: 'bottom'
            };
            var that = this;

            this._disposable(lib.bindTooltip({
                bindEl: this.el(),
                followMouse: true,
                selector: '.' + this._getCss('text'),
                location: loc,
                text: getText,
                encodeHTML: false // 在getText中处理encodeHTML
            }));

            function getText(itemEl) {
                var dataItem = that._findDataItemByPath(
                    datasource, $(itemEl).attr(PATH_ATTR)
                );

                var tooltipText = (dataItem || {}).tooltip;
                if (tooltipText != null) {
                    return dataItem.tooltipEncodeHTML !== false
                        ? encodeHTML(tooltipText) : tooltipText;
                }
                // tooltipText为空则不显示tooltip
            }
        },

        /**
         * @private
         */
        _initChange: function () {
            var viewModel = this._viewModel();

            var selOb = viewModel.selected;
            this._disposable(selOb.subscribe(this._updateSelectedByModel, this));
            this._updateSelectedByModel(selOb(), selOb); // 设初始值

            var highlightedOb = viewModel.highlighted;
            this._disposable(highlightedOb.subscribe(this._updateHighlightedByModel, this));
            this._updateHighlightedByModel(highlightedOb(), highlightedOb); // 设初始值
        },

        /**
         * @private
         */
        _initMouse: function () {
            var $el = this.$el();
            var viewModel = this._viewModel();
            var itemCss = this._getCss('item');
            var textHoverCss = this._getCss('textHover');
            var textCss = this._getCss('text');
            var thumbCss = this._getCss('thumb');
            var that = this;

            // 鼠标事件
            $el.on(this._event('mouseenter'), '.' + textCss, '.' + itemCss, onItemTextEnter);
            $el.on(this._event('mouseleave'), '.' + textCss, '.' + itemCss, onItemTextLeave);
            $el.on(this._event('click'), '.' + textCss, onItemTextClick);
            $el.on(this._event('click'), '.' + thumbCss, onThumbClick);

            function onItemTextEnter(e) {
                if (viewModel.disabled()) {
                    return;
                }
                var $item = $(this);
                $item.addClass(textHoverCss);
                var dataItem = that._findDataItemByPath(
                    viewModel.datasource, $item.attr(PATH_ATTR), true
                );
                viewModel.hovered(dataItem.value, {dataItem: dataItem});
            }

            function onItemTextLeave(e) {
                $(this).removeClass(textHoverCss);
                viewModel.hovered(UNDEFINED);
            }

            function onItemTextClick(e) {
                if (viewModel.disabled()) {
                    return;
                }
                var obType = lib.obTypeOf(viewModel.selected);
                var dataItem = that._findDataItemByPath(
                    viewModel.datasource, $(this).attr(PATH_ATTR), true
                );
                var value = dataItem.value;

                if (obType === 'obArray') { // 多选
                    var selected = viewModel.selected();
                    var index = lib.arrayIndexOf(selected, value);
                    if (index >= 0) {
                        selected.splice(index, 1);
                    }
                    else {
                        selected.push(value);
                    }
                    value = selected;
                }
                // else 单选

                viewModel.selected(value, {preventExpand: true, dataItem: dataItem});
            }

            function onThumbClick() {
                if (viewModel.disabled()) {
                    return;
                }
                that._toggleSingleItem(that._findItemEl($(this)));
            }
        },

        /**
         * @protectd
         */
        _initExpand: function () {
            var that = this;
            var datasource = this._viewModel().datasource;
            var $itemEls = this.$el().find('.' + this._getCss('item')).filter(function () {
                return !!that._findDataItemByPath(datasource, $(this).attr(PATH_ATTR)).expanded;
            });
            this._expandOrCollapse($itemEls, 'expand', {noAnimation: true});
        },

        /**
         * @private
         */
        _updateSelectedByModel: function (nextValue, ob) {
            var viewModel = this._viewModel();
            var obType = lib.obTypeOf(viewModel.selected);
            var activeCss = this._getCss('textActive');
            var expandList = [];
            var that = this;

            lib.assert(obType !== 'obArray' || $.isArray(nextValue));

            this._travelItemText(function ($text, thisValue) {
                if (obType === 'obArray'
                    ? lib.arrayIndexOf(nextValue, thisValue) >= 0 // 多选情况
                    : thisValue === nextValue // 单选情况
                ) {
                    $text.addClass(activeCss);
                    if (!ob.peekValueInfo('preventExpand')) {
                        expandList.push(that._findItemEl($text));
                    }
                }
                else {
                    $text.removeClass(activeCss);
                }
            });

            this._showItems(
                $(expandList),
                {
                    noAnimation: ob.peekValueInfo('noAnimation'),
                    collapseLevel: ob.peekValueInfo('collapseLevel'),
                    onSlideEnd: ob.peekValueInfo('onSlideEnd'),
                    scrollToTarget: ob.peekValueInfo('scrollToTarget')
                }
            );
        },

        /**
         * @private
         */
        _updateHighlightedByModel: function (nextValue, ob) {
            var highlightedCss = this._getCss('textHighlight');
            var highlightList = [];
            var that = this;

            this._travelItemText(function ($text, thisValue) {
                if (lib.arrayIndexOf(nextValue, thisValue) >= 0) {
                    $text.addClass(highlightedCss);
                    if (!ob.peekValueInfo('preventExpand')) {
                        highlightList.push(that._findItemEl($text));
                    }
                }
                else {
                    $text.removeClass(highlightedCss);
                }
            });

            this._showItems(
                $(highlightList),
                {
                    noAnimation: ob.peekValueInfo('noAnimation'),
                    collapseLevel: ob.peekValueInfo('collapseLevel'),
                    onSlideEnd: ob.peekValueInfo('onSlideEnd'),
                    scrollToTarget: ob.peekValueInfo('scrollToTarget')
                }
            );
        },

        /**
         * @private
         * @param {jQuery} $itemEls
         * @param {Object=} options
         * @param {number=} [options.collapseLevel]
         * @param {boolean=} [options.noAnimation]
         * @param {Function=} [options.onSlideEnd]
         * @param {boolean=} [options.scrollToTarget]
         */
        _showItems: function ($itemEls, options) {
            options = options || {};
            var $ancestors = this._getAncestorItems($itemEls);

            this._collapseAll({
                collapseLevel: options.collapseLevel,
                noAnimation: options.noAnimation,
                onSlideEnd: $.proxy(doExpand, this)
            });

            function doExpand() {
                this._expandOrCollapse(
                    $ancestors, 'expand',
                    {noAnimation: options.noAnimation, onSlideEnd: $.proxy(doFinal, this)}
                );
            }

            function doFinal() {
                var scrollTarget = $($itemEls[0]);
                var scrollToTarget = options.scrollToTarget;
                if (scrollToTarget && scrollTarget.length) {
                    $('html,body').animate({
                        scrollTop: scrollTarget.offset().top - (scrollToTarget.clientX || 30)
                    });
                }
                options.onSlideEnd && options.onSlideEnd();
            }
        },

        /**
         * Do not include items itselves.
         *
         * @protected
         * @param {jQuery} $itemEls
         * @return {jQuery}
         */
        _getAncestorItems: function ($itemEls) {
            var that = this;
            var ancestors = [];

            $itemEls.each(function () {
                var $itemEl = $(this);
                var baseCss = that.css();
                var itemCss = that._getCss('item');
                var $el = $itemEl.parent();

                while ($el && $el.length && !$el.hasClass(baseCss)) {
                    if ($el.hasClass(itemCss)) {
                        ancestors.push($el[0]);
                    }
                    $el = $el.parent();
                }
            });

            return $(ancestors);
        },

        /**
         * @protected
         */
        _getParentItem: function ($itemEl) {
            return $itemEl.parent().closest('.' + this._getCss('item'));
        },

        /**
         * @protected
         *
         * @param {Function} callback
         */
        _travelItemText: function (callback) {
            var viewModel = this._viewModel();
            var $o = this.$el().find('.' + this._getCss('text'));
            var that = this;

            $o.each(function () {
                var $this = $(this);
                var thisValue = that._findDataItemByPath(
                    viewModel.datasource, $this.attr(PATH_ATTR)
                ).value;
                callback.call(that, $this, thisValue);
            });
        },

        /**
         * @protected
         * @param {number} collapseLevel
         * @param {Object} options
         * @param {boolean} [options.collapseLevel]
         * @param {boolean=} [options.noAnimation]
         * @param {Function=} [options.onSlideEnd]
         */
        _collapseAll: function (options) {
            var collapseLevel = options.collapseLevel;

            if (collapseLevel == null || collapseLevel < 0) {
                setTimeout(doFinal, 0);
            }
            else {
                var itemSelector = '.' + this._getCss('item');
                var $changeItems = this.$el().find(itemSelector).filter(function () {
                    return $(this).attr(LEVEL_ATTR) >= collapseLevel;
                });

                this._expandOrCollapse(
                    $changeItems, 'collapse',
                    {noAnimation: options.noAnimation, onSlideEnd: doFinal}
                );
            }

            function doFinal() {
                options.onSlideEnd && options.onSlideEnd();
            }
        },

        /**
         * 展开和收起单层。所有展开收起的最终逻辑都走这里。
         *
         * @protected
         * @param {jQuery} $itemEls 可能是多个element
         * @param {string} type 'expand' or 'collapse'
         * @param {Object} options
         * @param {boolean=} [options.noAnimation] default false
         * @param {Function=} [options.onSlideEnd]
         */
        _expandOrCollapse: function ($itemEls, type, options) {
            options = options || {};
            var collapsedCss = this._getCss('collapsed');
            var expandedCss = this._getCss('expanded');
            var viewModel = this._viewModel();
            var that = this;

            var cssToRemove;
            var cssToAdd;
            var animateFn;

            if (type === 'expand') {
                cssToRemove = collapsedCss;
                cssToAdd = expandedCss;
                animateFn = 'slideDown';
            }
            else { // type === 'collapse'
                cssToRemove = expandedCss;
                cssToAdd = collapsedCss;
                animateFn = 'slideUp';
            }

            var $toBeChangedItemEls = $itemEls.filter('.' + cssToRemove);
            // 只有顶层的才实施动画，其他没有动画。
            var changeItems = {
                withAnimation: [],
                withoutAnimation: []
            };

            $toBeChangedItemEls.each(function () {
                if (that._getParentItem($(this)).hasClass(expandedCss)) {
                    changeItems.withAnimation.push(this);
                }
                else {
                    changeItems.withoutAnimation.push(this);
                }
            });

            // 开始变化视图
            $toBeChangedItemEls
                .removeClass(cssToRemove)
                .addClass(cssToAdd);

            if (type === 'expand') {
                this._resetItemText($toBeChangedItemEls);
            }

            if (type === 'expand') {
                doWithoutAnimation($.proxy(doWithAnimation, this, doFinal));
            }
            else { // type === 'collapse'
                doWithAnimation($.proxy(doWithoutAnimation, this, doFinal));
            }

            function doWithAnimation(then) {
                that._findElInItem($(changeItems.withAnimation), 'list')
                    [animateFn](options.noAnimation ? 0 : SLIDE_INTERVAL) // 动画
                    .promise().always(then);
            }

            function doWithoutAnimation(then) {
                that._findElInItem($(changeItems.withoutAnimation), 'list')
                    [animateFn](0)
                    .promise().always(then);
            }

            function doFinal() {
                if (type === 'collapse') {
                    that._resetItemText($toBeChangedItemEls);
                }
                viewModel.resizeEvent({});
                options.onSlideEnd && options.onSlideEnd();
            }
        },

        /**
         * @protected
         * @param {jQuery} $itemEl 一个element
         */
        _toggleSingleItem: function ($itemEl) {
            var collapsedCss = this._getCss('collapsed');
            var expandedCss = this._getCss('expanded');
            var viewModel = this._viewModel();
            var $listEl = this._findElInItem($itemEl, 'list');

            if ($itemEl.hasClass(collapsedCss)) {
                $itemEl.removeClass(collapsedCss).addClass(expandedCss);
                $listEl.slideDown(SLIDE_INTERVAL, $.proxy(handleSlideEnd, this, false));
                this._resetItemText($itemEl);
            }
            else if ($itemEl.hasClass(expandedCss)) {
                $itemEl.removeClass(expandedCss).addClass(collapsedCss);
                $listEl.slideUp(SLIDE_INTERVAL, $.proxy(handleSlideEnd, this, true));
            }

            function handleSlideEnd(resetText) {
                resetText && this._resetItemText($itemEl);
                viewModel.resizeEvent({});
            }
        },

        /**
         * 判断是否datasource中有某value
         *
         * @public
         * @param {*} value 给定的value
         * @return {Boolean} 是否有value
         */
        hasValue: function (value) {
            var has = false;

            this._travelData(
                this._viewModel().datasource,
                {preChildren: visitItem}
            );

            function visitItem(dataItem) {
                if (dataItem.value === value) {
                    has = true;
                }
            }

            return has;
        },

        /**
         * 深度优先遍历treeListData。@see _travelData
         *
         * @public
         */
        travelData: function (callbacks) {
            return this._travelData(this._viewModel().datasource, callbacks);
        },

        /**
         * 深度优先遍历treeListData。
         *
         * @private
         * @param {Array.<Object>} treeList 被遍历的对象。
         * @param {Array.<Function>} callbacks 遍历过程中的回调处理函数。
         * @param {Function} callbacks.preList 访问本list前的处理函数，参数：
         *                                     {Array.<Object>} 本list。
         *                                     {string} path 当前节点的位置信息, 形如'4,1,5'
         * @param {Function} callbacks.postList 访问子孙前的处理，参数同preList。
         * @param {Function} callbacks.preChildren 访问子孙前的处理，参数：
         *                                     {Object} item 当前节点,
         *                                     {string} path 当前节点的位置信息, 形如'4,1,5'
         *                                     {boolean} isLast
         * @param {Function} callbacks.postChildren 访问子孙后的处理，参数同callbacks.preChildren
         * @param {string=} parentPath 父节点的位置信息, 形如'4,1,5'，递归内部使用。
         * @param {Object=} parent 若没有则可以不传
         */
        _travelData: function (treeList, callbacks, parentPath, parent, level) {
            parentPath = (parentPath == null || parentPath === '')
                ? '' : (parentPath + ',');
            level == null && (level = 0);

            if (treeList && treeList.length) {
                callbacks.preList && callbacks.preList(treeList, parentPath, parent);

                for (var i = 0, len = treeList.length; i < len; i++) {
                    var dataItem = treeList[i];
                    var thisPath = parentPath + i;
                    var isLast = i === len - 1;

                    callbacks.preChildren
                        && callbacks.preChildren(dataItem, thisPath, parent, isLast, level);
                    this._travelData(dataItem.children, callbacks, thisPath, dataItem, level + 1); // 递归
                    callbacks.postChildren
                        && callbacks.postChildren(dataItem, thisPath, parent, isLast, level);
                }

                callbacks.postList && callbacks.postList(treeList, parentPath, parent);
            }
        },

        /**
         * @private
         * @param {Array.<Object>} treeList 在这里面find。
         * @param {string} path 节点的位置信息, 形如'4,1,5'。
         * @param {boolean} forOutput
         * @return {Object=} 找到的节点对象，没找到返回空。
         */
        _findDataItemByPath: function (treeList, path, forOutput) {
            path = path.split(',');
            treeList = treeList || [];
            var dataItem;

            for (var i = 0, len = path.length; i < len && treeList; i++) {
                dataItem = treeList[path[i]];
                treeList = (dataItem || {}).children;
            }

            return forOutput
                ? lib.assign({}, dataItem, null, ['children'])
                : dataItem;
        },

        /**
         * 从item中某个el找到itemEl
         *
         * @private
         */
        _findItemEl: function ($subEl) {
            var baseCss = this.css();
            var itemCss = this._getCss('item');

            while (!$subEl.hasClass(itemCss)) {
                if ($subEl.hasClass(baseCss)) {
                    return null;
                }

                $subEl = $subEl.parent();
            }

            return $subEl;
        },

        /**
         * @inner
         * @this {Object} TreeSelect实例
         */
        _findElInItem: function ($itemEls, cssName) {
            return $itemEls.find('> .' + this._getCss(cssName));
        },

        /**
         * @private
         */
        _resetItemText: function ($itemEls) {
            var that = this;
            $itemEls.each(function () {
                var $itemEl = $(this);
                var $textEl = that._findElInItem($itemEl, 'text');
                if ($itemEl.hasClass(that._getCss('collapsed'))) {
                    $textEl[0].innerHTML = encodeHTML([
                        $textEl.attr('data-text'),
                        $textEl.attr('data-children-pre'),
                        $textEl.attr('data-children-brief'),
                        $textEl.attr('data-children-post')
                    ].join(''));
                }
                else if ($itemEl.hasClass(that._getCss('expanded'))) {
                    $textEl[0].innerHTML = encodeHTML([
                        $textEl.attr('data-text'),
                        $textEl.attr('data-children-pre')
                    ].join(''));
                }
            });
        }
    });

    return TreeSelect;
});