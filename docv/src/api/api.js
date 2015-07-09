/**
 * API doc.
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var schemaHelper = require('../common/schemaHelper');
    var helper = require('./helper');
    var dtLib = require('dt/lib');
    var lang = require('./lang');
    var hasher = require('hasher');

    require('dt/componentConfig');

    var SCHEMA_URL = '../docv/optionSchema.json';
    var TPL_TARGET = 'APIMain';
    var SELECTOR_TYPE = '.ecdoc-api-type';
    var SELECTOR_DESC = '.ecdoc-api-desc';
    var SELECTOR_DEFAULT = '.ecdoc-api-default';
    var SELECTOR_COLLAPSE_RADIO = '.query-collapse-radio input[type=radio]';

    /**
     * @public
     * @type {Object}
     */
    var api = {};

    /**
     * @type {Object}
     */
    var apiMai;

    /**
     * @public
     */
    api.init = function () {
        apiMai = new APIMain($('.ecdoc-apidoc'));
    };

    /**
     * @class
     * @extends dt/ui/Component
     */
    var APIMain = Component.extend({

        _define: {
            tpl: require('tpl!./api.tpl.html'),
            css: 'ecdoc-apidoc',
            viewModel: function () {
                return {
                    apiTreeDatasource: [],
                    apiTreeSelected: dtLib.ob(),
                    apiTreeHighlighted: dtLib.obArray()
                };
            }
        },

        getLang: function () {
            return lang;
        },

        _prepare: function () {
            $.getJSON(SCHEMA_URL, $.proxy(this._handleSchemaLoaded, this));
        },

        _handleSchemaLoaded: function (schema) {
            this._prepareAsync(schema);
            this._applyTpl(this.$el(), TPL_TARGET);
            this._initAsync();
        },

        _prepareAsync: function (schema) {
            var renderBase = {};

            schemaHelper.buildDoc(schema, renderBase);

            this._docTree = {
                value: 'root',
                text: 'option = ',
                childrenPre: '{',
                childrenPost: '}',
                childrenBrief: ' ... ',
                children: renderBase.children[0].children,
                expanded: true
            };

            this._viewModel().apiTreeDatasource = [this._docTree];
        },

        _initAsync: function () {
            this._disposable(
                this._sub('apiDocTree').viewModel('hovered')
                    .subscribe($.proxy(this._updateDesc, this, false))
            );
            this._disposable(
                this._sub('apiDocTree').viewModel('selected')
                    .subscribe($.proxy(this._updateDesc, this, true))
            );

            this._initQueryBox();
            this._initHash(); // The last step.
        },

        _initHash: function () {
            var that = this;
            hasher.initialized.add(parseHash);
            hasher.changed.add(parseHash);
            hasher.init();

            function parseHash(newHash) {
                if (newHash) {
                    var hashInfo = helper.parseHash(newHash);

                    if (hashInfo.queryString) {
                        that.doQuery(hashInfo.queryString, 'optionPath', true);
                    }
                    if (hashInfo.category) {
                        // that.aaaa(hashInfo.category);
                    }
                }
            }
        },

        _initQueryBox: function () {
            var queryInput = this._sub('queryInput');
            var queryMode = this._sub('queryMode');
            queryInput.viewModel('value').subscribe(queryBoxGo, this);
            var checked = queryMode.viewModel('checked');

            checked.subscribe(onModeChanged, this);
            onModeChanged.call(this, checked());

            $(document).keypress(function (e) {
                var tagName = (e.target.tagName || '').toLowerCase();
                if (e.which === 47 && tagName !== 'input' && tagName !== 'textarea') { // "/"键
                    queryInput.focus();
                    queryInput.select();
                    e.preventDefault();
                }
            });

            function onModeChanged(nextValue) {
                var dataItem = queryMode.getDataItem(nextValue);
                queryInput.viewModel('placeholder')(dataItem.placeholder);
            }

            function queryBoxGo(queryStr) {
                if (queryStr) {
                    this.doQuery(queryStr, checked());
                }
            }
        },

        _updateDesc: function (persistent, nextValue, ob) {
            var $el = this.$el();
            var treeItem = ob.peekValueInfo('dataItem');
            if (treeItem) {
                var type = treeItem.type || '';
                if ($.isArray(type)) {
                    type = type.join(', ');
                }
                var desc = {
                    type: dtLib.encodeHTML(type),
                    descText: lang.langCode === 'en' // 不需要encodeHTML，本身就是html
                        ? (treeItem.descriptionEN || '')
                        : (treeItem.descriptionCN || ''),
                    defaultValueText: dtLib.encodeHTML(treeItem.defaultValueText)
                };

                if (persistent) {
                    this._desc = desc;
                }

                doShow(desc);
            }
            else if (this._desc) { // nothing hovered. restore
                doShow(this._desc);
            }

            function doShow(desc) {
                $el.find(SELECTOR_TYPE)[0].innerHTML = desc.type;
                $el.find(SELECTOR_DESC)[0].innerHTML = desc.descText;
                $el.find(SELECTOR_DEFAULT)[0].innerHTML = desc.defaultValueText;
            }
        },

        /**
         * Query doc tree and scroll to result.
         * QueryStr like 'series[i](applicable:pie,line).itemStyle.normal.borderColor'
         *
         * @public
         * @param {string} queryStr Query string.
         * @param {string} queryArgName Value can be 'optionPath', 'fuzzyPath', 'anyText'.
         * @param {boolean} selectFirst Whether to select first result, default: false.
         */
        doQuery: function (queryStr, queryArgName, selectFirst) {
            var result;

            try {
                var args = {};
                args[queryArgName] = queryStr;
                result = schemaHelper.queryDocTree(this._docTree, args);
            }
            catch (e) {
                alert(e);
                return;
            }

            var collapseLevel = null;
            $(SELECTOR_COLLAPSE_RADIO).each(function () {
                if (this.checked && this.value === '1') {
                    collapseLevel = 2;
                }
            });

            if (!result.length) {
                alert(dtLib.strTemplate(lang.queryBoxNoResult, {queryStr: queryStr}));
                return;
            }

            var valueSet = [];
            for (var i = 0, len = result.length; i < len; i++) {
                valueSet.push(result[i].value);
            }

            var viewModel = this._viewModel();
            if (selectFirst) {
                viewModel.apiTreeHighlighted(
                    valueSet,
                    {scrollToTarget: false, collapseLevel: collapseLevel, always: next}
                );
            }
            else { // Only highlight
                viewModel.apiTreeHighlighted(
                    valueSet,
                    {scrollToTarget: {clientX: 180}, collapseLevel: collapseLevel}
                );
            }

            function next() {
                viewModel.apiTreeSelected(
                    result[0].value,
                    {scrollToTarget: {clientX: 180}, collapseLevel: collapseLevel}
                );
            }
        }
    });

    return api;
});
