// Prints a error message in the content area
function setErrorMessage() {
  $("#content").html(
    "<h1>Erro ao carregar conteúdo</h1><p>Por favor, tente novamente mais tarde.</p>"
  );
}

// Makes a post request using json format and the body containing the data lang
function loadSidebarContent(language, category, page) {
  $.post({
    url: "/api/sidebar/" + language,
    success: (data) => {
      populateSidebar($("aside.sidebar"), data);

      // Show/hide sidebar categories
      $(".sidebar-category").on("click", function () {
        $(this)
          // Rotate arrow
          .find("i.fas")
          .toggleClass("fa-rotate-180");

        // Show/hide children
        $(this).parent().find("ul").toggle("fast");
      });

      // Click sidebar items to load their specific content
      $(".sidebar-item").on("click", function () {
        if (!$(this).hasClass("is-active")) {
          loadContent($(this).data("target"));
          $(".sidebar-item").removeClass("is-active");
          $(this).addClass("is-active");
          $("title").text($(this).text());
        }
      });

      // Find the element whose target is equal to language/category/page then activate it
      $(".sidebar-item")
        .filter(function () {
          return (
            $(this).data("target") == language + "/" + category + "/" + page
          );
        })
        .trigger("click")
        .parent()
        .parent()
        .show();
    },
    contentType: "application/json",
    dataType: "json",
  }).fail(setErrorMessage);
}

// This function builds the sidebar from the data received from the server
/** This should be the final html structure:
 * <ul> (main_ul)
 *   <li> (category_li)
 *     <a> (category_a)
 *      <span><i/> (icon)</span>
 *      <span>(Categoria Título)</span>
 *     <ul> (category_li_ul)
 *       <li> (page_li)
 *         <a>(Página Título)</a>
 *       </li>
 *     </ul>
 *   </li>
 * </ul>
 */
function populateSidebar(sidebarTarget, sidebarContent) {
  var main_ul = $("<ul class='menu-list'></ul")
    .attr("titulo", "Linguagem " + sidebarContent.title)
    .attr("data-titulo", "Linguagem " + sidebarContent.title);

  // Add the categories
  sidebarContent.category.forEach((category) => {
    var category_a = $("<a class='sidebar-category'></a>");
    var category_li = $("<li></li>");

    var category_li_ul = $("<ul></ul>").hide();

    main_ul.append(
      category_li.append(
        category_a.append(
          $("<span class='icon'><i class='fas fa-angle-down'/></span>"),
          $("<span></span>").text(category.title)
        ),
        category_li_ul
      )
    );

    // Add the pages
    category.page.forEach((page) => {
      var page_li = $("<li></li>").append(
        $("<a class='sidebar-item'></a>")
          .text(page.title)
          .data(
            "target",
            sidebarContent.path + "/" + category.path + "/" + page.path
          )
      );

      category_li_ul.append(page_li);
    });
  });

  sidebarTarget.append(main_ul);
}

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

  $.get("/api/content/" + path, function (data) {
    $("#content").html(data);

    highlightSourceCode();
  })
    .fail(setErrorMessage)
    .always(function () {
      history.pushState({}, "", "/conteudo/" + path);
      hideLoadingScreen();
    });
}

// Once the window finishes loading it will begin to load the content file
// When that is done the loading screen is hidden
$(window).on("load", function () {
  // Load the sidebar content based on the language
  var ulr_parts = window.location.pathname.split("/");
  ulr_parts.shift();

  var page = ulr_parts.pop();
  var category = ulr_parts.pop();
  var language = ulr_parts.pop();

  // Decide if the page url is valid
  if (page == undefined || category == undefined || language == undefined) {
    window.location.href = "/";
  } else {
    loadSidebarContent(language, category, page);
  }

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
});
