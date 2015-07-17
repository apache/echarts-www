/**
 * Languages.
 * 中英文必须同时存在并对应。
 * 依赖页面html上的lang属性判断语言。
 */
define(function (require) {

    var $ = require('jquery');

    /**
     * 中文
     * @type {Object}
     */
    var cn = {
        langCode: 'cn',
        feedback: {
            trigger: '意见反馈',
            title: '意见反馈',
            issueTips: '任何意见建议，请告诉我们',
            issuePlaceholder: '欢迎提出问题或宝贵建议（400字以内），感谢您的支持。',
            emailTips: '联系方式（选填）',
            emailPlaceholder: '欢迎留下您的邮箱或QQ，便于我们的沟通',
            cutFileTips: '可以上传问题图片，图片大小不超过3M',
            submitButton: '提交反馈',
            required: '（*必填）'
        }
    };

    /**
     * English
     * @type {Object}
     */
    var en = {
        langCode: 'en',
        feedback: {
            trigger: 'Feedback',
            title: 'Feedback',
            issueTips: 'Please feel free to contact us for any suggestions or questions.',
            issuePlaceholder: 'Please describe your suggestions or questions here (within 400 charaters).', // jshint ignore:line
            emailTips: 'Contact Infomation (optional)',
            emailPlaceholder: 'Please leave your email here.',
            cutFileTips: 'Upload an image (less than 3MB)',
            submitButton: 'Submit',
            required: ' (*required)'
        }
    };

    // Setting in html.
    return $('html').attr('lang').toLowerCase() === 'en' ? en : cn;
});
