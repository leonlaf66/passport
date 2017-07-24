<?php

namespace module\customer\models;

use WS;
use common\customer\Account;

class ForgotPasswordForm extends \common\customer\forms\ForgotPasswordForm
{
    public $email;
    public $isProcessed = false;

    public function rules()
    {
        return [
            [['email'], 'required'],
            [['email'], 'exist', 'targetClass'=>Account::className(),  'message' => 'Account not exist!']
        ];
    }

    public function attributeLabels()
    {
        return [
            'email'=>WS::t('account', 'Email Address')
        ];
    }

    public function getAccount()
    {
        return Account::findByEmail($this->email);
    }
}
