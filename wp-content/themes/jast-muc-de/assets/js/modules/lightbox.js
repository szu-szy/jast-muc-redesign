/**
 * Lightbox z karuzelą dla galerii realizacji — klik na zdjęcie otwiera przybliżony
 * widok + strzałki nawigacji między zdjęciami tej samej galerii (Escape/klik w tło
 * zamyka). Jedenasta runda: user "chce ladna karuzele jak klikne w zdjecie czyli
 * przyblizenie". Zdjęcia same w sobie NIE są linkami do innych podstron (ósma runda) —
 * to celowo IN-PAGE powiększenie, nie nawigacja.
 * @package iab
 */
export function initLightbox() {
	const galleries = document.querySelectorAll('[data-lightbox-gallery]');
	if (!galleries.length) return;

	let overlay = null;
	let imgEl, counterEl;
	let items = [];
	let index = 0;

	function build() {
		overlay = document.createElement('div');
		overlay.className = 'iab-lightbox';
		overlay.hidden = true;
		overlay.innerHTML =
			'<button class="iab-lightbox__close" type="button" aria-label="Schließen">&times;</button>' +
			'<button class="iab-lightbox__nav iab-lightbox__nav--prev" type="button" aria-label="Vorheriges Foto">&#8249;</button>' +
			'<img class="iab-lightbox__img" alt="">' +
			'<button class="iab-lightbox__nav iab-lightbox__nav--next" type="button" aria-label="Nächstes Foto">&#8250;</button>' +
			'<span class="iab-lightbox__counter"></span>';
		document.body.appendChild(overlay);
		imgEl = overlay.querySelector('.iab-lightbox__img');
		counterEl = overlay.querySelector('.iab-lightbox__counter');
		overlay.querySelector('.iab-lightbox__close').addEventListener('click', close);
		overlay.querySelector('.iab-lightbox__nav--prev').addEventListener('click', () => show(index - 1));
		overlay.querySelector('.iab-lightbox__nav--next').addEventListener('click', () => show(index + 1));
		overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
		document.addEventListener('keydown', (e) => {
			if (!overlay || overlay.hidden) return;
			if (e.key === 'Escape') close();
			if (e.key === 'ArrowLeft') show(index - 1);
			if (e.key === 'ArrowRight') show(index + 1);
		});
	}

	function show(i) {
		index = (i + items.length) % items.length;
		const el = items[index];
		const thumb = el.querySelector('img');
		imgEl.src = el.dataset.full || (thumb ? thumb.src : '');
		imgEl.alt = thumb ? thumb.alt : '';
		counterEl.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
	}

	function open(i) {
		if (!overlay) build();
		overlay.hidden = false;
		document.body.classList.add('iab-lightbox-open');
		show(i);
	}

	function close() {
		if (!overlay) return;
		overlay.hidden = true;
		document.body.classList.remove('iab-lightbox-open');
	}

	galleries.forEach((gallery) => {
		const galleryItems = Array.from(gallery.querySelectorAll('[data-lightbox-item]'));
		galleryItems.forEach((el, i) => {
			el.addEventListener('click', () => { items = galleryItems; open(i); });
		});
	});
}
