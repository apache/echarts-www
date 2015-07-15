/**
 * 前端构建
 */
var path = require('path');

exports.input = __dirname;
exports.output = path.resolve(__dirname, 'output');

var moduleEntries = 'html,htm,phtml,tpl,vm,js';
var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    return [
        new LessCompiler( {
            entryExtnames: pageEntries,
            compileOptions: {
                env : 'production'
            }
        } ),
        new CssCompressor(),
        new ModuleCompiler( {
            configFile: 'module.conf',
            entryExtnames: moduleEntries
        } ),
        new JsCompressor()
    ];
};

// 不能写绝对路径，需要绝对路径的话，只能用正则表示，如/^tool/
exports.exclude = [
    'src/*/img-src',
    'src/*/*/img-src',
    'asset*/',
    'output*/',
    'mock/',
    'test/',
    /^tool/,
    'node_modules',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'dep/*/*/build',
    'dep/*/*/asset',
    'dep/*/*/origin',
    'edp-*',
    '.edpproj',
    'templates_c',
    '.svn',
    '.git',
    '.gitignore',
    'src/.jshintignore',
    'src/.jshintrc',
    '.jshintignore',
    '.jshintrc',
    'LICENSE.txt',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    'build*.sh',
    'Gruntfile*.js',
    'package.json',
    'short-cut-dictionary*'
];

exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};

