/**
 * API doc language.
 */
define(function (require) {

    var $ = require('jquery');

    /**
     * Chinese
     * @type {Object}
     */
    var cn = {
        langCode: 'cn',
        queryBoxPlaceholderFuzzyPath: '搜索（快捷键\'/\'） 例如输入：ser(line).emph',
        queryBoxPlaceholderAnyText: '搜索（快捷键\'/\'） 例如输入：样式',
        queryBoxTextFuzzyPath: '在属性中搜索',
        queryBoxTextAnyText: '全文搜索',
        descAreaLabelType: '类型',
        descAreaLabelDefaultValue: '默认值',
        collapseAll: '折叠',
        queryResultInfo: '共 #{count} 条结果',
        queryBoxNoResult: '没有搜索到信息',
        exampleCategory: '示例类型'
    };

    /**
     * English
     * @type {Object}
     */
    var en = {
        langCode: 'en',
        queryBoxPlaceholderFuzzyPath: 'Search (Short cut:\'/\'). Try input: ser(line).emph',
        queryBoxPlaceholderAnyText: 'Search (Short cut:\'/\'). Try input: style',
        queryBoxTextFuzzyPath: 'In properties',
        queryBoxTextAnyText: 'Full-text',
        descAreaLabelType: 'Type',
        descAreaLabelDefaultValue: 'Default Value',
        collapseAll: 'Collapse',
        queryResultInfo: 'Got #{count} results.',
        queryBoxNoResult: 'No result',
        exampleCategory: 'Category'
    };

    // Setting in html.
    return $('html').attr('lang').toLowerCase() === 'en' ? en : cn;
});
