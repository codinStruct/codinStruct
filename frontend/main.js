// Clicking the button scrolls to the next page
$("#next-page-button").on("click", function () {
  $("#second-page")[0].scrollIntoView();
});

// Toggles the active state of the navbar when in mobile mode
$(".navbar-burger").on("click", function () {
  $(this).toggleClass("is-active");
  $("#" + $(this)[0].dataset.target).toggleClass("is-active");
});

// Hides the loading screen
$(window).on("load", function () {
  hideLoadingScreen();
});