/**
 * Promo-Modal-Trigger — zeigt [data-exit-intent] beim Verlassen der Seite nach oben
 * (Desktop, Maus verlässt Viewport oben) ODER nach 55% Scroll-Fortschritt (funktioniert
 * auch mobil, wo es kein "Maus verlässt Fenster"-Ereignis gibt). Opt-in: nur aktiv wenn
 * das Element existiert. 1×/Session gezeigt, Schließen blendet 7 Tage lang aus
 * (localStorage) — gleiches Muster wie das promo-modal bei mnc-concept.
 * @package iab
 */
const DISMISS_DAYS = 7;
const SCROLL_TRIGGER_PERCENT = 55;
const STORAGE_KEY = 'iab_promo_dismissed_until';
const SESSION_KEY = 'iab_promo_shown';

export function initExitIntent() {
	const modal = document.querySelector('[data-exit-intent]');
	if (!modal) return;

	const isDismissed = () => {
		const until = localStorage.getItem(STORAGE_KEY);
		return !!until && Date.now() < parseInt(until, 10);
	};

	let handled = sessionStorage.getItem(SESSION_KEY) === '1' || isDismissed();

	const show = () => {
		if (handled || document.body.classList.contains('iab-drawer-open')) return;
		handled = true;
		sessionStorage.setItem(SESSION_KEY, '1');
		modal.removeAttribute('hidden');
		requestAnimationFrame(() => modal.classList.add('is-open'));
		document.body.classList.add('iab-promo-locked');
	};
	const close = () => {
		modal.classList.remove('is-open');
		document.body.classList.remove('iab-promo-locked');
		setTimeout(() => modal.setAttribute('hidden', ''), 350);
	};
	const dismiss = () => {
		localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_DAYS * 86400000));
		close();
	};

	if (!handled) {
		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			if (max > 0 && (window.scrollY / max) * 100 >= SCROLL_TRIGGER_PERCENT) {
				show();
				window.removeEventListener('scroll', onScroll);
			}
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		document.addEventListener('mouseout', function onExit(e) {
			if (!e.relatedTarget && e.clientY <= 0) {
				show();
				document.removeEventListener('mouseout', onExit);
			}
		});
	}

	modal.querySelectorAll('[data-exit-close]').forEach((b) => b.addEventListener('click', dismiss));
	modal.addEventListener('click', (e) => { if (e.target === modal) dismiss(); });
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.classList.contains('is-open')) dismiss();
	});
}
