/***
 * Source: http://santosh-shah.com/add-class-active-page-refresh-jquery/
 * 
 * TODO - Need to refactor this code.
 */
jQuery(function ($) {
    $("ul li a")
        .click(function (e) {
            var link = $(this);

            var item = link.parent("li");

            if (item.hasClass("selected")) {
                item.removeClass("selected").children("a").removeClass("selected");
            } else {
                item.addClass("selected").children("a").addClass("selected");
            }

            if (item.children("ul").length > 0) {
                var href = link.attr("href");
                link.attr("href", "#");
                setTimeout(function () {
                    link.attr("href", href);
                }, 300);
                e.preventDefault();
            }
        })
        .each(function () {
            var link = $(this);
            if (link.get(0).href === location.href) {
                link.addClass("selected").parents("li").addClass("selected");
                return false;
            }
        });
});