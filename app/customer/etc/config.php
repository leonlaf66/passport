<?php
return [
    'urlRules'=>[
        '/login/' => 'customer/account/login',
        '/logout/' => 'customer/account/logout',
        '/register/' => 'customer/account/register',
        '/forgot-password/' => 'customer/account/forgot-password',
        '/forgot-password-sucess/' => 'customer/account/forgot-password-sucess',
        '/email-verify/' => 'customer/account/email-verify',
        '/send-email/' => 'customer/account/send-email',
        '/email-confirm/'=>'customer/account/email-confirm'
    ]
];