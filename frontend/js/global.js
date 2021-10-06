function showLoadingScreen() {
  $("#loading-screen").fadeIn("fast");
  $("html").css("overflow-y", "hidden");
}

// Hides and loading screen and sets the overflow to auto
function hideLoadingScreen() {
  $("#loading-screen").fadeOut("fast");
  $("html").css("overflow-y", "auto");
}
