//-----------------------
// 配置
//-----------------------

exports.port = 8765;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

// 请直接将php-cgi路径添加到系统的环境变量中
// 如果不方面添加，则在设置在此 PHP_CGI_PATH 中，如：
// '/usr/local/php/bin/php-cgi'
var PHP_CGI_PATH = 'php-cgi';

/**
 * 业务mock的配置。
 * 每项的意义：
 * prefix对url前缀匹配。
 * regExp是对url的正则匹配（可用于REST接口）。
 * 选一种用
 * module是mock文件，是node module。
 * php表示导向php来处理。
 */
var mockConfig = [
    {
        prefix: '/wave/product/list',
        module: './mock/wave/gallery/productList'
    },
    {
        prefix: '/product/',
        php: '/mock/product/product.php'
    },
    {
        regExp: /\/platform\/rs\/teams\/\w+\/members/,
        module: '/mock/classMgr/list'
    }
];




//---------------------------------------------------
//---------------------------------------------------


exports.getLocations = function () {
    return [
        {
            location: /^\/$/,
            handler: home( 'index.html' )
        },
        {
            location: function (request) {
                var mapper = [
                     '/Rectify/rectify'
                ];
                return mapper.indexOf(request.pathname) !== -1;
            },
            handler: [
                // RD环境（青林）：passport.baidu.com登录
                proxy('dev005.baidu.com', 8651)
                // RD环境（青林）：passport.rdtest.baidu.com登录
                // proxy('dev005.baidu.com', 8751)
            ]
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                // 先判断有没有less文件，如果没有再取css
                function (context) {
                    var docRoot  = context.conf.documentRoot;
                    var pathname = context.request.pathname;
                    var file = docRoot + pathname;

                    var sourceFile = file.replace(/\.css$/, '.less');
                    if (require('fs').existsSync(sourceFile)) {
                        context.content = require('fs').readFileSync(sourceFile, 'utf8');
                        less()(context);
                    }
                    else {
                        context.header['content-type'] = 'text/css';
                        context.content = require('fs').readFileSync(file, 'utf8');
                    }
                }
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                function (context) {
                    // 如果没找到资源则取mock数据
                    // 这样做的弊端是，无法直接访问php文件，因为先走了file()
                    if (context.status == 404) {
                        return goMock(context);
                    }
                }
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};

/**
 * 稍多一些的http转发
 *
 * @param {Funciton} reqHandler
 *  reqHandler输入参数如下：
 *      param {Obejct} context
 *      param {Obejct} request 即context.request
 *      param {string} url 即context.url
 *      param {string} host 即context.headers['host']
 *  reqHandler 返回如下
 *      return {Object|boolean|undefined} reqOptions
 *          如果返回空则表示不予以处理
 *          如果某子项缺失则使用默认值
 *      return {string=} reqOptions.hostname
 *      return {number=} reqOptions.port
 *      return {string=} reqOptions.method
 *      return {string=} reqOptions.path
 *      return {Object=} reqOptions.headers
 *      return {Function}
 * @param {string} logPrefix 为了记log
 * @return {Function}
 */
function proxyPlus(reqHandler, logPrefix) {
    return function (context) {
        logPrefix = (logPrefix || '') + ' ';

        console.log(logPrefix + 'REQUEST: ' + context.request.url);

        var request = context.request;
        var url = request.url;
        var headers = request.headers;
        var host = headers.host;
        var hostname = host.split(':')[0];
        var port = host.split(':')[1];

        var reqOptions = reqHandler(context, request, url, host);

        if (!reqOptions) {
            console.log(logPrefix + 'ReqHandler returns empty. So do nothing. ' + url);
            return;
        }

        var pt = reqOptions.port != null ? reqOptions.port : port;
        var targetHost = (reqOptions.hostname || hostname)
            + (pt ? (':' + pt) : '');

        context.stop();


        // build request options
        reqOptions = {
            host       : targetHost,
            port       : reqOptions.port || port,
            method     : reqOptions.method || request.method,
            path       : reqOptions.path || request.path,
            headers    : headers
        };


        // 这里面的也要改！
        headers.host = headers.origin = targetHost;

        console.log(
            logPrefix
            + 'ProxyPlus forward request' + (request.url).blue
            + ' to ' + (targetHost + reqOptions.path).blue
        );

        // create request object
        var http = require( 'http' );
        var req = http.request( reqOptions, function ( res ) {
            var content = [];
            res.on( 'data', function ( chunk ) {
                content.push( chunk );
            } );

            res.on( 'end', function () {
                context.content = Buffer.concat( content );
                context.header = res.headers;
                if ( !res.headers.connection ) {
                    context.header.connection = 'close';
                }
                context.status = res.statusCode;
                context.start();
            } );
        } );

        req.on('error', function (err) {
            console.log(logPrefix + 'Requesting '
                + (targetHost + request.url).blue
                + ' error: '.red + err.message
            );
            context.status = 500;
            context.content = '';
            context.start();
        });

        // send request data
        var buffer = context.request.bodyBuffer;
        buffer && req.write( buffer );
        req.end();
    };
}

function printRequest(context) {
    var request = context.request;
    var str = [];
    for (var k in request) {
        if ( typeof request[k] !== 'function') {
            str.push(k + ': ' + request[k]);
        }
    }
    console.log('==REQUEST===================================');
    console.log(str.join('\n'));
    console.log('============================================');
}

/**
 * mock数据
 */
function goMock(context) {
    var request = context.request;

    var targetItem;
    for (var i = 0, o; o = mockConfig[i]; i ++) {
        if ((o.prefix && request.url.indexOf(o.prefix) == 0)
            || (o.regExp && o.regExp.test(request.url))
        ) {
            targetItem = o;
            break;
        }
    }

    if (targetItem) {
        console.log('Found mock for ' + request.url);

        if (targetItem.module) {
            nodeMock(context, targetItem.module);
        }
        else if (targetItem.php) {
            phpRequest(context, targetItem.php);
        }
    }
};

function nodeMock(context, modulePath) {
    var request = context.request;
    console.log(
        'Use node mock: [' + modulePath + '] for [' + request.url + ']'
    );
    var module = require(modulePath);

    if (module.json) {
        context.content = JSON.stringify(module.json(context));
        context.header[ 'Content-Type' ] = 'application/json;charset=utf-8';
        context.status = 200;
    }
    else if (module.text) {
        context.content = module.text(context);
        context.header[ 'Content-Type' ] = 'text/html;charset=utf-8';
        context.status = 200;
    }
    else if (module.mock) {
        module.mock(context);
    }

    // 标志node成功
    context.mockOK = context.nodeOK = true;
}

/**
 * edp-webserver处理php
 *
 * 在`edp-webserver-config.js`中配置：
 * ```javascript
 * {
 *     location: /^.*$/,
 *     handler: [
 *         // 或者直接将php-cgi添加到环境变量中
 *         php('/usr/local/php/bin/php-cgi')
 *     ]
 * }
 * ```
 * 调试状态下请打开`php.ini`的`error_reporting`。
 *
 * @param {?string} handler php-cgi可执行文件路径
 */
function phpRequest(context, phpPath) {
    var request = context.request;
    console.log(
        'Use php mock: [' + phpPath + '] for [' + request.url + ']'
    );
    var targetURL = request.headers.host + phpPath + (request.search || '');

    // 挂起
    context.stop();

    console.log(
        'PHP request' + (targetURL).red + ' | ' + (phpPath).red
    );

    var path = require('path');
    var docRoot = context.conf.documentRoot;
    var request = context.request;
    var scriptName = phpPath;
    var scriptFileName = path.normalize(
        docRoot + phpPath
    );
    var query =  require('url').parse(request.url).query;

    // @see: http://www.cgi101.com/book/ch3/text.html
    var host = (request.headers.host || '').split(':');
    var env = {
        PATH: process.env.PATH,
        GATEWAY_INTERFACE: 'CGI/1.1',
        SERVER_PROTOCOL: 'HTTP/1.1',
        SERVER_ROOT: docRoot,
        DOCUMENT_ROOT: docRoot,
        SERVER_NAME: host[0],
        SERVER_PORT: host[1] || 80,
        REDIRECT_STATUS: 200,
        SCRIPT_NAME: scriptName, //docroot上的文件
        REQUEST_URI: targetURL,
        SCRIPT_FILENAME: scriptFileName, //物理文件
        REQUEST_METHOD: request.method,
        QUERY_STRING: query || ''
    };

    // expose request headers
    for (var header in request.headers) {
        var name = 'HTTP_' + header.toUpperCase().replace(/-/g, '_');
        env[name] = request.headers[header];
    }

    if ('content-length' in request.headers) {
        env.CONTENT_LENGTH = request.headers['content-length'];
    }

    if ('content-type' in request.headers) {
        env.CONTENT_TYPE = request.headers['content-type'];
    }

    var child = require('child_process').spawn(
        PHP_CGI_PATH, [], { env: env }
    );

    var bodyBuffer = [];
    var isBodyData = false;
    var headers = {};
    var line = [];

    child.on('exit', done);

    child.stderr
    .on(
        'end',
        function () {
            console.log('php error end [' + [].slice.call(arguments) + ']');
        }
    )
    .on(
        'data',
        function () {
            console.log('php error data [' + [].slice.call(arguments) + ']');
        }
    );

    child.stdout
    .on('end',done)
    .on(
        'data',
        function(buf) {

            for (var i = 0; i < buf.length; i++) {
                // 如果是主体数据内容
                if (isBodyData) {
                    return bodyBuffer.push(buf);
                }

                // 取出header
                var c = buf[i];
                if (c == 0xA) { // 如果是\n，则一行读取完毕
                    if (!line.length) { // 如果读取到一个空行
                        isBodyData = true;
                        bodyBuffer.push(
                            buf.slice(i + 1)
                        );
                        return;
                    }

                    var s = line.join('');
                    line = [];
                    var idx = s.indexOf(':');

                    headers[s.slice(0, idx)] = s.slice(idx + 1).trim();
                }
                else if (c != 0xD) { //如果不是\n，也不是\r，说明一行还未读取结束
                    line.push(String.fromCharCode(c));
                }
            }
        }
    );

    // POST的数据写入
    if (request.method.toUpperCase() === 'POST') {
        child.stdin.write(request.bodyBuffer);
    }

    // 将php解析后的结果填充到context中
    function done(code) {
        if (code === undefined) {
            return;
        }

        for(var i in headers) {
            if (headers.hasOwnProperty(i)) {
                context.header[i] = headers[i];
            }
        }

        context.content = bodyBuffer.join('');

        // 如果code非零，也不一定不能运行
        // if (code) {
        //     context.status = 500;
        // }

        // 标志php成功返回
        context.mockOK = context.phpOK = true;
        context.start();
    }
}
