/**
 * Runda 24 - pola panelu (inc/admin-panel.php): wybór zdjęcia / galerii z biblioteki
 * mediów oraz powtarzalne wiersze (pary przed/po).
 */
(function ($) {
	'use strict';

	function thumb(att, size) {
		var s = att.sizes && (att.sizes[size] || att.sizes.medium || att.sizes.full);
		return s ? s.url : att.url;
	}

	// Jedno zdjęcie
	$(document).on('click', '[data-iab-media] [data-iab-media-pick]', function (e) {
		e.preventDefault();
		var box = $(this).closest('[data-iab-media]');
		var frame = wp.media({ title: 'Wybierz zdjęcie', button: { text: 'Użyj tego zdjęcia' }, library: { type: 'image' }, multiple: false });
		frame.on('select', function () {
			var att = frame.state().get('selection').first().toJSON();
			box.find('[data-iab-media-input]').val(att.id);
			box.find('[data-iab-media-preview]').html('<img src="' + thumb(att, 'medium') + '" alt="">');
			box.find('[data-iab-media-clear]').prop('hidden', false);
		});
		frame.open();
	});

	// Galeria
	$(document).on('click', '[data-iab-gallery] [data-iab-media-pick]', function (e) {
		e.preventDefault();
		var box = $(this).closest('[data-iab-gallery]');
		var input = box.find('[data-iab-media-input]');
		var frame = wp.media({ title: 'Wybierz zdjęcia (Ctrl/Cmd = kilka)', button: { text: 'Użyj zaznaczonych' }, library: { type: 'image' }, multiple: 'add' });
		frame.on('open', function () {
			var sel = frame.state().get('selection');
			(input.val() || '').split(',').filter(Boolean).forEach(function (id) {
				var a = wp.media.attachment(id); a.fetch(); sel.add(a);
			});
		});
		frame.on('select', function () {
			var atts = frame.state().get('selection').toJSON();
			input.val(atts.map(function (a) { return a.id; }).join(','));
			box.find('[data-iab-media-preview]').html(atts.map(function (a) { return '<img src="' + thumb(a, 'thumbnail') + '" alt="">'; }).join(''));
			box.find('[data-iab-media-clear]').prop('hidden', !atts.length);
		});
		frame.open();
	});

	// Usuń zdjęcie / galerię
	$(document).on('click', '[data-iab-media-clear]', function (e) {
		e.preventDefault();
		var box = $(this).closest('[data-iab-media], [data-iab-gallery]');
		box.find('[data-iab-media-input]').val('');
		box.find('[data-iab-media-preview]').empty();
		$(this).prop('hidden', true);
	});

	// Powtarzalne wiersze
	$(document).on('click', '[data-iab-repeater-add]', function (e) {
		e.preventDefault();
		var rep = $(this).closest('[data-iab-repeater]');
		var html = rep.find('template[data-iab-repeater-template]').html().replace(/__i__/g, 'n' + Date.now());
		$(this).closest('p').before(html);
	});
	$(document).on('click', '[data-iab-repeater-remove]', function (e) {
		e.preventDefault();
		$(this).closest('[data-iab-repeater-row]').remove();
	});
})(jQuery);
