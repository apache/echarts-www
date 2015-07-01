/**
 * API doc.
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var dtLib = require('dt/lib');
    var lang = require('./lang');

    require('dt/componentConfig');

    /**
     * @public
     * @type {Object}
     */
    var spreadsheet = {};

    /**
     * @public
     */
    spreadsheet.init = function () {
        var instance = new SpreadsheetMain($('.ecdoc-sprsht')); // jshint ignore:line
    };

    /**
     * @class
     * @extends dt/ui/Component
     */
    var SpreadsheetMain = Component.extend({

        _define: {
            tpl: require('tpl!./spreadsheet.tpl.html'),
            tplTarget: 'SpreadsheetMain',
            css: 'ecdoc-sprsht',
            viewModel: function () {
                return {
                };
            }
        },

        getLang: function () {
            return lang;
        },

        _prepare: function () {
            // $.getJSON(SCHEMA_URL, $.proxy(this._handleSchemaLoaded, this));
        }

    });

    return spreadsheet;
});
