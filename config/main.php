<?php
$localConfig = include(__DIR__.'/local.php');

return \yii\helpers\ArrayHelper::merge(get_fdn_etc(), [
    'id' => 'usleju-passport',
    'basePath' => dirname(__DIR__),
    'layout'=>'@module/page/views/layouts/main.phtml',
    'defaultRoute'=>'home/default/index',
    'components' => [
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'suffix'=>strpos($_SERVER["REQUEST_URI"], '/rets-photo-') === false ? '/' : '',
            'rules'=>[]
        ],
        'view'=>[
            'class'=>'yii\web\View',
            'defaultExtension'=>'phtml',
            'renderers'=>[
                'twig' => [
                    'class' => 'yii\twig\ViewRenderer',
                    'cachePath' => '@runtime/Twig/cache',
                    // Array of twig options:
                    'options' => [
                        'auto_reload' => true,
                    ],
                    'globals' => ['html' => '\yii\helpers\Html'],
                    'uses' => ['yii\bootstrap']
                ],
                'blade' => [
                    'class' => '\cyneek\yii2\blade\ViewRenderer',
                    'cachePath' => '@runtime/blade_cache',
                ]
            ]
        ],
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'AulhaJkw74KJHBBq1JobpnXv90jLd8ba',
        ],
        'user' => [
            'identityClass' => '\module\customer\models\UserIdentity',
            'enableAutoLogin' => true,
        ],
        'session' => [
            'cookieParams' => ['domain' => domain(), 'lifetime' => 0],
            'timeout' => 3600,
        ],
        'authClientCollection' => [
           'class' => 'yii\authclient\Collection',
           'clients' => [
               'google' => [
                   'class' => 'yii\authclient\clients\GoogleOpenId'
               ],
               'facebook' => [
                   'class' => 'yii\authclient\clients\Facebook',
                   'clientId' => 'facebook_client_id',
                   'clientSecret' => 'facebook_client_secret',
               ],
           ],
        ],
        'assetManager'=>[
            /*cdn http://developer.baidu.com/wiki/index.php?title=docs/cplat/libs#jQuery*/
            /*cdn http://www.cdnjs.cn/*/
            /*cdn http://www.bootcdn.cn/jquery-mobile/*/
            'assetMap'=>[
                /*css*/
                'bootstrap.css'=>'http://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css',
                'admin.css'=>'css/styles.css',
                /*js*/
                'jquery.js'=>'http://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js',
                'bootstrap.js'=>'http://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js',
                'app.js'=>'js/app.js'
            ]
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
    ],
    'modules'=>[
        'cms'=>'module\cms\Module',
        'core'=>'module\core\Module',
        'customer'=>'module\customer\Module',
        'email'=>'module\email\Module',
        'page'=>'module\page\Module',
        'translatemanager' => 'lajax\translatemanager\Module'
    ],
    'aliases'=>[
        '@bower'=>APP_ROOT.'/vendor/bower',
        'module'=>APP_ROOT.'/app'
    ]
], $localConfig);