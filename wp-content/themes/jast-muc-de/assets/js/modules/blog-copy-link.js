/**
 * Kopiuj link artykułu (single.php, [data-blog-copy]) — toast potwierdzenia.
 * @package iab
 */
export function initBlogCopyLink() {
	const btn = document.querySelector('[data-blog-copy]');
	if (!btn || !navigator.clipboard) return;

	btn.addEventListener('click', () => {
		navigator.clipboard.writeText(btn.getAttribute('data-blog-copy')).then(() => {
			const toast = document.createElement('span');
			toast.className = 'iab-toast';
			toast.textContent = btn.dataset.blogCopyMsg || 'Link kopiert!';
			document.body.appendChild(toast);
			setTimeout(() => toast.remove(), 1800);
		});
	});
}
