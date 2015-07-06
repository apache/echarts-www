/**
 * @file component默认配置
 * @author sushuang(sushuang@baidu.com)
 */

define(function (require) {

    var Component = require('dt/ui/Component');

    require('dt/componentConfig');

    // 可在tpl中使用的types。
    // 放在这里声明是为了模块加载。
    var cptClasses = Component.cptClasses;

    // common component
    cptClasses['spreadsheet/DataTable'] = require('./DataTable');
    cptClasses['spreadsheet/CodeInput'] = require('./CodeInput');
    cptClasses['spreadsheet/CodeInputs'] = require('./CodeInputs');
});
