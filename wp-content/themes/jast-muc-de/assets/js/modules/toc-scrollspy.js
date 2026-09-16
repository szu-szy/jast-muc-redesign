/**
 * Scroll-spy spisu treści — podświetla w .iab-art-toc sekcję aktualnie czytaną.
 * @package iab
 */
export function initTocScrollspy() {
	const tocLinks = Array.from(document.querySelectorAll('.iab-art-toc a[href^="#"]'));
	const heads = Array.from(document.querySelectorAll('.iab-art-prose h2[id], .iab-art-prose h3[id]'));
	if (!tocLinks.length || !heads.length || !('IntersectionObserver' in window)) return;

	const byId = {};
	tocLinks.forEach((a) => { byId[decodeURIComponent(a.getAttribute('href').slice(1))] = a.parentElement; });

	let current = null;
	const setActive = (li) => {
		if (li === current) return;
		tocLinks.forEach((a) => a.parentElement.classList.remove('is-active'));
		if (li) li.classList.add('is-active');
		current = li;
	};

	const visible = {};
	const io = new IntersectionObserver((entries) => {
		entries.forEach((e) => { visible[e.target.id] = e.isIntersecting; });
		const firstId = heads.find((h) => visible[h.id])?.id;
		if (firstId && byId[firstId]) setActive(byId[firstId]);
	}, { rootMargin: '-88px 0px -62% 0px', threshold: 0 });

	heads.forEach((h) => io.observe(h));
}
