<?php
namespace module\customer\controllers;

use WS;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use module\customer\models\LoginForm;
use module\customer\models\RegisterForm;
use module\customer\models\ForgotPasswordForm;

class AccountController extends \yii\web\Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
        ];
    }

    public function actionLogin()
    {
        if (! WS::$app->user->isGuest) {
            return $this->goHome();
        }

        $loginForm = new LoginForm();
        if(WS::$app->request->isPost) {
            $loginForm->load(WS::$app->request->post());
            if($account = $loginForm->login()) {
                if(! $account->getIsConfirmed()) {
                    WS::$app->user->logout();
                    return $this->redirect(['/email-verify', 'id'=>$account->id, 'token'=>$account->access_token, 'from'=>'login']);
                }
                if($callbackUrl = WS::$app->request->get('callback')) {
                    $callbackUrl = urldecode($callbackUrl);
                    return $this->redirect($callbackUrl);
                }
                return $this->redirect(WS::$app->memberUrl);
            }
        }

        return $this->render('login', [
            'formModel' => $loginForm,
        ]);
    }

    public function actionCheckLogin()
    {
        $status = ! WS::$app->user->isGuest;
        if($status) {
            $userId = WS::$app->user->id;
            $profile = \common\customer\Profile::findOne($userId);
            if(!$profile || !$profile->phone_number) {
                $status = 999;
            }
        }
        echo json_encode($status);
        WS::$app->end();
    }

    public function actionRegister()
    {
        if (! WS::$app->user->isGuest) {
            return $this->goHome();
        }

        $registerForm = new RegisterForm();
        if(WS::$app->request->isPost) {
            $registerForm->load(WS::$app->request->post());
            if($registerForm->validate()) {
                if($user = $registerForm->accountRegister()) {
                    $url = \yii\helpers\Url::to(['/email-confirm', 'id' => $user->id, 'token'=>$user->access_token], true);
                    $user->sendConfirmEmail($url);

                    return $this->redirect(['/email-verify', 'id'=>$user->id, 'token'=>$user->access_token]);
                }
            }
        }
        return $this->render('register', [
            'formModel' => $registerForm,
        ]);
    }

    public function actionEmailVerify($id, $token)
    {
        $account = \common\customer\Account::findOne($id);
        if(! $account) {
            return $this->goHome();
        }
        
        return $this->render('email-verify', [
            'account' => $account,
        ]);
    }

    public function actionEmailConfirm($id, $token)
    {
        $account = \common\customer\Account::findOne($id);
        if(! $account) {
            return $this->goHome();
        }
        
        if($account->getIsConfirmed()) {
            return $this->goHome();
        }

        if($account->access_token !== $token) {
            return $this->goHome();
        }

        $account->confirmed_at = date('Y-m-d H:i:s', time());
        $account->save();

        return $this->render('email-confirmed', [
            'account' => $account,
        ]);
    }

    public function actionSendEmail($id, $token)
    {
        $result = null;

        $account = \common\customer\Account::findOne($id);
        if($account && $account->access_token === $token) {
            $url = \yii\helpers\Url::to(['/email-confirm', 'id' => $account->id, 'token'=>$account->access_token], true);
            $result = $account->sendConfirmEmail($url);
        }
        echo json_encode($result);
        WS::$app->end();
    }

    public function actionForgotPassword()
    {
        $forgotForm = new ForgotPasswordForm();
        if(WS::$app->request->isPost) {
            $forgotForm->load(WS::$app->request->post());
            if($forgotForm->validate()) {
                if($account = $forgotForm->getAccount()) {
                    $emailUrlLink = \yii\helpers\Url::to(['/reset-password', 'id' => $account->id, 'token'=>$account->access_token], true);
                    $account->sendRetrievePasswordEmail($emailUrlLink);
                    
                    return $this->redirect(['/forgot-password-sucess', 'id'=>$account->id, 'token'=>$account->access_token]);
                }
            }
        }

        return $this->render('forgot-password', [
            'formModel'=>$forgotForm
        ]);
    }

    public function actionForgotPasswordSucess($id, $token)
    {
        $account = \common\customer\Account::findOne($id);
        if($account->access_token !== $token) {
            $account = false;
        }

        return $this->render('forgot-password-sucess', [
            'account'=>$account
        ]);
    }

    public function actionResetPassword($id, $token)
    {
        $account = \common\customer\Account::findOne($id);
        if($account->access_token !== $token) {
            return $this->goHome();
        }

        $resetPasswordForm = new \module\customer\models\ResetPasswordForm();
        if(WS::$app->request->isPost) {
            $resetPasswordForm->load(WS::$app->request->post());
            if($resetPasswordForm->validate()) {
                $account->resetPassword($resetPasswordForm->new_password);
                return $this->redirect(['/login', 'from'=>'reset-password']);
            }
        }

        return $this->render('reset-password', [
            'formModel'=>$resetPasswordForm
        ]);
    }

    public function actionLogout()
    {
        WS::$app->user->logout();

        return $this->goHome();
    }

    public function goHome()
    {
        $this->redirect(WS::$app->houseBaseUrl);
    }
}