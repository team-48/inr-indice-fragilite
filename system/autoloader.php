<?php

require __DIR__ . '/../vendor/autoload.php';

spl_autoload_register(function ($class_name)
{
    if (strpos($class_name, "App")) {
        return;
    }

    $components = explode("\\", str_replace("App\\", "", $class_name));

    for ($i = 0; $i < sizeof($components)-1; $i++) {
        $components[$i] = strtolower($components[$i]);
    }

    $file = implode("/", $components);

    @include __DIR__ . '/../' . $file . '.php';
});
