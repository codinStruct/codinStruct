// Show/hide sidebar items
$(".categoria").click(function () {
  $(this)
    // Change opened state
    .toggleClass("aberta")
    // Rotate arrow
    .find("i.fas")
    .toggleClass("fa-rotate-180");

  // Show/hide children
  $(this).parent().find("li").toggle("fast");
});

// Loading content, placing it and highlighting all 'pre code' with source code
// TODO: In the future this loading will be done dynamically depending on the page visited
$("#content").load(
  "/Projeto-Content-Converted/C/Basico/primeiro_programa/primeiro_programa.html",
  function () {
    $(this)
      .find("pre code")
      .each((_, el) => {
        hljs.highlightElement(el);
        hljs.lineNumbersBlock(el, { singleLine: true });
      });
  }
);

// Swipes to open/close sidebar
let barraLateral = $("#barra-lateral");

$(document).on("swiped", function (e) {
  switch (e.detail.dir) {
    case "left":
      // .stop so animations don't queue
      barraLateral.stop(false, true).hide("slide");
      break;

    case "right":
      // Ignore swipes over horizontally scrollable elements
      if (e.target.scrollWidth > e.target.clientWidth) return;
      barraLateral.stop(false, true).show("slide");
      break;
  }
});
