// Clicking the button scrolls to the next page
$("#next-page-button").on("click", function () {
  $("#second-page")[0].scrollIntoView();
});

let html = $("html");
let introduction = $("#introduction");

// Vertical scrolling rotates the introduction
document.addEventListener("scroll", function () {
  // TODO: Optimize this function. It runs even when element is outside the viewport

  // Ranges from 0 to 1 when the first page is off the screen
  let progress = Math.min(1, html.scrollTop() / window.innerHeight);
  window.requestAnimationFrame(function () {
    introduction.css(
      "transform",
      `perspective(max(100vw, 100vh)) rotateY(${180 * progress}deg)`
    );

    introduction.find("> *").css("transform", `translateZ(${5 * progress}em)`);
  });
});
