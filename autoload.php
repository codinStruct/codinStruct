<?php
spl_autoload_register(function ($class_name) {
    require_once "php_classes/" . $class_name . '.php';
});
