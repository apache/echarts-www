/**
 * @file Text input and textarea input.
 * @author sushuang(sushuang@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var Component = require('./Component');

    /**
     * 模板中的声明方法举例：
     *  <div data-cpt="
     *      type: 'input/TextInput',
     *      name: 'textInput0',
     *      viewModel: {
     *          value: viewModel.value0,
     *          css: 'dtm-msrggt-tx0',
     *          type: 'textarea', // 默认为'text'
     *          disabled: viewModel.disabled,
     *          placeholder: lib.ob('asdf')
     *      }">
     *  </div>
     *
     * @class
     * @extends common/component/Component
     */
    var TextInput = Component.extend({

        _define: {
            css: 'dtui-txipt',
            viewModel: function () {
                return {
                    // 如果需要对数据进行验证，验证不通过时改变当前输入框中的值，
                    // 或者需要对输入进行parse，
                    // 则使用ob.extendWriter，把验证逻辑扩展进ob即可。
                    value: lib.ob(''),
                    mouseEnterSelect: false, // 也可以是lib.ob(true)，这样可以动态更改。
                    type: 'text', // 可选值：'text'（默认）, 'textarea'
                    placeholder: lib.ob(''), // 可以是lib.ob('asdf')
                    confirmPoint: {
                        pressEnter: true,
                        blur: true
                    }
                };
            },
            viewModelPublic: ['value', 'placeholder', 'text', 'mouseEnterSelect', 'type']
        },

        /**
         * @override
         */
        _init: function () {
            var viewModel = this._viewModel();
            var type = viewModel.type = viewModel.type || 'text';

            this.$el().addClass(this.getFullCss(
                type === 'textarea' ? '-type-textarea' : '-type-text'
            ).join(' '));

            var html = type === 'textarea'
                // 套个div是为了使input宽度设100%
                ? '<div><textarea></textarea></div>'
                : '<div><input type="text"/></div>';
            this._$input = $($(html).appendTo(this.$el())[0].firstChild);

            this._$input.on(
                this._event('mouseenter'),
                function () {
                    if (lib.peek(viewModel.mouseEnterSelect)) {
                        this.select && this.select();
                    }
                }
            );

            this._initPlaceHolder();
            this._initViewUpdater();
            this._initModelUpdater();
        },

        /**
         * @public
         */
        focus: function () {
            this._$input.focus();
        },

        /**
         * @public
         */
        select: function () {
            this._$input.select();
        },

        /**
         * @private
         */
        _initPlaceHolder: function () {
            var placeholderOb = this._viewModel().placeholder;

            if (lib.obTypeOf(placeholderOb) === 'ob') {
                placeholderOb.subscribe(onChange, this);
                onChange.call(this, placeholderOb());
            }
            else if (placeholderOb != null) {
                onChange.call(this, placeholderOb);
            }

            function onChange(text) {
                this._$input.attr('placeholder', text);
            }
        },

        /**
         * @private
         */
        _initViewUpdater: function () {
            var viewModel = this._viewModel();
            var $input = this._$input;

            // disabled
            this._disposable(viewModel.disabled.subscribe(
                function (dis) {
                    $input[0].disabled = !!dis;
                },
                this
            ));

            // 建立文本输入和value的依赖
            this._disposable(
                viewModel.value.subscribe(updateText, this)
            );

            function updateText(nextValue) {
                // 此更新由文本输入触发时，也会重新写入。因为value可能会在decorator中被改变。
                $input.val(nextValue);
            }

            // 第一次调用
            updateText(viewModel.value());
        },

        /**
         * @private
         */
        _initModelUpdater: function () {
            var viewModel = this._viewModel();
            var insUID = this.uid();
            var $input = this._$input;
            var that = this;

            // 现在是失焦触发更新，并未做随着输入实时更新。暂无此需求。

            // 监听value对文本输入的依赖
            var confirmPoint = viewModel.confirmPoint || {};
            if (confirmPoint.blur) {
                $input.on(this._event('blur'), confirmInput);
            }
            if (confirmPoint.pressEnter) {
                $input.on(this._event('keypress'), onKeyPress);
            }

            function onKeyPress(event) {
                if (that.isDisabled()) {
                    return;
                }

                if (viewModel.type === 'text' && event.which === 13) { // Enter键
                    confirmInput();
                    event.preventDefault();
                }
            }

            function confirmInput() {
                if (that.isDisabled()) {
                    return;
                }

                viewModel.value(
                    $input.val(), lib.valueInfoForConfirmed(insUID), {force: true}
                );
                // 因为 value 写入时会负责校验，所以写入完后，还应把当前状态回显到屏幕上
                $input.val(viewModel.value());
            }
        },

        /**
         * @override
         */
        _dispose: function () {
            this._$input.off(this._event());
            this._$input = null;
            this.$el().html('');
        }

    });

    return TextInput;
});
