/**
 * Runda 19 (2026-10-15): loader marki + przejścia między stronami (prompt: _design/PROMPT-motion-runda19-2026-10-15.md).
 * Synchronicznie w <head> (jak critical-reveal.js), bez zależności od modułów ES - kurtyna nie może zawisnąć,
 * gdy któryś moduł się nie wczyta. Każdy stan ma też bezpiecznik w CSS (animacja sama chowa kurtynę).
 *  - pierwsze wejście w sesji: html.iab-intro (pełna sekwencja z logo, ~1,1 s)
 *  - kolejne strony: przeglądarki z View Transitions robią przejście same (CSS @view-transition);
 *    pozostałe: html.iab-enter (kurtyna odjeżdża w górę) + przy kliknięciu html.iab-leave (kurtyna zasuwa się).
 *  - prefers-reduced-motion: nic z tego.
 */
(function () {
	var d = document.documentElement;
	if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
	var vt = 'CSSViewTransitionRule' in window;
	var first = true;
	try { first = !sessionStorage.getItem('iab-seen'); sessionStorage.setItem('iab-seen', '1'); } catch (e) {}
	var mode = first ? 'iab-intro' : (vt ? '' : 'iab-enter');
	if (mode) { d.classList.add(mode); }
	// Pierwsze wejście: baner zgody cookies czeka, aż skończy się intro (inaczej rozmywa cały efekt).
	if (first) { d.classList.add('iab-hold-consent'); setTimeout(function () { d.classList.remove('iab-hold-consent'); }, 2600); }
	var done = function () { d.classList.remove('iab-intro', 'iab-enter', 'iab-leave'); d.classList.add('iab-ready'); };
	setTimeout(done, first ? 3200 : 900);

	// Powrót przyciskiem wstecz (bfcache): bez kurtyny, strona od razu widoczna.
	addEventListener('pageshow', function (e) { if (e.persisted) { done(); } });

	// Pasek postępu u góry przy każdej nawigacji wewnętrznej + kurtyna dla przeglądarek bez View Transitions.
	document.addEventListener('click', function (e) {
		var a = e.target.closest && e.target.closest('a[href]');
		if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
		if (a.target && a.target !== '_self') { return; }
		if (a.hasAttribute('download') || a.getAttribute('href').charAt(0) === '#') { return; }
		var url;
		try { url = new URL(a.href, location.href); } catch (err) { return; }
		if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) { return; }
		if (/\.(pdf|jpe?g|png|webp|zip)$/i.test(url.pathname) || /wp-admin|wp-login/.test(url.pathname)) { return; }
		d.classList.add('iab-navigating');
		if (vt) { return; }
		e.preventDefault();
		d.classList.add('iab-leave');
		setTimeout(function () { location.href = url.href; }, 320);
	});
})();
