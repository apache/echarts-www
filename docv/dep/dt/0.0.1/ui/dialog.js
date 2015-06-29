/**
 * @file Dialogs.
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var config = require('../config');
    var WinPanel = require('./WinPanel');

    // Constant
    var TPL_TARGET = 'dialogPanel';
    var SELECTOR_CON = '.dtui-con';
    var CSS_BTN_PREFIX = 'dtui-dlg-btn-';
    var CSS_BTN_COMMON = 'dtui-btn';
    var CLOSE_BUTTON_VALUE = '';

    // instance hash
    var instances = {};

    /**
     * 使用方法1（自动有“确定”、“取消”按钮）：
     * dialog.confirm({
     *     content: '这是显示文字'
     *     encodeHTML: true, // 缺省是true，如果需要显示原生html，则设置为false
     *     onYes: function, // 可缺省
     *     onCancel: function,  // 可缺省
     *     textYes: '', // 缺省为"确定"
     *     textCancel: '' // 缺省为"取消"
     * });
     *
     * 使用方法2（只有“确定”按钮）：
     * dialog.alert({
     *     content: '这是显示文字'
     *     encodeHTML: true, // 缺省是true，如果需要显示原生html，则设置为false
     *     onYes: function, // 可缺省
     *     textYes: '' // 缺省为"确定"
     * });
     *
     * 使用方法3（有“是”、“否”、“取消”三个按钮）
     * dialog.ask({
     *     content: '这是显示文字'
     *     encodeHTML: true, // 缺省是true，如果需要显示原生html，则设置为false
     *     onYes: function, // 可缺省
     *     onNo: function, // 可缺省
     *     onCancel: function // 可缺省
     *     textYes: '', // 缺省为"是"
     *     textNo: '', // 缺省为"否"
     *     textCancel: '' // 缺省为"取消"
     * });
     *
     * 使用方法0（原生）：
     * dialog.create({
     *     key: 'someKey', // 自己定义，每个key对应一个Dialog实例
     *     buttons: [
     *         {value: 'save', text: '保存' },
     *         {value: 'nosave', text: '不保存' },
     *         {value: 'cancel', text: '取消' }
     *     ] // 其中value值会放在按钮的css上（以dtm-dlg-btn-为前缀），text值会被自动encodeHTML
     * });
     * dialog.open({
     *     key: 'someKey',
     *     content: '这是显示的文字',
     *     encodeHTML: true, // 缺省是true，如果需要显示原生html，则设置为false
     *     buttonHandler: function,
     *         第一个参数是 button的value。
     *         如果第一个参数为空字符串''，表示点击了右上角的“叉子”。
     *     buttonText: {// 改变button的text，如果需要的话
     *         btnValue: newText
     *     }
     * });
     *
     * 所有buttonHandler，如果返回false，则表示什么也不做，dialog不会关闭。
     *
     * 主动关闭dialog：
     *     dialog.close('confirm');
     *     dialog.close('alert');
     *     dialog.close('ask');
     */
    var dialog = {

        /**
         * @public
         * @param {Object} viewModel
         * @param {string} viewModel.key
         * @param {Array.<Object>=} viewModel.buttons
         */
        create: function (viewModel) {
            lib.assert(viewModel.key && !instances[viewModel.key]);
            instances[viewModel.key] = new Dialog(viewModel);
        },

        /**
         * @public
         * @param {Object} options
         * @param {string} options.key
         */
        open: function (options) {
            instances[options.key].open(options);
        },

        /**
         * @public
         * @param {string} key
         */
        close: function (key) {
            instances[key].close();
        },

        /**
         * @public
         */
        confirm: function (options) {
            var mapping = {
                confirm: options.onYes,
                cancel: options.onCancel
            };
            mapping[CLOSE_BUTTON_VALUE] = options.onCancel;

            var buttonText = {
                confirm: options.textYes,
                cancel: options.textCancel
            };

            doOpen('confirm', options, mapping, buttonText);
        },

        /**
         * @public
         */
        alert: function (options) {
            var mapping = {confirm: options.onYes};
            var buttonText = {confirm: options.textYes};

            doOpen('alert', options, mapping, buttonText);
        },

        /**
         * @public
         */
        ask: function (options) {
            var mapping = {
                yes: options.onYes,
                no: options.onNo,
                cancel: options.onCancel
            };
            mapping[CLOSE_BUTTON_VALUE] = options.onCancel;

            var buttonText = {
                yes: options.textYes,
                no: options.textNo,
                cancel: options.textCancel
            };

            doOpen('ask', options, mapping, buttonText);
        }

    };

    /**
     * @inner
     */
    function doOpen(key, options, mapping, buttonText) {
        dialog.open({
            key: key,
            content: options.content,
            encodeHTML: options.encodeHTML,
            buttonHandler: function (value) {
                var handler = mapping[value];
                return handler ? handler() : null;
            },
            buttonText: buttonText
        });
    }

    /**
     * @class
     * @extends wave/app/WinPanel
     */
    var Dialog = WinPanel.extend({

        _define: {
            tpl: require('tpl!./ui.tpl.html'),
            viewModel: function () {
                return {
                    key: null,
                    buttons: []
                };
            }
        },

        /**
         * @override
         */
        _afterShow: function ($content, options) {
            // 基本结构只初始化一次
            if (!this._contentInitialized) {
                this._contentInitialized = true;
                initContent.call(this, $content);
            }

            // 填入信息内容
            $content.find(SELECTOR_CON)[0].innerHTML = options.encodeHTML === false
                ? options.content : lib.encodeHTML(options.content);

            // btn的text更新，如果需要的话
            updateButtonText.call(this, options.buttonText);

            // 挂监听
            this._buttonHandler = options.buttonHandler;
        },

        /**
         * @override
         */
        _afterHide: function () {
            this._buttonHandler = null;
        }
    });

    /**
     * 初始化内容
     *
     * @inner
     */
    function initContent($content) {
        var viewModel = this._viewModel();
        var btnViewModels = viewModel.btnViewModels = [];
        var btns = viewModel.buttons || [];

        // 构造按钮的viewModel
        for (var i = 0, len = btns.length; i < len; i++) {
            btnViewModels.push({
                text: lib.ob(btns[i].text),
                css: [CSS_BTN_COMMON, CSS_BTN_PREFIX + btns[i].value]
            });
        }

        // 渲染
        this._renderTpl(TPL_TARGET, null, $content);
        this._constructSub($content);

        // 按钮的click事件
        for (var i = 0, len = btns.length; i < len; i++) {
            this._sub('btns.' + i).on(
                'click',
                $.proxy(clickHandler, this, btns[i].value)
            );
        }

        // 空字符串''表示点击了关闭按钮
        this._onCloseBtnClick = $.proxy(clickHandler, this, CLOSE_BUTTON_VALUE);

        function clickHandler(value) {
            if (!this._buttonHandler || this._buttonHandler(value) !== false) {
                this.close(); // 任何按钮click都会关闭Dialog
            }
        }
    }

    function updateButtonText(buttonText) {
        if (!buttonText) {
            return;
        }
        var btns = this._viewModel().buttons || [];
        for (var i = 0, len = btns.length; i < len; i++) {
            var txt = buttonText[btns[i].value];
            if (txt != null) {
                this._sub('btns.' + i).viewModel('text')(txt);
            }
        }
    }

    // 初始化默认实例
    dialog.create({
        key: 'confirm',
        buttons: [
            {value: 'confirm', text: config('langDialogConfirm')},
            {value: 'cancel', text: config('langDialogCancel')}
        ]
    });

    dialog.create({
        key: 'alert',
        buttons: [
            {value: 'confirm', text: config('langDialogConfirm')}
        ]
    });

    dialog.create({
        key: 'ask',
        buttons: [
            {value: 'yes', text: config('langDialogYes')},
            {value: 'no', text: config('langDialogNo')},
            {value: 'cancel', text: config('langDialogCancel')}
        ]
    });

    return dialog;
});
