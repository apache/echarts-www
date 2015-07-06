/**
 * @file data table cell renderers
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var $ = require('jquery');
    var Handsontable = require('jqueryhandsontable');
    var TextRenderer = Handsontable.renderers.TextRenderer;

    // Constants
    var HIGH_BG_COLOR = '#EFEFEF';
    var LOW_BG_COLOR = '#FFF';

    /**
     * Cell renderers
     *
     * @public
     */
    return {
        high: function (instance, td /* , row, col, prop, value, cellProperties */) {
            TextRenderer.apply(this, arguments);
            $(td).css('background', HIGH_BG_COLOR);
        },

        normal: function (instance, td /* , row, col, prop, value, cellProperties */) {
            TextRenderer.apply(this, arguments);
            $(td).css('background', LOW_BG_COLOR);
        }
    };
});
