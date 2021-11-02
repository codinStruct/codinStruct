const $ = require('jquery');
const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('c', require('highlight.js/lib/languages/c'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

require('swiped-events');

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import 'spinkit/spinkit.min.css'
import 'highlight.js/styles/base16/ros-pine-moon.css';

window.hljs = hljs;
window.$ = $;