// Show/hide sidebar items
$(".categoria").on("click", function () {
  // Change opened state
  $(this).toggleClass("aberta");

  // Rotating arrow
  $(this).find("i.fas").toggleClass("fa-rotate-180");

  // Show/hide children
  $(this).parent().find("li").toggle("fast");
});
