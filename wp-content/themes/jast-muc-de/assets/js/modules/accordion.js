/**
 * Accordion (FAQ) — toggle aria-expanded + panel hidden. A11y.
 * @package iab
 */
export function initAccordion() {
	document.querySelectorAll('.iab-accordion').forEach((acc) => {
		const heads = acc.querySelectorAll('.iab-accordion__head');
		heads.forEach((head) => {
			head.addEventListener('click', () => {
				const open = head.getAttribute('aria-expanded') === 'true';
				// (opcjonalnie) zamknij pozostałe — zostawiamy multi-open
				head.setAttribute('aria-expanded', String(!open));
				const panel = document.getElementById(head.getAttribute('aria-controls'));
				if (panel) panel.hidden = open;
			});
		});
	});
}
