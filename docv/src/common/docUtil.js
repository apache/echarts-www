/**
 * @file Extra util methods for doc.
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var $ = require('jquery');
    var dtLib = require('dt/lib');

    var CODE_INDENT_BASE = 4;
    var LINE_BREAK = '\n';

    /**
     * @public
     * @type {Object}
     */
    var util = {};

    /**
     * @public
     * @param {string} data
     * @return {Object|Array}
     */
    util.parseToObject = function (data) {
        var result = (new Function('return (' + data + ')'))(); // jshint ignore:line
        var type = $.type(result);
        dtLib.assert(type === 'object' || type === 'array');
        return result;
    };

    /**
     * 得到echarts option的字符串形式。
     * ecOption并不是普通的可以json stringify的对象，里面还额外有function、regExp、Date需要处理。
     * 打印效果例如:
     * {
     *      color: '#48b',
     *      width: 2,
     *      type: 'solid'
     * }
     *
     * @public
     * @param {Object} object
     * @return {string} object的字符串
     */
    util.stringifyJSObject = function (object) {
        try {
            // 遍历object，将function、regExp、Date字符串化
            var result = util.travelJSObject(object, null, 0);
            return result.str;
        }
        catch (e) {
            return '';
        }
    };

    util.stringifyJSObject2HTML = function (object) {
        return '<pre>' + util.stringifyJSObject(object) + '</pre>';
    };

    /**
     * @inner
     * @throws {Error} If illegal type
     */
    util.travelJSObject = function (obj, key, depth) {
        var objType = $.type(obj);
        var codeIndent = (new Array(depth * CODE_INDENT_BASE)).join(' ');
        // 因为为了代码美化，有可能不换行（如[1, 212, 44]），所以由父来添加子的第一个indent。
        var subCodeIndent = (new Array((depth + 1) * CODE_INDENT_BASE)).join(' ');
        var hasLineBreak = false;

        // echarts option 的key目前都是不用加引号的，所以为了编辑方便，统一不加引号。
        var preStr = key != null ? (key + ': ' ) : '';
        var str;

        switch (objType) {
            case 'function':
                hasLineBreak = true;
                str = preStr + dtLib.printFunction(obj, depth, CODE_INDENT_BASE); // FIXME
                break;
            case 'regexp':
                str = preStr + '"' + obj + '"'; // FIXME
                break;
            case 'date':
                str = preStr + '"' + obj + '"'; // FIXME
                break;
            case 'array':
                // array有可能是单行模式，如[12, 23, 34]。
                // 但如果array中子节点有换行，则array就以多行模式渲染。
                var childBuilder = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    var subResult = util.travelJSObject(obj[i], null, depth + 1);
                    childBuilder.push(subResult.str);
                    if (subResult.hasLineBreak) {
                        hasLineBreak = true;
                    }
                }
                var tail = hasLineBreak ? LINE_BREAK : '';
                var delimiter = ',' + (hasLineBreak ? (LINE_BREAK + subCodeIndent) : ' ');
                var subPre = hasLineBreak ? subCodeIndent : '';
                var endPre = hasLineBreak ? codeIndent : '';
                str = ''
                    + preStr + '[' + tail
                    + subPre + childBuilder.join(delimiter) + tail
                    + endPre + ']';
                break;
            case 'object':
                // object全以多行模式渲染（ec option中，object以单行模式渲染更好看的情况不多）。
                hasLineBreak = true;
                var childBuilder = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)
                        // 滤掉图说自定义配置，参见ecHacker
                        && i !== '_show'
                        && i.indexOf('_dt') !== 0
                    ) {
                        var subResult = util.travelJSObject(obj[i], i, depth + 1);
                        childBuilder.push(subCodeIndent + subResult.str);
                    }
                }
                str = ''
                    + preStr + '{' + LINE_BREAK
                    + childBuilder.join(',' + LINE_BREAK) + LINE_BREAK
                    + codeIndent + '}';
                break;
            case 'boolean':
            case 'number':
                str = preStr + obj + '';
                break;
            case 'string':
                str = preStr + '"' + obj + '"';
                break;
            default:
                throw new Error('Illegal type "' + objType + '" at "' + obj + '"');
        }

        return {
            str: str,
            hasLineBreak: hasLineBreak
        };
    };

    /**
     * @public
     * @param {Array} arr
     * @param {*} item
     * @return {boolean}
     */
    util.contains = function (arr, item) {
        return dtLib.arrayIndexOf(arr, item) >= 0;
    };

    /**
     * Change the sequence of the property in the object.
     * The "for in" sequence of an object,
     * @see https://javascriptweblog.wordpress.com/2011/01/04/exploring-javascript-for-in-loops/
     *
     * @public
     * @param {Object} obj
     * @param {string} propertyName Only supports owned properties. (obj.hasOwnProperty(propertyName) === true)
     * @param {string} targetPlace Value can be 'last', 'first', 'before', 'after'.
     * @param {string=} refPropertyName When targetPlace is 'before' or 'after',
     *                                  refPropertyName indicate the reference property.
     * @return {Object} The result object, which is not the original object.
     */
    util.changeIterationSequence = function (obj, propertyName, targetPlace, refPropertyName) {
        // Find property value.
        var propertyValue;
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && propertyName === p) {
                propertyValue = obj[p];
                break;
            }
        }

        // Create new object, cause IE do not change property iteration sequence
        // when deleting a property and re-defining it.
        var newObj = {};

        if (targetPlace === 'first') {
            newObj[propertyName] = propertyValue;
        }
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && p !== propertyName) {
                if (targetPlace === 'before' && p === refPropertyName) {
                    newObj[propertyName] = propertyValue;
                }

                newObj[p] = obj[p];

                if (targetPlace === 'after' && p === refPropertyName) {
                    newObj[propertyName] = propertyValue;
                }
            }
        }
        if (targetPlace === 'last') {
            newObj[propertyName] = propertyValue;
        }

        return newObj;
    };

    return util;
});