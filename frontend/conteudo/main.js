// Finds all pre>code elements and calls highlight.js for each one
function highlightSourceCode() {
  $("#content")
    .find("pre code")
    .each((_, el) => {
      hljs.highlightElement(el);
      hljs.lineNumbersBlock(el, { singleLine: true });
    });
}



// Show/hide sidebar items
$(".categoria").on("click", function () {
  $(this)
    // Change opened state
    .toggleClass("aberta")
    // Rotate arrow
    .find("i.fas")
    .toggleClass("fa-rotate-180");

  // Show/hide children
  $(this).parent().find("li").toggle("fast");
});



// Once the window finishes loading it will begin to load the content file
// When that is done the loading screen is hidden
// TODO: In the future this loading will be done dynamically depending on the page visited
$(window).on("load", function () {
  $("#content").load(
    "/Projeto-Content-Converted/C/Basico/primeiro_programa/primeiro_programa.html",
    function () {
      highlightSourceCode();
      hideLoadingScreen();
    }
  );
});



// Swipes to open/close sidebar
$(document).on("swiped", function (e) {
  var barraLateral = $("#barra-lateral");

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
