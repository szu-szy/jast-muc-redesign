/**
 * Google Consent Mode v2 (default DENY) + GTM/GA4/Google Ads/Meta Pixel bootstrap,
 * consent-aware przez most CookieYes → Consent Mode. Config czytany z data-attrs
 * na <html> (header.php::iab_tracking_data_attrs(), inc/config.php) — CELOWO nie
 * przez wp_localize_script, bo to wymagałoby 'unsafe-inline' w script-src CSP.
 * Dzięki data-attrs script-src zostaje 'self' bez wyjątków (patrz inc/security.php).
 *
 * Klasyczny (nie-moduł) skrypt — musi wykonać się jak najwcześniej w <head>, PRZED
 * jakimkolwiek tagiem GTM/GA4. ES moduły (main.js) są zawsze deferred, więc się nie
 * nadają do tej roli.
 *
 * @package iab
 */
( function () {
	'use strict';
	var d = document.documentElement.dataset;
	var cfg = {
		gtm: d.iabGtm || '',
		ga4: d.iabGa4 || '',
		pixel: d.iabPixel || '',
		ads: d.iabAds || '',
		conversionLabel: d.iabConversionLabel || '',
	};
	if ( ! cfg.gtm && ! cfg.ga4 && ! cfg.pixel && ! cfg.ads ) {
		return;
	}

	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push( arguments ); }
	window.gtag = window.gtag || gtag;

	gtag( 'consent', 'default', {
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
		analytics_storage: 'denied',
		functionality_storage: 'granted',
		security_storage: 'granted',
		wait_for_update: 500,
	} );

	function loadScript( src ) {
		var s = document.createElement( 'script' );
		s.async = true;
		s.src = src;
		document.head.appendChild( s );
	}

	function loadPixel( id ) {
		/* Oficjalny snippet Meta Pixel (loader), sparametryzowany po ID. */
		!function ( f, b, e, v, n, t, s ) {
			if ( f.fbq ) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply( n, arguments ) : n.queue.push( arguments );
			};
			if ( ! f._fbq ) f._fbq = n;
			n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
			t = b.createElement( e ); t.async = true; t.src = v;
			s = b.getElementsByTagName( e )[ 0 ]; s.parentNode.insertBefore( t, s );
		}( window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js' );
		window.fbq( 'init', id );
		window.fbq( 'track', 'PageView' );
	}

	var pixelLoaded = false;
	function applyConsent() {
		try {
			if ( typeof window.getCkyConsent !== 'function' ) return;
			var c = window.getCkyConsent().categories || {};
			gtag( 'consent', 'update', {
				ad_storage: c.advertisement ? 'granted' : 'denied',
				ad_user_data: c.advertisement ? 'granted' : 'denied',
				ad_personalization: c.advertisement ? 'granted' : 'denied',
				analytics_storage: c.analytics ? 'granted' : 'denied',
				functionality_storage: c.functional ? 'granted' : 'denied',
			} );
			if ( cfg.pixel && c.advertisement && ! pixelLoaded ) {
				pixelLoaded = true;
				loadPixel( cfg.pixel );
			}
		} catch ( e ) { /* CookieYes jeszcze nie gotowe — kolejna próba na load/consent-update. */ }
	}
	document.addEventListener( 'cookieyes_consent_update', applyConsent );
	window.addEventListener( 'load', applyConsent );

	// 2) Google Tag Manager — oficjalny snippet, respektuje Consent Mode.
	if ( cfg.gtm ) {
		( function ( w, d, s, l, i ) {
			w[ l ] = w[ l ] || [];
			w[ l ].push( { 'gtm.start': new Date().getTime(), event: 'gtm.js' } );
			var f = d.getElementsByTagName( s )[ 0 ], j = d.createElement( s ), dl = l != 'dataLayer' ? '&l=' + l : '';
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
			f.parentNode.insertBefore( j, f );
		} )( window, document, 'script', 'dataLayer', cfg.gtm );
	}

	// 3) GA4, gtag.js (gdy używany bez GTM). Respektuje Consent Mode.
	if ( cfg.ga4 ) {
		loadScript( 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4 );
		gtag( 'js', new Date() );
		gtag( 'config', cfg.ga4 );
	}

	// 4) Google Ads, gtag.js (fallback gdy brak GTM; przy GTM konwersję trzymaj w kontenerze).
	if ( cfg.ads && ! cfg.gtm ) {
		loadScript( 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ads );
		gtag( 'js', new Date() );
		gtag( 'config', cfg.ads );
	}

	// 5) Konwersja Google Ads na stronie podziękowania — cfg.conversionLabel ustawiane
	//    TYLKO na /dziekujemy/ (inc/config.php), zaliczy się po zgodzie na reklamy.
	if ( cfg.ads && cfg.conversionLabel ) {
		gtag( 'event', 'conversion', { send_to: cfg.ads + '/' + cfg.conversionLabel } );
	}
} )();
