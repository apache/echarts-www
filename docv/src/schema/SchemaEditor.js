/**
 * api doc sample
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var schemaHelper = require('../common/schemaHelper');
    var dtLib = require('dt/lib');
    var dialog = require('dt/ui/dialog');

    require('dt/componentConfig');

    var SCHEMA_URL = '../optionSchema.json';
    var TPL_TARGET = 'SchemaEditor';
    var SELECTOR_QUERY_AREA = '.ecdoc-scmedt-query-area';
    var SELECTOR_QUERY_TAB = '.query-tab';
    var CSS_QUERY_TAB_ACTIVE = 'query-tab-active';
    var SELECTOR_QUERY_BOX = '.query-box';
    var SELECTOR_COLLAPSE_RADIO = '.query-collapse-radio input[type=radio]';
    var SELECTOR_RESET_BUTTON = '.reset-btn';
    var SELECTOR_DESC_RENDERED_CN = '.desc-rendered-cn';
    var SELECTOR_DESC_RENDERED_EN = '.desc-rendered-en';
    var SELECTOR_QUESTION = '.ecdoc-question';
    var ATTR_TIP_TPL_TARGET = 'data-tip-tpl'

    /**
     * 编辑端入口
     *
     * @class
     * @extends dt/ui/Component
     */
    var SchemaEditor = Component.extend({

        _define: {
            tpl: require('tpl!./SchemaEditor.tpl.html'),
            css: 'ecdoc-scmedt',
            viewModel: function () {
                return {
                    apiTreeDatasource: null,
                    apiTreeSelected: dtLib.ob(),
                    apiTreeHighlighted: dtLib.obArray()
                };
            }
        },

        _prepare: function () {
            var viewModel = this._viewModel();

            viewModel.apiTreeDatasource = [];

            var blockTypes = viewModel.blockTypes = [];
            blockTypes.push(
                {value: 'object', text: 'Object'},
                {value: 'array', text: 'Array'},
                {value: 'primary', text: 'Primary'},
                {value: 'ref', text: '引用'},
                {value: 'oneOfParent', text: 'OneOf（表示此节点有多种可能）'},
                {value: 'definition', text: 'Definition'}
            );

            var valueTypes = viewModel.valueTypes = [];
            for (var i = 0, len = schemaHelper.EC_OPTION_TYPE.length; i < len; i++) {
                var item = schemaHelper.EC_OPTION_TYPE[i];
                valueTypes.push({value: item, text: item});
            }

            $.getJSON(SCHEMA_URL, $.proxy(this._handleSchemaLoaded, this));
        },

        _initDescViewHTML: function () {
            this._sub('descViewTypeCN').viewModel('checked').subscribe($.proxy(onHTMLViewChanged, this, 'cn'));
            this._sub('descViewTypeEN').viewModel('checked').subscribe($.proxy(onHTMLViewChanged, this, 'en'));

            function onHTMLViewChanged(type, nextValue) {
                var renderedEl = this.$el().find(
                    type === 'cn' ? SELECTOR_DESC_RENDERED_CN : SELECTOR_DESC_RENDERED_EN
                );
                var rawCptVisible = this._sub('editBlock.desc' + type.toUpperCase()).viewModel('visible');
                if (nextValue === 'rendered') {
                    renderedEl.show();
                    rawCptVisible(false);
                }
                else {
                    renderedEl.hide();
                    rawCptVisible(true);
                }
            }
        },

        _handleSchemaLoaded: function (schema) {
            var renderBase = {};
            schemaHelper.buildDoc(
                schema, renderBase, schemaHelper.buildDoc.schemaJsonRenderer, 'schema'
            );

            this._docTree = {
                value: 'root',
                text: 'definitions',
                children: renderBase.children[0].children,
                expanded: true
            };

            var viewModel = this._viewModel();
            viewModel.apiTreeDatasource = [this._docTree];
            this._applyTpl(this.$el(), TPL_TARGET);

            this._initDescViewHTML();
            this._initQuery();
            this._initTip();

            this._disposable(
                this._sub('schemaTree').viewModel('selected')
                    .subscribe($.proxy(this._updateEditPanel, this, true))
            );

            this._initQueryArea();
        },

        _initTip: function () {
            var that = this;
            this.$el().find(SELECTOR_QUESTION).on('click', function () {
                dialog.alert({
                    content: that._renderTpl($(this).attr(ATTR_TIP_TPL_TARGET)),
                    encodeHTML: false
                });
            });
        },

        _initQuery: function () {
            var queryInput = this._sub('queryInput');
            queryInput.viewModel('value').subscribe(this._query, this);

            $(document).keypress(function (e) {
                var tagName = (e.target.tagName || '').toLowerCase();
                if (e.which === 47 && tagName !== 'input' && tagName !== 'textarea') { // "/"键
                    queryInput.focus();
                    queryInput.select();
                    e.preventDefault();
                }
            });
        },

        _query: function (text) {
            if (text == null || !$.trim(text)) {
                return;
            }
            var valueList = [];

            this._sub('schemaTree').travelData(
                {preChildren: visitItem}
            );

            function visitItem(dataItem) {
                if ((dataItem.itemName || '').toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                    valueList.push(dataItem.value);
                }
            }
            this._viewModel().apiTreeHighlighted(
                valueList, {collapseLevel: 1, scrollToTarget: {clientX: 30}}
            );
        },

        _updateEditPanel: function (persistent, nextValue, ob) {
            var treeItem = ob.peekValueInfo('dataItem');
            if (!treeItem) {
                return;
            }

            for (var key in this._editPanelDefine) {
                if (this._editPanelDefine.hasOwnProperty(key)) {
                    var o = this._editPanelDefine[key];
                    o.reset.call(this, this._sub('editBlock.' + key), treeItem);
                }
            }
        },

        _editPanelDefine: {
            propertyName: {
                reset: function (cpt, treeItem) {
                    cpt.viewModel('value')(treeItem.propertyName);
                }
            },
            type: {
                reset: function (cpt, treeItem) {
                    var type = treeItem.type;
                    if (!type) {
                        type = [];
                    }
                    else if (!$.isArray(type)) {
                        type = [type];
                    }
                    cpt.viewModel('checked')(type);
                }
            },
            applicable: {
                reset: function (cpt, treeItem) {
                    var list = schemaHelper.normalizeToArray(treeItem.applicable);
                    cpt.viewModel('value')(list.join(','));
                }
            },
            enumerateBy: {
                reset: function (cpt, treeItem) {
                    var list = schemaHelper.normalizeToArray(treeItem.enumerateBy);
                    cpt.viewModel('value')(list.join(','));
                }
            },
            setApplicable: {
                reset: function (cpt, treeItem) {
                    var list = schemaHelper.normalizeToArray(treeItem.setApplicable);
                    cpt.viewModel('value')(list.join(','));
                }
            },
            ref: {
                reset: function (cpt, treeItem) {
                    cpt.viewModel('value')(treeItem.ref || '无');
                }
            },
            defaultValue: {
                reset: function (cpt, treeItem) {
                    cpt.viewModel('value')(stringifyValue(treeItem.defaultValue));
                }
            },
            defaultExplanation: {
                reset: function (cpt, treeItem) {
                    cpt.viewModel('value')(treeItem.defaultExplanation || '无');
                }
            },
            descCN: {
                reset: function (cpt, treeItem) {
                    var html = treeItem.descriptionCN || '无';
                    cpt.viewModel('value')(html);
                    this.$el().find(SELECTOR_DESC_RENDERED_CN)[0].innerHTML = html;
                }
            },
            descEN: {
                reset: function (cpt, treeItem) {
                    var html = treeItem.descriptionEN || '无';
                    cpt.viewModel('value')(html);
                    this.$el().find(SELECTOR_DESC_RENDERED_EN)[0].innerHTML = html;
                }
            }
        },

        _initQueryArea: function () {
            var $area = $(SELECTOR_QUERY_AREA);
            var that = this;
            $(SELECTOR_QUERY_TAB).on('click', function () {
                var $tab = $(this);
                var $target = $area.find($tab.attr('data-box'));
                $area.find(SELECTOR_QUERY_TAB).removeClass(CSS_QUERY_TAB_ACTIVE);
                $tab.addClass(CSS_QUERY_TAB_ACTIVE);
                $area.find(SELECTOR_QUERY_BOX).hide();
                $target.show();
            });

            $area.find(SELECTOR_QUERY_BOX).each(function () {
                var $box = $(this);
                var queryArgName = $box.attr('data-arg-name');
                $box.find('.query-btn').on('click', function () {
                    var queryStr = $.trim($(this).prev().val());
                    that.doQuery(queryStr, queryArgName);
                });
            });

            $area.find(SELECTOR_RESET_BUTTON).on('click', function () {
                that._viewModel().apiTreeSelected(null, {collapseLevel: 1});
                that._viewModel().apiTreeHighlighted([], {collapseLevel: 1});
            });
        },

        /**
         * 检索并对应到树的相应选项上
         * queryStr like 'series[i](applicable:pie,line).itemStyle.normal.borderColor'
         */
        doQuery: function (queryStr, queryArgName) {
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
                alert('没有检索到。queryStr="' + queryStr + '"');
                return;
            }

            var valueSet = [];
            for (var i = 0, len = result.length; i < len; i++) {
                valueSet.push(result[i].value);
            }

            this._viewModel().apiTreeHighlighted(
                valueSet, {scrollToTarget: {clientX: 30}, collapseLevel: collapseLevel}
            );

            console.log(result);
        }
    });

    function stringifyValue(value) {
        try {
            return JSON.stringify(value);
        }
        catch (e) {
        }
        return value + '';
    }

    return SchemaEditor;
});
