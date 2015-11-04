/**
 * 统一各页面中path的名称和version。
 * @param  {string} baseUrl
 */
window.amdConfig = function (baseUrl) {
    window.VERSION_ARG = '_v_=1.0.4';
    require.config({
        baseUrl: baseUrl,
        paths: {
            jquery: '../dep/jquery/1.11.0/jquery.min',
            jqueryui: '../dep/jqueryui/1.11.4/jquery-ui',
            dt: '../dep/dt/0.0.1',
            tpl: '../dep/dt/0.0.1/tplLoader',
            etpl: '../dep/etpl/3.0.0/etpl.min',
            signals: '../dep/signals/1.0.0/signals.min',
            hasher: '../dep/hasher/1.2.0/hasher.min',
            jqueryhandsontable: '../dep/jquery-handsontable/0.10.5.1/jquery.handsontable.dt.min',
            jquerymousewheel: '../dep/jquery-mousewheel/3.1.11/jquery.mousewheel.min',
            numeral: '../dep/numeral/1.4.7/numeral.min',
            lodash: '../dep/lodash/3.8.0/src/main',
            immutable: '../dep/immutable/3.7.4/dist/immutable',
            onecolor: '../dep/onecolor/one-color',
            markdown: '../dep/markdown-it/markdown-it',
            test: '../test'
        },
        urlArgs: window.VERSION_ARG
    });
};