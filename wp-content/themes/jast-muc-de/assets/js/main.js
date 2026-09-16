/**
 * Entry ES module — ładuje moduły interakcji po DOM ready.
 * @package iab
 */
import { initDrawer } from './modules/mobile-drawer.js';
import { initReveal } from './modules/scroll-reveal.js';
import { initHeader } from './modules/header.js';
import { initForms } from './modules/forms.js';
import { initAccordion } from './modules/accordion.js';
import { initCounters } from './modules/counters.js';
import { initReadingProgress } from './modules/reading-progress.js';
import { initExitIntent } from './modules/exit-intent.js';
import { initEffects } from './modules/effects.js';
import { initBlogCopyLink } from './modules/blog-copy-link.js';
import { initTocScrollspy } from './modules/toc-scrollspy.js';
import { initLeadConversion } from './modules/lead-conversion.js';
import { initLightbox } from './modules/lightbox.js';

const boot = () => {
	initHeader();
	initDrawer();
	initReveal();
	initForms();
	initAccordion();
	initCounters();
	initReadingProgress();
	initExitIntent();
	initEffects();
	initBlogCopyLink();
	initTocScrollspy();
	initLeadConversion();
	initLightbox();
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', boot);
} else {
	boot();
}
