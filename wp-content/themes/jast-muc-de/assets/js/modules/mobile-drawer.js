/**
 * Kanoniczny drawer/sheet: open/close, focus-trap, scroll-lock, ESC, overlay.
 * Obsługuje WIELE niezależnych instancji na stronie (np. nawigacja z prawej +
 * mobilny bottom-sheet formularza wyceny) — każda dopasowana po id:
 * <div id="iab-drawer" data-drawer> ... <button data-drawer-open="iab-drawer">.
 * @package iab
 */
const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export function initDrawer() {
	document.querySelectorAll('[data-drawer]').forEach(initOneDrawer);
}

function initOneDrawer(drawer) {
	const panel = drawer.querySelector('.iab-drawer__panel, .iab-sheet__panel');
	if (!panel) return;
	const id = drawer.id;
	const openBtns = id
		? document.querySelectorAll(`[data-drawer-open="${id}"]`)
		: document.querySelectorAll('[data-drawer-open]');
	const closeEls = drawer.querySelectorAll('[data-drawer-close]');
	let lastFocused = null;

	const trap = (e) => {
		if (e.key === 'Escape') { close(); return; }
		if (e.key !== 'Tab') return;
		const f = panel.querySelectorAll(FOCUSABLE);
		if (!f.length) return;
		const first = f[0], last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
		else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
	};

	const open = () => {
		lastFocused = document.activeElement;
		drawer.hidden = false;
		requestAnimationFrame(() => drawer.classList.add('is-open'));
		document.body.style.overflow = 'hidden';            // scroll-lock
		document.documentElement.classList.add('iab-drawer-open');
		openBtns.forEach((b) => b.setAttribute('aria-expanded', 'true'));
		(panel.querySelector(FOCUSABLE) || panel).focus();
		document.addEventListener('keydown', trap);
	};

	const close = () => {
		drawer.classList.remove('is-open');
		document.body.style.overflow = '';
		document.documentElement.classList.remove('iab-drawer-open');
		openBtns.forEach((b) => b.setAttribute('aria-expanded', 'false'));
		document.removeEventListener('keydown', trap);
		const onEnd = () => { drawer.hidden = true; panel.removeEventListener('transitionend', onEnd); };
		panel.addEventListener('transitionend', onEnd);
		if (lastFocused) lastFocused.focus();
	};

	openBtns.forEach((b) => b.addEventListener('click', open));
	closeEls.forEach((b) => b.addEventListener('click', close));
	// Zamknij po kliknięciu w link menu (nie dotyczy sheet z formularzem — tam nie ma linków nawigacji)
	panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}
