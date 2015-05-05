define(function(require) {

    require('../../common/js/jquery.min');
    require('../../common/js/jquery-ui.min');
    require('../../common/js/jquery.fullPage.min');

    var rank = require('./rank');
    var history = require('./history');
    var filter = require('./filter');
    var filter1 = require('./filter1');
    var home = require('./home');
    var rankTimeline = require('./rankTimeline');
    var player = require('./player');

    function init() {
        $('#fullpage').fullpage({
            'verticalCentered': true,
            'css3': true,
            'anchors': ['home', 'rank1', 'rank2', 'rankTimeline', 'club', 'money', 'over'],
            'slidesColor': ['#dfcb52', '#7bc0dd', '#92cda2', '#e27c5d', '#d3bfdc', '#fbf4eb', '#f7c6c2'],
            'navigation': true,
            'navigationPosition': 'right',
            'navigationTooltips': ['首页', '排名变化1', '排名变化2', '历史战绩', '效力联赛分布', '球员身价', '持续更新中'],
            'afterRender': afterRender,
            'afterLoad': afterLoad,
            'onLeave': onLeave
        });

        filter.init();
        filter1.init();
    }

    function afterRender() {
        var index = $('.section').index($('.active')) + 1;
        trigger(index);
    }

    function afterLoad(anchorLink, index) {
        trigger(index);
    }

    function onLeave() {
    }

    function trigger(index) {
        switch (index)
        {
            case 1:
                home.load();
                break;
            case 2:
                rank.load();
                break;
            case 3:
                rankTimeline.load();
                break;
            case 4:
                history.load();
                break;
            case 5:
                player.load();
                break;
            case 6:
                require('./money').load();
                break;
            default:
                break;
        }
    }

    return {
        init: init
    };
});
