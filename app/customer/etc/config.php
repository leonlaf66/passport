<?php
return [
    'urlRules'=>[
        '/login/' => 'customer/account/login',
        '/wechat-login/' => 'customer/account/wechat-login',
        '/logout/' => 'customer/account/logout',
        '/register/' => 'customer/account/register',
        '/forgot-password/' => 'customer/account/forgot-password',
        '/forgot-password-sucess/' => 'customer/account/forgot-password-sucess',
        '/email-verify/' => 'customer/account/email-verify',
        '/send-email/' => 'customer/account/send-email',
        '/email-confirm/'=> 'customer/account/email-confirm',
        '/reset-password/' => 'customer/account/reset-password',
        '/bind-email-address/' => 'customer/account/bind-email-address',
    ]
];