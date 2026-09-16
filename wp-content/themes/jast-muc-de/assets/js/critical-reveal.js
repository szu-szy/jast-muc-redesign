/**
 * iab-js: animacje reveal tylko gdy JS działa (bez JS treść widoczna).
 * Safety-net: jeśli moduł nie odsłoni sekcji w 1.5s — pokaż je mimo wszystko.
 * Musi wykonać się synchronicznie w <head>, PRZED odmalowaniem strony — stąd
 * osobny, nie-modułowy plik (ES moduły są zawsze deferred) enqueue'owany
 * bezpośrednio w wp_head zamiast przez wp_enqueue_script_module (main.js).
 * @package iab
 */
document.documentElement.className += ' iab-js';
addEventListener('load', function () {
	setTimeout(function () {
		if (!window.__iabReveal) {
			document.querySelectorAll('.iab-reveal').forEach(function (e) { e.classList.add('is-visible'); });
		}
	}, 1500);
});
