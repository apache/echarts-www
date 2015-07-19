/**
 * @file Window panel.
 * @author sushuang(sushuang@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var config = require('../config');
    var BasePanel = require('./BasePanel');

    // Constant
    var MAIN_TPL_TARGET = 'winPanel';
    var CLOSE_BTN_SELECTOR = '.dtui-close-cross';
    var CON_SELECTOR = '.dtui-winpn-con';
    var MASK_CSS = 'winpn';
    var MAIN_EL_KEY = 'winPanelMainEl';
    var MASK_KEY = 'winPanelMaskKey';
    var IS_OPEN = 'winPanelIsOpen';

    /**
     * 初始z-index，之后往上递增
     *
     * @type {number}
     */
    var zIndex;

    /**
     * wave端header入口
     *
     * @class
     * @extends ./BasePanel
     */
    var WinPanel = BasePanel.extend({

        _define: {
            tpl: require('tpl!./ui.tpl.html'),
            tplTarget: 'winPanel',
            // 是否点击panel外部就关闭panel。子类继承时可打开此开关。
            closeWhenClickOther: false
        },

        /**
         * @override
         */
        _init: function () {
            var $el = $(this._renderTpl(MAIN_TPL_TARGET))
                .appendTo(document.body)
                .hide();

            if (zIndex == null) {
                zIndex = config('panelBaseZIndex');
            }

            this._manuInitView($el);
            this._prop(MAIN_EL_KEY, $el);
            this._prop(IS_OPEN, false);

            this.$el('winPanel$content', $el.find(CON_SELECTOR));
            this._prop(MASK_KEY, Math.random() + ''); // 每一个winPanel实例，拥有一个mask。

            $el.on(
                this._event('click'),
                CLOSE_BTN_SELECTOR,
                $.proxy(onCloseBtnClick, this)
            );

            this._afterInit(this.$content());

            function onCloseBtnClick() {
                if (!this._onCloseBtnClick || this._onCloseBtnClick() !== false) {
                    this.close();
                }
            }
        },

        /**
         * @override
         */
        _disposeFinally: function () {
            lib.disposeGlobalMask(this._prop(MASK_KEY));
            this._prop(MAIN_EL_KEY).remove();
            this._prop(MAIN_EL_KEY, null);
        },

        /**
         * @public
         * @param {Object=} options 任意参数，子类可定义
         */
        open: function (options) {
            if (this.isOpen()) {
                return;
            }

            var $el = this.$el();
            var $content = this.$content();

            // 遮罩
            lib.globalMask(
                config('panelMastOpacity'),
                this._prop(MASK_KEY),
                MASK_CSS,
                {click: $.proxy(onMaskClick, this)}
            );

            function onMaskClick() {
                if (this._getDefineProperty('closeWhenClickOther')) {
                    this.close();
                }
            }

            this._prop(IS_OPEN, true);
            this._beforeShow($content, options);
            $el.show();
            this._afterShow($content, options); // 在定位前执行，可进行内容填充。

            // 定位
            $el.css({
                'top': 0 - Math.round($el.outerHeight()),
                'marginLeft': 0 - Math.round($el.outerWidth() / 2),
                'marginTop': 0,
                'z-index': zIndex++
            });

            var isNoAnimate = this._getDefineProperty('noAnimate');
            $el.animate(
                {
                    top: '50%',
                    marginTop: 0 - Math.round($el.outerHeight() / 2)
                },
                isNoAnimate ? 0 : config('winPanelAnimationDuration')
            );
        },

        /**
         * @public
         */
        close: function () {
            if (!this.isOpen()) {
                return;
            }

            var $el = this.$el();

            this._prop(IS_OPEN, false);
            this._beforeHide(this.$content());

            var me = this;

            var isNoAnimate = this._getDefineProperty('noAnimate');
            $el.animate(
                {
                    top: 0 - Math.round($el.outerHeight()),
                    marginTop: 0
                },
                isNoAnimate ? 0 : config('winPanelAnimationDuration'),
                'swing',
                function () {
                    $el.hide();
                    lib.globalMask(false, me._prop(MASK_KEY));
                    me._afterHide(me.$content());
                    me.fire('close');
                }
            );
        },

        /**
         * 得到内容容器
         *
         * @protected
         * @return {jQuery}
         */
        $content: function () {
            return this.$el('winPanel$content');
        },

        /**
         * 是否处于open状态
         *
         * @public
         * @return {boolean} 是否处于打开状态
         */
        isOpen: function () {
            return this._prop(IS_OPEN);
        },

        /**
         * 子类可实现
         *
         * @protected
         * @abstract
         * @param {jQuery} $content 内容容器
         */
        _afterInit: $.noop,

        /**
         * 子类可实现
         *
         * @protected
         * @abstract
         * @param {jQuery} $content 内容容器
         */
        _beforeShow: $.noop,

        /**
         * 子类可实现
         *
         * @protected
         * @abstract
         * @param {jQuery} $content 内容容器
         */
        _afterShow: $.noop,

        /**
         * 子类可实现
         *
         * @protected
         * @abstract
         * @param {jQuery} $content 内容容器
         */
        _beforeHide: $.noop,

        /**
         * 子类可实现
         *
         * @protected
         * @abstract
         * @param {jQuery} $content 内容容器
         */
        _afterHide: $.noop,

        /**
         * 默认的关闭按钮点击事件处理
         *
         * @protected
         * @abstract
         * @return {boolean} 如果返回false，则不close
         */
        _onCloseBtnClick: $.noop

    });

    return WinPanel;
});
