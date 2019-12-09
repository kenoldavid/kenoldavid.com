// import _ from "lodash";
// import printMe from "./print.js";
// const menuBtn = require("./menuBtn.js");

console.log("Hello from main.js and octobercms!!!");

// Select the active menu link
// $("#menu li a").click(function() {
//   $(this).addClass("current");
//   // $(this).siblings().removeClass("current");
// });


// Enable Tooltips Everywhere
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// Enable Popovers Everywhere
// $(function() {
//   $('[data-toggle="popover"]').popover();
// });

// Enable Popovers for specific elements (w/ HTML content)
$(function () {
  $('[data-toggle="popover"]').each(function (i, obj) {
    $(this).popover({
      html: true,
      content: function () {
        var id = $(this).attr('id')
        return $('#popover-content-' + id).html();
      }
    });
  });
});

// function component() {
//   var element = document.createElement("div");
//   var paragraph = document.createElement("p");
//   var btn = document.createElement("button");

//   paragraph.innerHTML = _.join(["Hello", "webpack!"], " ");

//   btn.innerHTML = "Click me and check the console!";
//   btn.onclick = printMe;

//   element.appendChild(paragraph);
//   element.appendChild(btn);

//   return element;
// }

// document.body.appendChild(component());

// Store the element to re-render on print.js changes
// let element = component();
// document.body.appendChild(element);

// if (module.hot) {
//   module.hot.accept("./print.js", function() {
//     console.log("Accepting the updated printMe module!");
//     // printMe();
//     document.body.removeChild(element);
//     // Re-render the "component" to update the click handler
//     element = component();
//     document.body.appendChild(element);
//   });
// }
