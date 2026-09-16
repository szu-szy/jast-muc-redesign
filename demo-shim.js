(function () {
	function showNote(form) {
		var wrap = form.closest('.wpcf7') || form.parentNode;
		var note = wrap.querySelector('.iab-demo-note');
		if (!note) {
			note = document.createElement('div');
			note.className = 'iab-demo-note';
			note.style.cssText = 'margin-top:16px;padding:14px 18px;background:#e8edf1;color:#07456f;border-radius:4px;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.5;';
			note.textContent = 'Dies ist eine Demo-Version der Website. Das Formular ist erst auf der veröffentlichten Live-Seite aktiv.';
			form.insertAdjacentElement('afterend', note);
		}
		note.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
	document.addEventListener('submit', function (e) {
		var form = e.target.closest && e.target.closest('.wpcf7-form');
		if (!form) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		showNote(form);
	}, true);
})();
