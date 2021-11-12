$(window).on("load", function () {
  // Loads the descriptions of every language
  $.get({
    url: "/api/descriptions",
    success: function (data) {
      // Add a <li><span class="languages-button">DESCRIPTION<span></li> in #languages-list for every description
      for (let language of data) {
        $("#languages-list").append(
          $("<li></li>").append(
            $(`<span class="languages-button">${language.title}</span>`)
              .data("description", language.description)
              .data("path", language.path)
          )
        );
      }

      // Languages sidebar click event
      $(".languages-button").on("click", function () {
        // Add the description to the #description-wrapper
        $("#description-wrapper").html(
          $(`<p>${$(this).data("description")}</p>`)
        );

        // Add the link to the language page
        $("#description-wrapper").append(
          $(`<a href="${$(this).data("path")}">Aprender linguagem</a>`)
        );

        // Change the active state
        $(".languages-button").removeClass("is-active");
        $(this).addClass("is-active");
      });

      // Click the first one
      $(".languages-button:first").trigger("click");
    },
    contentType: "application/json",
    dataType: "json",
  }).fail(function () {
    $("#description-wrapper").html(
      $("<p>Could not load the descriptions. Please try again later.</p>")
    );

    hideLoadingScreen();
  });

  // Clicking the button scrolls to the next page
  $("#next-page-button").on("click", function () {
    $("#second-page")[0].scrollIntoView();
  });

  hideLoadingScreen();
});
