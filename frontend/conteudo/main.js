function loadSidebarContent() {
  // This is the function that will eventually connect to the backend server to get a list
  // of all the sidebar elements. For now it is a static JSON object

  return [
    {
      type: "main",
      children: [
        {
          type: "category",
          name: "Básico",
          children: [
            {
              type: "subcategory",
              target: "C/Basico/introducao/introducao.html",
              name: "Introdução",
            },
            {
              type: "subcategory",
              target: "C/Basico/primeiro_programa/primeiro_programa.html",
              name: "Primeiro programa",
            },
            {
              type: "subcategory",
              target: "C/Basico/diretiva_include/diretiva_include.html",
              name: "Diretiva #include",
            },
            {
              type: "subcategory",
              target: "C/Basico/funcoes/funcoes.html",
              name: "Funções",
            },
            {
              type: "subcategory",
              target: "C/Basico/variaveis/variaveis.html",
              name: "Variáveis",
            },
            {
              type: "subcategory",
              target: "C/Basico/tipos/tipos.html",
              name: "Tipos Fundamentais",
            },
            {
              type: "subcategory",
              target: "C/Basico/tipos/tabelas.html",
              name: "Tabelas dos Tipos Fundamentais",
            },
          ],
        },
        {
          type: "category",
          name: "Intermediário",
          children: [
            {
              type: "subcategory",
              target:
                "C/Intermediario/conversoes_implicitas/conversoes_implicitas.html",
              name: "Conversões Implícitas",
            },
          ],
        },
        {
          type: "category",
          name: "Independente",
          children: [
            {
              type: "category",
              name: "Avançado",
              children: [
                {
                  type: "subcategory",
                  target:
                    "C/Independente/Avancado/selecao_generica/selecao_generica.html",
                  name: "Seleção Genérica",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

// This function recursively builds the sidebar based on a target and the content for inside that target
function populateSidebar(sidebarTarget, sidebarContent) {
  for (var sidebarChild of sidebarContent) {
    var li = $("<li></li>");
    var a = $("<a></a>");
    var ul = $("<ul></ul");

    switch (sidebarChild.type) {
      /** Adds:
       * <li>
       *   <a>
       *     <span class=icon>
       *       <i class="fas fa-angle-up"></i>
       *     </span>
       *     <span></span>
       *   </a>
       * </li>
       */
      case "category":
        a.addClass("categoria");

        sidebarTarget.append(
          li.append(
            a.append(
              // Icon span
              $("<span></span>")
                .addClass("icon")
                .append($("<i></i>").addClass("fas fa-angle-up")),
              // Text span
              $("<span></span>").text(sidebarChild.name)
            )
          )
        );
        break;

      /** Adds:
       * <li>
       *   <a>NAME</a> (data: {target: TARGET})
       * </li>
       */
      case "subcategory":
        a.addClass("subcategoria")
          .data("target", sidebarChild.target)
          .text(sidebarChild.name);

        sidebarTarget.append(li.append(a));
        break;

      // Makes li = sidebarTarget because the main object is not a sidebar item itself
      // Makes the root ul tag be <ul title="Linguagem C" data-titulo="Linguagem C">
      case "main":
        li = sidebarTarget;
        ul.addClass("menu-list").attr(
          "title",
          "Linguagem C",
          "data-titulo",
          "Linguagem C"
        );
        break;
    }

    // If this object has a children property, then we create a ul object and add it to the
    // current item and recursively call populateSidebar()
    if (sidebarChild.children) {
      li.append(ul);

      populateSidebar(ul, sidebarChild.children);
    }
  }
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
  $("#content").load(path, function () {
    highlightSourceCode();
    hideLoadingScreen();
  });
}

// Once the window finishes loading it will begin to load the content file
// When that is done the loading screen is hidden
// TODO: In the future this loading will be done dynamically depending on the page visited
$(window).on("load", function () {
  // Populates the sidebar with the values returned by the server
  populateSidebar($("aside"), loadSidebarContent());

  // Show/hide sidebar categories
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

  // Click sidebar items to load their specific content
  $(".subcategoria").on("click", function () {
    loadContent("/Projeto-Content-Converted/" + $(this).data("target"));
    $(".subcategoria").removeClass("is-active");
    $(this).addClass("is-active");
  });

  // Gets the first subcategory and uses it for the initial content
  var first = $(".subcategoria").first();
  first.addClass("is-active");
  loadContent("/Projeto-Content-Converted/" + first.data("target"));

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
