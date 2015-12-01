$(document).ready(function ()
{
    //Cache some variables
    var $navlinks = $('.navigation').find('li'),
        $slides = $('.slide'),
        $nextbutton = $('.button'),
        $window = $(window),
        $htmlbody = $('html,body');

    // sets the navigation button's styles according to the specified slide id
    var _setNavigationSlide = function (slideId)
    {
        $navlinks.filter("[data-slide]").removeClass("active");
        $navlinks.filter("[data-slide=" + slideId + "]:not(.active)")
            .addClass("active");
    };

    //Create a function that will be passed a slide number and then will scroll to that slide using jquerys animate. The Jquery
    //easing plugin is also used, so we passed in the easing method of 'easeInOutQuint' which is available throught the plugin.
    var _goToByScroll = function(dataslide)
    {
        $htmlbody.animate({
            scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top
        }, 1000, 'easeInOutQuint');
    }

    //initialise Stellar.js - just using it for the slow scrolling
    $window.stellar({
        horizontalScrolling: false,
        hideDistantElements: false
    });

    // determine which slide is "most" visible
    var _getVisibleSlideId = function() {
        var id = 1,
            scrollTop = $window.scrollTop();
        for (var a = $slides.length - 1, z = 0; a >= z; a--)
        {
            var $slide = $($slides[a]);
            var slideHeight = $slide.outerHeight();
            var midVerticalOffset = $slide.offset().top + (slideHeight / 2);
            if (midVerticalOffset >= scrollTop)
            {
                id = $slide.attr("data-slide");
            }
        }
        return id;
    };

    //waypoints doesnt detect the first slide when user scrolls back up to the top so we add this little bit of code, that removes the class 
    //from navigation link slide 2 and adds it to navigation link slide 1. 
    var _scrollHandler;
    $window.scroll(function ()
    {
        if (_scrollHandler)
        {
            clearTimeout(_scrollHandler);
        }
        _scrollHandler = setTimeout(function ()
        {
            _setNavigationSlide(_getVisibleSlideId());
            clearTimeout(_scrollHandler);
            _scrollHandler = null;
        }, 200);
    });


    //When the user clicks on the navigation links, get the data-slide attribute value of the link and pass that variable to the goToByScroll function
    $navlinks.click(function (e)
    {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        _goToByScroll(dataslide);
    });


    //When the user clicks on the button, get the get the data-slide attribute value of the button and pass that variable to the goToByScroll function
    $nextbutton.click(function (e)
    {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        _goToByScroll(dataslide);
    });

    $navlinks.first().addClass("active");
    _goToByScroll(1);

    var _ghettoLog = function (msg)
    {
        $("#debug").append("<p>" + msg + "</p>");
    }

    _ghettoLog("screen: " + screen.width + "x" + screen.height);
    _ghettoLog("window: " + $(window).outerWidth() + "x" + $(window).outerHeight());
    _ghettoLog("slide 1: " + $slides.first().outerWidth() + "x" + $slides.first().outerHeight());

    var gotoSlide = function(slideNum) {
        //-- Only go to slide if we're within the bounds
        // note that the slides are 1 based, not 0 based
        if(slideNum < 1 || slideNum > $slides.length) return false;
        _goToByScroll(slideNum);
        return false;
    }

    $(document).keydown(function (e) {

        if (e.keyCode == 34 ||  //-- Page Down Key
            e.keyCode == 39 ||  //-- Right Key
            e.keyCode == 40) {  //-- Down Key

            var curSlide = _getVisibleSlideId();

            return gotoSlide(new Number(curSlide) + 1);
        }
        else if (
            e.keyCode == 33 ||  //-- Page Up Key
            e.keyCode == 37 ||  //-- Left Key
            e.keyCode == 38) {  //-- Up Key

            var curSlide = _getVisibleSlideId();

            return gotoSlide(new Number(curSlide) - 1);
        }
        else if (e.keyCode == 36) { return gotoSlide(1); } //-- Home Key
        else if (e.keyCode == 35) { return gotoSlide($slides.length); } //-- End Key
    });
});

