jQuery( function ( $ ) {
	let frame;
	$( '#iab_pdf_pick' ).on( 'click', function ( e ) {
		e.preventDefault();
		if ( frame ) {
			frame.open();
			return;
		}
		frame = wp.media( {
			title: 'Wybierz PDF',
			library: { type: 'application/pdf' },
			button: { text: 'Użyj tego PDF' },
			multiple: false,
		} );
		frame.on( 'select', function () {
			const a = frame.state().get( 'selection' ).first().toJSON();
			$( '#iab_pdf_field' ).val( a.id );
			$( '#iab_pdf_current' ).html( '📄 <a href="' + a.url + '" target="_blank" rel="noopener">' + ( a.title || a.filename || 'PDF' ) + '</a>' );
			$( '#iab_pdf_clear' ).removeClass( 'iab-admin-hidden' );
		} );
		frame.open();
	} );
	$( '#iab_pdf_clear' ).on( 'click', function ( e ) {
		e.preventDefault();
		$( '#iab_pdf_field' ).val( '' );
		$( '#iab_pdf_current' ).html( '<em>Brak PDF.</em>' );
		$( this ).addClass( 'iab-admin-hidden' );
	} );
} );
