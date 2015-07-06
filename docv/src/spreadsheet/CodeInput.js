/**
 * @file Code Input
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var Component = require('dt/ui/Component');

    /**
     * @class
     * @extends dt/ui/Component
     */
    var CodeInput = Component.extend({

        _define: {
            tpl: require('tpl!./spreadsheet.tpl.html'),
            tplTarget: 'CodeInput',
            css: 'ecdoc-sprsht-codeinput',
            viewModel: function () {
                return {
                    codeTextOb: null // 外部传入
                };
            }
        }

    });

    return CodeInput;
});
