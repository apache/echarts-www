/**
 * @file Edit Panel Define
 * @author sushuang@baidu.com
 */
define(function (require) {

    var $ = require('jquery');
    var dtLib = require('dt/lib');
    var docUtil = require('../common/docUtil');
    var editDataMgr = require('./editDataMgr');
    var md = require('markdown')({
        html: true
    });


    var SELECTOR_DESC_RENDERED_CN = '.desc-rendered-cn';
    var SELECTOR_DESC_RENDERED_EN = '.desc-rendered-en';
    var APPLICABLE_REG = /^!?[a-zA-Z0-9_]+$/;
    var UNDEFINED;

    /**
     * @public
     */
    var editPanelDefine = {

        propertyName: {
            isEnabled: function (cpt, treeItem) {
                return treeItem
                    && !editDataMgr.isOnRoot(treeItem.value)
                    && treeItem.editable.propertyName;
            },
            reader: function (cpt, treeItem) {
                cpt.viewModel('value')(treeItem ? treeItem.itemName : '');
            },
            persistentObName: 'value',
            writer: function (cpt, val, dataItem) {
                if (!/^[a-z][a-zA-Z0-9]*$/.test(val)) {
                    cpt.viewModel('alert')('必须为：/^[a-z][a-zA-Z0-9]*$/');
                }
                else {
                    cpt.viewModel('alert')(false);
                    var path = dataItem.schemaPath.slice();
                    editDataMgr.renamePropertySchemaDataItem(path, val);
                }
            }
        },

        type: {
            isEnabled: function (cpt, treeItem) {
                return treeItem
                    && !editDataMgr.isOnRoot(treeItem.value)
                    && treeItem.editable.type;
            },
            reader: function (cpt, treeItem) {
                if (treeItem) {
                    var type = treeItem.type;
                    if (!type) {
                        type = [];
                    }
                    else if (!$.isArray(type)) {
                        type = [type];
                    }
                    cpt.viewModel('checked')(type);
                }
                else {
                    cpt.viewModel('checked')('');
                }
            },
            persistentObName: 'checked',
            writer: dtLib.curry(defaultPropertyWriter, 'type', 'type')
        },

        applicable: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                var list = treeItem ? docUtil.normalizeToArray(treeItem.applicable) : [];
                cpt.viewModel('value')(list.join(','));
            },
            persistentObName: 'value',
            writer: function (cpt, val, dataItem) {
                writeOrShowError('applicable', cpt, dataItem, parser.parseApplicable(val));
            }
        },

        enumerateBy: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                var list = treeItem ? docUtil.normalizeToArray(treeItem.enumerateBy) : [];
                cpt.viewModel('value')(list.join(','));
            },
            persistentObName: 'value',
            writer: function (cpt, val, dataItem) {
                writeOrShowError('enumerateBy', cpt, dataItem, parser.parseApplicable(val));
            }
        },

        setApplicable: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                var list = treeItem ? docUtil.normalizeToArray(treeItem.setApplicable) : [];
                cpt.viewModel('value')(list.join(','));
            },
            persistentObName: 'value',
            writer: function (cpt, val, dataItem) {
                writeOrShowError('setApplicable', cpt, dataItem, parser.parseApplicable(val));
            }
        },

        ref: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                cpt.viewModel('value')(treeItem && treeItem.ref || '');
            },
            persistentObName: 'value',
            writer: dtLib.curry(defaultPropertyWriter, 'ref', 'ref')
        },

        defaultValue: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                if (treeItem) {
                    var val = stringifyValue(treeItem.defaultValue);
                    cpt.viewModel('value')(val != null ? val : '');
                }
                else {
                    cpt.viewModel('value')('');
                }
            },
            persistentObName: 'value',
            writer: function (cpt, val, dataItem) {
                writeOrShowError('default', cpt, dataItem, parser.parseToJSON(val));
            }
        },

        defaultExplanation: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                cpt.viewModel('value')(treeItem && treeItem.defaultExplanation || '');
            },
            persistentObName: 'value',
            writer: dtLib.curry(defaultPropertyWriter, 'defaultExplanation', 'defaultExplanation')
        },

        descCN: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                var html = treeItem && treeItem.descriptionCN || '';
                var renderHtml = md.render(html);
                cpt.viewModel('value')(html);
                this._renderDescHTML(SELECTOR_DESC_RENDERED_CN, renderHtml);
            },
            persistentObName: 'value',
            writer: dtLib.curry(defaultPropertyWriter, 'descriptionCN', 'descriptionCN')
        },
        descEN: {
            isEnabled: function (cpt, treeItem) {
                return !!treeItem;
            },
            reader: function (cpt, treeItem) {
                var html = treeItem && treeItem.descriptionEN || '';
                cpt.viewModel('value')(html);
                var renderHtml = md.render(html)
                this._renderDescHTML(SELECTOR_DESC_RENDERED_EN, renderHtml);
            },
            persistentObName: 'value',
            writer: dtLib.curry(defaultPropertyWriter, 'descriptionEN', 'descriptionEN')
        }

    };

    // val trim 后为空时，表示去除设置
    var parser = {
        parseApplicable: function (val) {
            var errorMsg;
            val = trimInput(val);

            // 去除applicable设置
            if (!val) {
                val = UNDEFINED;
            }
            // 设置applicable
            else {
                var arr = val.split(',');
                var invalid = false;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if ($.trim(arr[i]) === '' || !APPLICABLE_REG.test(arr[i])) {
                        invalid = true;
                    }
                }
                if (invalid) {
                    errorMsg = '用逗号分隔，不能有空格，每项满足/^!?[a-zA-Z0-9_]+$/';
                }
            }
            return {val: val, errorMsg: errorMsg};
        },

        parseToJSON: function (val) {
            val = trimInput(val);

            // 去除applicable设置
            if (!val) {
                return {val: UNDEFINED};
            }
            else {
                try {
                    return {val: JSON.parse(val)};
                }
                catch (e) {
                    return {val: val, errorMsg: 'JSON.parse() error.'};
                }
            }
        }
    };

    function trimInput(val) {
        if (val == null) {
            val = '';
        }
        return $.trim(val);
    }

    function writeOrShowError(propName, cpt, dataItem, result) {
        if (result.errorMsg) {
            cpt.viewModel('alert')(result.errorMsg);
        }
        else {
            cpt.viewModel('alert')(false);
            var path = dataItem.schemaPath.slice();
            path.push(propName);
            editDataMgr.updateSchemaDataItem(path, result.val);
        }
    }

    function stringifyValue(value) {
        try {
            return JSON.stringify(value);
        }
        catch (e) {
        }
    }

    function defaultPropertyWriter(schemaItemPropertyName, dataItemPropertyName, cpt, val, dataItem) {
        var path = dataItem.schemaPath.slice();
        path.push(schemaItemPropertyName);
        editDataMgr.updateSchemaDataItem(path, val);
    }

    return editPanelDefine;
});