/**
 * @file 用户反馈。
 *       参见：http://f3.baidu.com/index.php/feedback/doc/index
 * @author sushuang(sushuang@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var langFeedback = require('./lang').feedback;

    /**
     * 产品线id是向反馈平台管理员申请的。和图说共享了一个product id
     *
     * @type {number}
     */
    var PRODUCT_ID = 101;

    /**
     * 百度反馈脚本的url
     *
     * @type {string}
     */
    var FB_URL = 'http://f3.baidu.com/feedback/js/feedback/feedback0.0.2.js';

    /**
     * @type {string}
     */
    var pageName;

    /**
     * @public
     */
    var feedback = {
        /**
         * @public
         * @param {string=} pgName 如果传入则会显示到username字段（暂时只找到在这个字段可以显示些信息）
         */
        init: function (pgName) {
            pageName = pgName;
            $('<div class="ec-feedback"><i>?</i>' + langFeedback.trigger + '</div>')
                .appendTo(document.body)
                .on('click', handleFeedbackClick);
        }
    };

    /**
     * 第一次加载插件，之后调用插件
     *
     * @inner
     */
    function initFeedback() {
        // fankui.baidu.com的全局变量
        var bds = window.bds;

        if (bds && bds.qa && bds.qa.ShortCut && bds.qa.ShortCut.initRightBar) {
            // 初始化反馈插件的样式参数（可以参考样式定制的api）
            var fbOptions = {
                // 百度反馈的接口定的够狂放
                product_id: PRODUCT_ID, // jshint ignore:line

                plugintitle: langFeedback.title,  // {String} [默认值：意见反馈] //反馈插件标题
                issueTips: langFeedback.issueTips, // {String} [默认值：对百度搜索不满意吗？请告诉我们] //反馈内容框上面的提示文字
                issuePlaceholder: langFeedback.issuePlaceholder, // {String} [默认值：欢迎提出您在使用过程中遇到的...] //反馈内容框里面的提示文字
                emailTips: langFeedback.emailTips, // {String} [默认值：联系方式（选填）] //邮箱上面的提示问题
                emailPlaceholder: langFeedback.emailPlaceholder, // {String} [默认值：留下您的邮箱，便于我们及时回复您] //输入邮箱内部的提示文字
                // guide:{String} [默认值：<span>1:申请删除百度快照结果，请您在<a hre] //引导部分的提示文字
                cutFileTips: langFeedback.cutFileTips, // {String} [默认值：上传问题图片，图片大小不超过3M]
                                        //上传文件的提示文字（不支持canvas的浏览器为上传截图）
                // cutCanvasTips:{String} [默认值：（点我，可以在当前页面标记问题哦）] //截图的提示文字
                // okStyle:{String} [默认值：<img src="http://f3.baidu.com/feedback/i...] //反馈成功后的提示

                // 样式类参数

                needIssueTips: true, // {Boolean} [默认值：true] //是否需要反馈内容引导提示
                needIssue: true, // {Boolean} [默认值：true] //是否需要反馈内容提示
                needCut: true, // {Boolean} [默认值：true] //是否需要截图
                needEmail: true, // {Boolean} [默认值：true] //是否需要输入邮箱
                needGuide: false, // {Boolean} [默认值：false] //是否需要引导文字（就是删除百度快照之类的引导文字）

                // 功能性参数

                showPosition: 'right', // {String} [默认值：right] //插件展示的位置（right：右下角 ,center：居中 ,top：靠顶部居中）
                onlyUpFile: true // {Boolean} [默认值：false] //只用上传图片（在图片或者Flash特别多的网站，采用上传会更好的优化用户体验）

                // 图片类参数

                // cutImg: '百度反馈提供图片', // {String} [默认值：百度反馈提供图片] //截图按钮的图片
                // upImg: '百度反馈提供图片', // {String} [默认值：百度反馈提供蹄片] //上传按钮的图片

                // 皮肤类参数

                // skinStyle: 'flat' // {String} [默认值：flat] //定制插件的皮肤（flat:普通样式的皮肤;pad:平板样式的皮肤）
            };


            var productData = {
                product_id: PRODUCT_ID, // jshint ignore:line
                // username: '(' + user.getUid() + ')' + user.getUname()
                username: '(page: ecwww' + (pageName ? '-' + pageName : '') + ')'
                // useremail:用户邮箱
                // version:产品迭代版本
                // query:用户查询词
                // baseurl:反馈页面地址
                // sourceid:资源号
                // input:输入内容
                // output:输出内容
                // keywords:关键词
                // secret:私密内容
                // other:其他内容
            };

            bds.qa.ShortCut._getProData(productData);

            bds.qa.ShortCut.initRightBar(fbOptions);

            hackFeedbackUI();
        }
    }

    /**
     * @inner
     */
    function hackFeedbackUI() {
        // 按钮等地方的文字不提供接口，只能这样强制改为英文
        $('#fb_baidu_right_dialog #fb_right_post_save').html(langFeedback.submitButton);

        $('#fb_baidu_right_dialog .fb-danger-tips').each(function (index, el) {
            if (el.innerHTML.indexOf('必填') >= 0) {
                el.innerHTML = langFeedback.required;
            }
        });
    }

    /**
     * @inner
     */
    function handleFeedbackClick() {
        // fankui.baidu.com的全局变量
        var bds = window.bds;

        if (bds && bds.qa && bds.qa.ShortCut) {
            initFeedback();
        }
        else {
            $.getScript(FB_URL).done(initFeedback);
        }

        return false;
    }

    return feedback;
});
