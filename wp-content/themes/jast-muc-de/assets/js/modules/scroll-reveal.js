/**
 * Scroll-reveal — .iab-reveal → .is-visible przy wejściu w viewport.
 * @package iab
 */
export function initReveal() {
	window.__iabReveal = true; // sygnał dla safety-net w <head>
	const els = document.querySelectorAll('.iab-reveal');
	if (!els.length) return;

	if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
		els.forEach((el) => el.classList.add('is-visible'));
		return;
	}

	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				io.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

	els.forEach((el) => io.observe(el));
}
