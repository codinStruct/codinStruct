// Animação de exibir/esconder itens da barra lateral
$(".categoria").on("click", function () {
    // Trocando estado de abertura
    $(this).toggleClass("aberta");

    // Rodando ícone
    $(this).find("i.fas").toggleClass("fa-rotate-180");

    // Esconder/exibir filhos
    $(this).parent().find("li").toggle("fast");
})