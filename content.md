---
marp: true
theme: codinstruct
paginate: false
---

# ![wordmark codinStruct](assets/img/geo_anim.svg) Conteúdo

---

## Markdown

A totalidade de conteúdo sobre as linguagens de programação é escrita em Markdown, e a quantidade __total__ aproximada de linhas está na tabela abaixo.

| Linguagem  | Linhas |
| ---------- | ------ |
| C          | 2500   |
| JavaScript | 1400   |

---

### Aqui está um trecho de Markdown

```markdown
Alguns caracteres não podem ser simplesmente digitados, portanto são representados utilizando **sequências de escape**, nesse caso uma barra invertida `\` seguida de um caractere. Na tabela abaixo estão algumas sequências de escape.

| Sequência | Descrição                          |
| :-------: | :--------------------------------- |
|   `\a`    | Produz um alerta audível ou visual |
|   `\n`    | Produz uma quebra de linha         |
|   `\\'`   | Produz uma aspa simples            |
```

---

### E aqui está o mesmo trecho exibido em nosso site

![Markdown estilizado](assets/img/markdown_estilizado.png)

---

## Como isso funciona?

---

## Webpack

O Webpack compila os códigos-fonte JavaScript e CSS para um formato que pode ser utilizado pelo navegador.

---

Exemplo Webpack antes de ser compilado:

```js
window.$ = require('jquery');
window.p5 = require('p5js/p5.js/p5.min.js');

import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import 'spinkit/spinkit.min.css';
```

---

Exemplo Webpack depois de ser compilado:

```js
/*! For license information please see index.js.LICENSE.txt */
(()=>{var e={7481:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});var n=r(8081),o=r.n(n),a=r(3645),i=r.n(a)()(o());i.push([e.id,'/*!\n * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.'
```
