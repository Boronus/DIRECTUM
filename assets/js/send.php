<?php
// ваш секретный ключ
$secret = '6Lc-mhkUAAAAAFQp8ZiPvnl94zWWA0xdBjb_naXx';
// однократное включение файла autoload.php (клиентская библиотека reCAPTCHA PHP)
require_once (dirname(__FILE__).'/recaptcha/autoload.php');
// если в массиве $_POST существует ключ g-recaptcha-response, то...
if (isset($_POST['g-recaptcha-response'])) {
    // создать экземпляр службы recaptcha, используя секретный ключ
    $recaptcha = new \ReCaptcha\ReCaptcha($secret);
    // получить результат проверки кода recaptcha
    $resp = $recaptcha->verify($_POST['g-recaptcha-response'], $_SERVER['REMOTE_ADDR']);
    // если результат положительный, то...
    if ($resp->isSuccess()){
        // действия, если код captcha прошёл проверку
        if((isset($_POST['name'])&&$_POST['name']!="")&&(isset($_POST['org'])&&$_POST['org']!="")&&(isset($_POST['email'])&&$_POST['email']!="")){ //Проверка отправилось ли наше поля name и не пустые ли они
            $to = 'directum@intant.ru'; //Почта получателя, через запятую можно указать сколько угодно адресов
            $subject = 'Обратный звонок'; //Загаловок сообщения
            $message = '
                            <html>
                                <head>
                                    <title>'.$subject.'</title>
                                </head>
                                <body>
                                    <p>Имя: '.$_POST['name'].'</p>
                                    <p>Организация: '.$_POST['org'].'</p>
                                    <p>Телефон,почта: '.$_POST['email'].'</p>                        
                                </body>
                            </html>'; //Текст нащего сообщения можно использовать HTML теги
            $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
            $headers .= "From: Отправитель <directum@intant.ru>\r\n"; //Наименование и почта отправителя
            mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
        }
    } else {
        // иначе передать ошибку
        $errors = $resp->getErrorCodes();
        $data['error-captcha']=$errors;
        $data['msg']='Код капчи не прошёл проверку на сервере';
        $data['result']='error';
    }
} else {
    //ошибка, не существует ассоциативный массив $_POST["send-message"]
    $data['result']='error';
}
?>