<?php
namespace module\cms\controllers;

use WS;
use yii\db\Query;

class LanguageController extends \yii\web\Controller
{
    public function actionSwitcher()
    {
        $language=  \Yii::$app->request->get('lang');  
        if(isset($language)){  
            \Yii::$app->session['language']=$language;  
        }
        $this->goBack(\Yii::$app->request->headers['referer']);  
    }

    public function actionSave($category, $source, $translation, $lang='zh-CN')
    {
        if (! WS::$app->translationStatus) return false;

        \module\cms\helpers\Language::submit($category, $source, $translation, $lang);

        echo 1;
        WS::$app->end();
    }
}