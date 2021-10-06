// Finds all pre>code elements and calls highlight.js for each one
function highlightSourceCode() {
  $("#content")
    .find("pre code")
    .each((_, el) => {
      hljs.highlightElement(el);
      hljs.lineNumbersBlock(el, { singleLine: true });
    });
}

function loadContent(path) {
  showLoadingScreen();
  $("#content").load(path, function () {
    highlightSourceCode();
    hideLoadingScreen();
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
  $(this).parent().find("ul").toggle("fast");
});

$(".subcategoria").on("click", function () {
  loadContent("/Projeto-Content-Converted/" + $(this).data("target"));
  $(".subcategoria").removeClass("is-active");
  $(this).addClass("is-active");
});

// Once the window finishes loading it will begin to load the content file
// When that is done the loading screen is hidden
// TODO: In the future this loading will be done dynamically depending on the page visited
$(window).on("load", function () {
  loadContent("/Projeto-Content-Converted/C/Basico/introducao/introducao.html");
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
