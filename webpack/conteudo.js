const hljs = require('highlight.js');
const $ = require('jquery');

require('@fortawesome/fontawesome-free/js/all');
require('highlightjs-line-numbers.js');

import 'spinkit/spinkit.min.css'
import 'highlight.js/styles/base16/ros-pine-moon.css';

window.hljs = hljs;
window.$ = window.jQuery = $;