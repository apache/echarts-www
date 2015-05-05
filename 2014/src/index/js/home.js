define(function() {
    loop();

    function loop() {
        setTimeout(function() {
            $('.section1').toggleClass('section1-bg1');
            loop();
        }, 400);
    }

    function load() {
    }

    $('.next').click(function() {
        $.fn.fullpage.moveSectionDown();
    });

    return {
        load: load
    };
});
