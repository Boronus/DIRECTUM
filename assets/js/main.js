/*
	Solid State by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	"use strict";

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			}

		// Menu.
			var $menu = $('#menu');

			$menu._locked = false;

			$menu._lock = function() {

				if ($menu._locked)
					return false;

				$menu._locked = true;

				window.setTimeout(function() {
					$menu._locked = false;
				}, 350);

				return true;

			};

			$menu._show = function() {

				if ($menu._lock())
					$body.addClass('is-menu-visible');

			};

			$menu._hide = function() {

				if ($menu._lock())
					$body.removeClass('is-menu-visible');

			};

			$menu._toggle = function() {

				if ($menu._lock())
					$body.toggleClass('is-menu-visible');

			};

			$menu
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();

					// Hide.
						$menu._hide();

				})
				.find('.inner')
					.on('click', '.close', function(event) {

						event.preventDefault();
						event.stopPropagation();
						event.stopImmediatePropagation();

						// Hide.
							$menu._hide();

					})
					.on('click', function(event) {
						event.stopPropagation();
					})
					.on('click', 'li.dropdown', function(event) {
						if(!$(this).hasClass('opened')){
							$('.opened').children('.sub-links').slideUp(200);
							$('.opened').toggleClass('opened');
						}
						$(this).toggleClass('opened');
						if($(this).hasClass('opened')) {
							$(this).children('.sub-links').slideDown(200);
							$(this).addClass('menu_line_top');
							//$('.last_child').toggleClass('menu_line');
						} else {
							$(this).children('.sub-links').slideUp(200);
							$(this).removeClass('menu_line_top');
							//$('.last_child').toggleClass('menu_line');
						}

						//event.preventDefault();
						event.stopPropagation();

						// Hide.
							//$menu._hide();

						// Redirect.
						// 	window.setTimeout(function() {
						// 		window.location.href = href;
						// 	}, 350);


					});
			$body
				.on('click', 'a[href="#menu"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu._toggle();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu._hide();

				});

        $("#form").submit(function() { //устанавливаем событие отправки для формы с id=form
            var form_data = $(this).serialize(); //собераем все данные из формы

            // Работа с виджетом recaptcha
            // 1. Получить ответ гугл капчи
            var captcha = grecaptcha.getResponse();

            // 2. Если ответ пустой, то выводим сообщение о том, что пользователь не прошёл тест.
            // Такую форму не будем отправлять на сервер.
            if (!captcha.length) {
                // Выводим сообщение об ошибке
                $('#recaptchaError').text('* Вы не прошли проверку "Я не робот"');
            } else {
                // получаем элемент, содержащий капчу
                $('#recaptchaError').text('');
            }

            // 3. Если форма валидна и длина капчи не равно пустой строке, то отправляем форму на сервер (AJAX)
            if ((formValid) && (captcha.length)) {

                // добавить в formData значение 'g-recaptcha-response'=значение_recaptcha
                form_data.append('g-recaptcha-response', captcha);

                $.ajax({
                    type: "POST", //Метод отправки
                    url: 'send.php', //путь до php фаила отправителя
                    data: form_data,
                    success: function (data) {
                        //код в этом блоке выполняется при успешной отправке сообщения
                        alert("Ваше сообщение отпрвлено!");

                        // разбираем строку JSON, полученную от сервера
                        var $data =  JSON.parse(data);
                        // устанавливаем элементу, содержащему текст ошибки, пустую строку
                        $('#error').text('');

                        // если сервер вернул ответ success, то значит двнные отправлены
                        if ($data.result == "success") {
                            // скрываем форму обратной связи
                            $('#messageForm').hide();
                            // удаляем у элемента, имеющего id=msgSubmit, класс hidden
                            $('#msgSubmit').removeClass('hidden');
                        } else {
                            // Если сервер вернул ответ error, то делаем следующее...
                            $('#error').text('Произошла ошибка при отправке формы на сервер.');
                            // Сбрасываем виджет reCaptcha
                            grecaptcha.reset();
                            // Если существует свойство msg у объекта $data, то...
                            if ($data.msg) {
                                // вывести её в элемент у которого id=recaptchaError
                                $('#msg').text($data.msg);
                            }
                            if ($data.files) {
                                $('#error').html($('#error').text()+'<br>'+$data.files);
                            }
                        }
                    },
                    error: function (request) {
                        $('#error').text('Произошла ошибка ' + request.responseText + ' при отправке данных.');
                    }
                });
            }
        });

		jQuery('#scrollup img').mouseover( function(){
			jQuery( this ).animate({opacity: 0.65},100);
		}).mouseout( function(){
			jQuery( this ).animate({opacity: 1},100);
		}).click( function(){
			window.scroll(0 ,0);
			return false;
		});

		jQuery(window).scroll(function(){
			if ( jQuery(document).scrollTop() > 0 ) {
				jQuery('#scrollup').fadeIn('fast');
			} else {
				jQuery('#scrollup').fadeOut('fast');
			}
		});

	});


})(jQuery);
