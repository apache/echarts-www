/**
 * Languages.
 * 中英文必须同时存在并对应。
 */
define(function (require) {

    var $ = require('jquery');

    /**
     * 中文
     * @type {Object}
     */
    var cn = {
        langCode: 'cn',
        pageTitle: '电子表格数据转换工具',
        pageDescHTML: '在<strong>左侧</strong>贴入数据&nbsp;&nbsp;<strong>下方</strong>立刻产生结果',
        typeSetting: '类型设置：',
        emptyValueSetting: '空值设置：',
        quotationMarkSetting: '引号设置：',
        quotationMarks: {
            singleQuotes: '单引号',
            doubleQuotes: '双引号'
        },
        dimensionSetting: '维度设置：',
        attributeSetting: '属性设置：',
        codeFormatSetting: '结果格式设置：',
        codeFormat: {
            compressed: '压缩',
            expanded2Indent: '展开（2空格缩进）',
            expanded4Indent: '展开（4空格缩进）'
        },
        convertResult: '转换结果：',
        dimDesc: {
            dim1to1: '每一列转换为一个一维数组',
            dimallto2: '总体转换成一个二维数组',
            dim1to2: '每一列转换成一个二维数组',
            dim2to2: '每二列转换成一个二维数组',
            dim3to2: '每三列转换成一个二维数组',
            dim4to2: '每四列转换成一个二维数组',
            dim5to2: '每五列转换成一个二维数组'
        },
        codeInputTitle: '#{rangeDesc} 列转换结果：',
        attrInfoTitle: '列 #{colName} ',
        attrInfoAttrName: '属性名：',
        attrInfoType: '类型：',
        ecEmptyValue: 'ECharts标准空值（中划线：\'-\'）',
        jsDataTypeDimArray: '纯数组',
        jsDataTypeArrayObject: '数组+对象'
    };

    /**
     * English
     * @type {Object}
     */
    var en = {
        langCode: 'en',
        pageTitle: 'Spreadsheet Data Convert Tool',
        pageDescHTML: 'Paste data on the <strong>left</strong>, and get result <strong>below</strong> immediately.',
        typeSetting: 'Type: ',
        emptyValueSetting: 'Empty Value: ',
        quotationMarkSetting: 'Quotation Mark: ',
        quotationMarks: {
            singleQuotes: 'single qutation mark',
            doubleQuotes: 'double qutation mark'
        },
        dimensionSetting: 'Dimension: ',
        dimDesc: {
            dim1to1: 'Convert each column to 1-dimension array.',
            dimallto2: 'Convert all of the data converted to 2-dimension array.',
            dim1to2: 'Convert each column converted to 2-dimension array.',
            dim2to2: 'Convert each two column converted to 2-dimension array.',
            dim3to2: 'Convert each three column converted to 2-dimension array.',
            dim4to2: 'Convert each fore column converted to 2-dimension array.',
            dim5to2: 'Convert each five column converted to 2-dimension array.'
        },
        attributeSetting: 'Attributes: ',
        codeFormatSetting: 'Formatting Result: ',
        codeFormat: {
            compressed: 'compress',
            expanded2Indent: 'expand and indent with 2 space',
            expanded4Indent: 'expand and indent with 4 space'
        },
        convertResult: 'Result: ',
        codeInputTitle: 'Result from Column #{rangeDesc}:',
        attrInfoTitle: 'Column #{colName} ',
        attrInfoAttrName: 'Attr name: ',
        attrInfoType: 'Type: ',
        ecEmptyValue: 'ECharts Empty Value (\'-\')',
        jsDataTypeDimArray: 'Array',
        jsDataTypeArrayObject: 'Array + Object'
    };

    // Setting in html.
    return $('html').attr('lang').toLowerCase() === 'en' ? en : cn;
});
