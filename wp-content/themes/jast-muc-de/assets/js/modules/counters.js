/**
 * Counters — animacja liczb .iab-counter__num[data-count] przy wejściu w viewport.
 * @package iab
 */
export function initCounters() {
	const nums = document.querySelectorAll('.iab-counter__num[data-count]');
	if (!nums.length) return;

	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const animate = (el) => {
		const raw = el.dataset.count || '0';
		const suffix = el.dataset.suffix || '';
		const target = parseFloat(raw.replace(',', '.'));
		const decimals = (raw.split('.')[1] || '').length;
		if (reduce || isNaN(target)) { el.textContent = raw + suffix; return; }
		const dur = 1100, t0 = performance.now();
		const tick = (t) => {
			const p = Math.min((t - t0) / dur, 1);
			const eased = 1 - Math.pow(1 - p, 3);
			el.textContent = (target * eased).toFixed(decimals) + suffix;
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	};

	if (!('IntersectionObserver' in window)) { nums.forEach(animate); return; }
	const io = new IntersectionObserver((entries) => {
		entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
	}, { threshold: 0.4 });
	nums.forEach((n) => io.observe(n));
}
