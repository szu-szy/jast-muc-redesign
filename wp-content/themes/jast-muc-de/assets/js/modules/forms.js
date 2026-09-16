/**
 * Formularze — redirect na /dziekujemy/ po wysłaniu CF7 + drobny UX.
 * @package iab
 */
export function initForms() {
	// CF7: po sukcesie → strona podziękowania (jeśli istnieje).
	document.addEventListener('wpcf7mailsent', () => {
		const url = (document.documentElement.dataset.iabThankyouUrl || '/dziekujemy/');
		// pozwól GA4/Pixel złapać event, potem redirect
		setTimeout(() => { window.location.assign(url); }, 250);
	}, false);

	// UX: scroll do pierwszego błędu
	document.addEventListener('wpcf7invalid', (e) => {
		const form = e.target;
		const bad = form && form.querySelector('.wpcf7-not-valid');
		if (bad) bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}, false);

	// Formularz "wycena" na podstronie usługi ma pole [hidden usluga] — usunięte z
	// widoku (user 2026-09-14: formularz za długi, skrócić do imię/e-mail/telefon/
	// wiadomość), ale usługa nadal trafia do maila: auto-wypełniamy je nazwą usługi
	// z data-atrybutu na kontenerze (.iab-usluga-sidebar__card / .iab-sheet__inner).
	document.querySelectorAll('[data-iab-usluga]').forEach((el) => {
		const val = el.dataset.iabUsluga;
		el.querySelectorAll('input[name="usluga"]').forEach((input) => { input.value = val; });
	});
}
