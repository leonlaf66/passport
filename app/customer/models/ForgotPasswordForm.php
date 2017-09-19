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
            [['email'], 'validateAccountId'],
            //[['email'], 'exist', 'targetClass'=>Account::className(),  'message' => 'Account not exist!']
        ];
    }

    public function validateAccountId($attribute, $params)
    {
        if(! Account::find()->where('`email=:id or phone_number=:id', [':id' => $this->$attribute])->exists()) {
            $this->addError($attribute, tt('The account not exist!', '不存在的帐号!'));
            return false;
        }
        return true;
    }

    public function getAccount()
    {
        return Account::findByEmail($this->email);
    }
}
