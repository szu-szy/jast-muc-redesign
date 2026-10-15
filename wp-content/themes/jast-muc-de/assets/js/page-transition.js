/**
 * Runda 19 (2026-10-15): loader marki + przejścia między stronami (prompt: _design/PROMPT-motion-runda19-2026-10-15.md).
 * Synchronicznie w <head> (jak critical-reveal.js), bez zależności od modułów ES - kurtyna nie może zawisnąć,
 * gdy któryś moduł się nie wczyta. Każdy stan ma też bezpiecznik w CSS (animacja sama chowa kurtynę).
 *  - pierwsze wejście w sesji: html.iab-intro (pełna sekwencja z logo, ~1,1 s)
 *  - każda kolejna strona: html.iab-load (krótszy loader z logo, ~0,8 s); przy kliknięciu linku
 *    html.iab-leave (kurtyna z logo zasuwa się), więc przejście wygląda jak jeden ruch (runda 20).
 *  - prefers-reduced-motion: nic z tego.
 */
(function () {
	var d = document.documentElement;
	if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
	var first = true;
	try { first = !sessionStorage.getItem('iab-seen'); sessionStorage.setItem('iab-seen', '1'); } catch (e) {}
	d.classList.add(first ? 'iab-intro' : 'iab-load');
	// Pierwsze wejście: baner zgody cookies czeka, aż skończy się intro (inaczej rozmywa cały efekt).
	if (first) { d.classList.add('iab-hold-consent'); setTimeout(function () { d.classList.remove('iab-hold-consent'); }, 2600); }
	var done = function () { d.classList.remove('iab-intro', 'iab-load', 'iab-leave'); d.classList.add('iab-ready'); };
	setTimeout(done, first ? 3200 : 1600);

	// Powrót przyciskiem wstecz (bfcache): bez kurtyny, strona od razu widoczna.
	addEventListener('pageshow', function (e) { if (e.persisted) { done(); } });

	// Kliknięcie linku wewnętrznego: pasek postępu + kurtyna z logo zasuwa się, potem nawigacja.
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
		e.preventDefault();
		d.classList.add('iab-leave');
		setTimeout(function () { location.href = url.href; }, 320);
	});
})();
