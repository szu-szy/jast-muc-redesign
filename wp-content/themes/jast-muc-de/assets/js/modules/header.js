/**
 * Header — klasa .is-scrolled po przewinięciu (cień/kompresja).
 * @package iab
 */
export function initHeader() {
	const header = document.querySelector('[data-header]');
	if (!header) return;

	let ticking = false;
	const update = () => {
		header.classList.toggle('is-scrolled', window.scrollY > 8);
		ticking = false;
	};
	update();
	window.addEventListener('scroll', () => {
		if (!ticking) { requestAnimationFrame(update); ticking = true; }
	}, { passive: true });
}
