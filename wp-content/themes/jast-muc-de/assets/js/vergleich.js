/* Suwak Vorher/Nachher (runda 18): pozycja suwaka -> zmienna --pos na figurze. */
document.querySelectorAll('.iab-vergleich__range').forEach(function (r) {
	var f = r.closest('.iab-vergleich__item');
	var set = function () { f.style.setProperty('--pos', r.value + '%'); };
	r.addEventListener('input', set);
	set();
});
