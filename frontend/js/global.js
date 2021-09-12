// Hides and loading screen and sets the overflow to auto
function hideLoadingScreen() {
  $("#loading-screen").fadeOut("fast", function () {
    $(this).remove();
  });
  $("html").css("overflow-y", "auto");
}
