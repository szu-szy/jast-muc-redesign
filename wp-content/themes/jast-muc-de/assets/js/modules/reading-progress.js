/**
 * Reading progress — pasek postępu czytania wpisu (single.php, .iab-progress__bar).
 * @package iab
 */
export function initReadingProgress() {
	const bar = document.querySelector('.iab-progress__bar');
	const article = document.querySelector('.iab-article');
	if (!bar || !article) return;

	const update = () => {
		const top = article.offsetTop;
		const h = article.offsetHeight - window.innerHeight;
		const p = h > 0 ? (window.scrollY - top) / h : 0;
		bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
	};
	window.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update);
	update();
}
