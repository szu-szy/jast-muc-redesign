/* Suwak Vorher/Nachher (runda 18/19): pozycja suwaka -> --pos; przy pierwszym pokazaniu
 * jednorazowa podpowiedź ruchem (50 -> 30 -> 70 -> 50), przerwana przez dotknięcie suwaka. */
document.querySelectorAll('.iab-vergleich__range').forEach(function (r) {
	var f = r.closest('.iab-vergleich__item');
	var set = function (v) { r.value = v; f.style.setProperty('--pos', v + '%'); };
	var touched = false;
	r.addEventListener('input', function () { touched = true; set(r.value); });
	set(r.value);
	if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
	var io = new IntersectionObserver(function (es) {
		if (!es[0].isIntersecting) { return; }
		io.disconnect();
		var keys = [[0, 50], [700, 30], [1500, 70], [2200, 50]], t0 = null;
		var ease = function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
		var step = function (ts) {
			if (touched) { return; }
			if (t0 === null) { t0 = ts; }
			var t = ts - t0, i = 1;
			while (i < keys.length - 1 && t > keys[i][0]) { i++; }
			var a = keys[i - 1], b = keys[i], p = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
			set(Math.round(a[1] + (b[1] - a[1]) * ease(p)));
			if (t < keys[keys.length - 1][0]) { requestAnimationFrame(step); }
		};
		setTimeout(function () { requestAnimationFrame(step); }, 400);
	}, { threshold: 0.5 });
	io.observe(f);
});
