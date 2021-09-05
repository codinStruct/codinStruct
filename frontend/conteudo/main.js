// Show/hide sidebar items
$(".categoria").on("click", function () {
  // Change opened state
  $(this).toggleClass("aberta");

  // Rotating arrow
  $(this).find("i.fas").toggleClass("fa-rotate-180");

  // Show/hide children
  $(this).parent().find("li").toggle("fast");
});

// Loading content, placing it and highlighting all 'pre code' with source code
// TODO: In the future this loading will be done dynamically depending on the page visited
$("#content").load(
  "/Projeto-Content-Converted/C/Basico/primeiro_programa/primeiro_programa.html",
  () =>
    $("#content pre code").each((i, el) => {
      hljs.highlightElement(el);
      hljs.lineNumbersBlock(el, { singleLine: true });
    })
);

// Swipes to open/close sidebar
let barraLateral = $("#barra-lateral");

$(document).on("swiped", function (e) {
  switch (e.detail.dir) {
    case "left":
      barraLateral.removeClass("slide-in-left-mobile");
      barraLateral.addClass("slide-out-left-mobile");
      break;

    case "right":
      // Ignore swipes over horizontally scrollable elements
      if (e.target.scrollWidth > e.target.clientWidth) return;

      barraLateral.removeClass("slide-out-left-mobile");
      barraLateral.addClass("slide-in-left-mobile");
      break;
  }
});
