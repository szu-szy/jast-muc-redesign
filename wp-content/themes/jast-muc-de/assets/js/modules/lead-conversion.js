/**
 * GA4: zdarzenie "generate_lead" po dotarciu na stronę podziękowania — element
 * z [data-iab-generate-lead] oznacza tę stronę (page-dziekujemy.php). Zdarzenie
 * odpala się dopiero gdy gtag dostępny (po zgodzie, patrz tracking.js).
 * @package iab
 */
export function initLeadConversion() {
	if ( ! document.querySelector( '[data-iab-generate-lead]' ) ) return;
	window.addEventListener( 'load', function () {
		if ( typeof window.gtag === 'function' ) {
			window.gtag( 'event', 'generate_lead', { source: 'form' } );
		}
	} );
}
