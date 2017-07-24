<?php
namespace module\cms\controllers;

use common\rets as Rets;

class ToolController extends \yii\web\Controller
{
    public function actionIndex()
    {
        $result = \common\rets\helper\SubwayGeo::getMatchedLines(-70.9971237183, 42.390499115, 1);
        echo "<pre>";
        var_dump($result);
        echo '</pre>';
exit;
        $search = \common\rets\Search::find()
            ->setPagination(1, 2)
            ->setFilterFloatRange('list_price', 4000, 5000)
            ->setFilter('property_type', [1,2,3,4,5,6,7,8]);

        $results = $search->query('Boston');

        echo '<pre>';
        var_dump($results['total']);
        echo '</pre>';
    }
}