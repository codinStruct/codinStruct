// Shows the loading screen and sets the overflow to hidden
function showLoadingScreen() {
  $("#loading-screen").show();
  $("html").css("overflow-y", "hidden");
}

// Hides the loading screen and sets the overflow to auto
function hideLoadingScreen() {
  $("#loading-screen").fadeOut("fast");
  $("html").css("overflow-y", "auto");
}
