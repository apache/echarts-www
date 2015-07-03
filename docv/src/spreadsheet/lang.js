/**
 * Languages.
 */
define(function (require) {

    var $ = require('jquery');

    /**
     * Chinese
     * @type {Object}
     */
    var cn = {
        langCode: 'cn'
    };

    /**
     * English
     * @type {Object}
     */
    var en = {
        langCode: 'en'
    };

    // Setting in html.
    return $('html').attr('lang').toLowerCase() === 'en' ? en : cn;
});
