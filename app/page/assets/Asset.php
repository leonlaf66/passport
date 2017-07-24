<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace module\page\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class Asset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        '/static/css/main.css?v2'
    ];
    public $js = [
        '/static/lib/jquery.min.js'
    ];
    public $depends = [
        
    ];
    public $jsOptions = ['position'=>\yii\web\View::POS_HEAD];
}
