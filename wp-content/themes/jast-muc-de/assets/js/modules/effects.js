/**
 * Effects — parallax, tilt kart, word-by-word reveal nagłówków.
 * Wszystko opt-in (działa tylko gdy są elementy) + reduced-motion aware.
 * @package iab
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function parallax() {
	const els = document.querySelectorAll('.iab-parallax');
	if (!els.length || reduce) return;
	let ticking = false;
	const update = () => {
		els.forEach((el) => {
			const speed = parseFloat(el.dataset.speed || '0.12');
			const rect = el.getBoundingClientRect();
			const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
			el.style.setProperty('--py', offset.toFixed(1) + 'px');
		});
		ticking = false;
	};
	update();
	window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
}

function tilt() {
	const els = document.querySelectorAll('.iab-tilt');
	if (!els.length || reduce || matchMedia('(hover: none)').matches) return;
	els.forEach((el) => {
		el.addEventListener('mousemove', (e) => {
			const r = el.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width - 0.5;
			const y = (e.clientY - r.top) / r.height - 0.5;
			el.style.setProperty('--tiltY', (x * 6).toFixed(2) + 'deg');
			el.style.setProperty('--tiltX', (-y * 6).toFixed(2) + 'deg');
		});
		el.addEventListener('mouseleave', () => {
			el.style.setProperty('--tiltX', '0deg');
			el.style.setProperty('--tiltY', '0deg');
		});
	});
}

function words() {
	const els = document.querySelectorAll('.iab-words');
	if (!els.length) return;
	els.forEach((el) => {
		if (el.dataset.split) return;
		el.dataset.split = '1';
		const parts = el.textContent.trim().split(/\s+/);
		el.textContent = '';
		parts.forEach((w, i) => {
			const span = document.createElement('span');
			span.className = 'iab-word';
			span.textContent = w;
			span.style.transitionDelay = (i * 60) + 'ms';
			el.appendChild(span);
			if (i < parts.length - 1) { el.appendChild(document.createTextNode(' ')); } // spacja POZA inline-block
		});
	});
	if (reduce || !('IntersectionObserver' in window)) {
		els.forEach((el) => el.classList.add('is-visible'));
		return;
	}
	const io = new IntersectionObserver((ents) => {
		ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
	}, { threshold: 0.3 });
	els.forEach((el) => io.observe(el));
}

function timeline() {
	const tl = document.querySelector('.iab-timeline');
	if (!tl) return;
	const fill = tl.querySelector('.iab-timeline__fill');
	const steps = Array.from(tl.querySelectorAll('.iab-timeline__step'));
	if (reduce) { if (fill) fill.style.height = '100%'; steps.forEach((s) => s.classList.add('is-active')); return; }
	let ticking = false;
	const update = () => {
		const rect = tl.getBoundingClientRect();
		const ref = window.innerHeight * 0.55;
		const p = Math.min(Math.max((ref - rect.top) / rect.height, 0), 1);
		if (fill) fill.style.height = (p * 100).toFixed(1) + '%';
		steps.forEach((s) => {
			const m = s.querySelector('.iab-timeline__marker');
			const mid = m.getBoundingClientRect().top + m.offsetHeight / 2;
			s.classList.toggle('is-active', mid <= ref);
		});
		ticking = false;
	};
	update();
	window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
	window.addEventListener('resize', update, { passive: true });
}

function rise() {
	const els = document.querySelectorAll('.iab-rise');
	if (!els.length) return;
	if (reduce || !('IntersectionObserver' in window)) {
		els.forEach((el) => el.classList.add('is-revealed'));
		return;
	}
	const io = new IntersectionObserver((ents) => {
		ents.forEach((en) => {
			if (en.isIntersecting) { en.target.classList.add('is-revealed'); io.unobserve(en.target); }
		});
	}, { threshold: 0.18 });
	els.forEach((el) => io.observe(el));
}

function heroVideo() {
	const v = document.querySelector('.iab-hero__video');
	const hero = document.querySelector('.iab-hero--editorial');
	if (!v || !hero) return;
	let ticking = false;
	const update = () => {
		const covered = window.scrollY > hero.offsetHeight * 0.85; // sekcja zakryła hero
		if (covered) { if (!v.paused) v.pause(); } else { v.play().catch(() => {}); }
		ticking = false;
	};
	update();
	window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
}

function tocSpy() {
	const toc = document.querySelector('[data-toc]');
	if (!toc) return;
	const links = Array.from(toc.querySelectorAll('[data-toc-link]'));
	const heads = links.map((l) => document.getElementById(l.dataset.tocLink)).filter(Boolean);
	if (!heads.length) return;
	let ticking = false;
	const update = () => {
		const ref = 150; // px od góry viewportu
		let active = heads[0];
		heads.forEach((h) => { if (h.getBoundingClientRect().top <= ref) active = h; });
		links.forEach((l) => l.classList.toggle('is-active', l.dataset.tocLink === active.id));
		ticking = false;
	};
	update();
	window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
}

function bentoTilt() {
	const cards = document.querySelectorAll('.iab-bento__card');
	if (!cards.length || reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
	cards.forEach((card) => {
		let raf = 0;
		card.addEventListener('pointermove', (e) => {
			const r = card.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
			const py = (e.clientY - r.top) / r.height - 0.5;
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				card.style.transform = `perspective(1000px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-6px) scale(1.02)`;
				card.style.setProperty('--glx', `${((px + 0.5) * 100).toFixed(1)}%`);
				card.style.setProperty('--gly', `${((py + 0.5) * 100).toFixed(1)}%`);
			});
		});
		card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); card.style.transform = ''; });
	});
}

function particles() {
	if (reduce) return;
	document.querySelectorAll('[data-particles]').forEach((host) => {
		const n = Math.max(4, Math.min(20, parseInt(host.dataset.particles, 10) || 10));
		const layer = document.createElement('span');
		layer.className = 'iab-particles';
		layer.setAttribute('aria-hidden', 'true');
		for (let i = 0; i < n; i++) {
			const dot = document.createElement('i');
			const size = 4 + ((i * 3.1) % 9);
			dot.style.cssText = `left:${(i * 17.3) % 100}%;top:${(i * 29.7) % 100}%;width:${size}px;height:${size}px;animation-duration:${9 + ((i * 2.3) % 11)}s;animation-delay:${-((i * 1.7) % 9)}s`;
			layer.appendChild(dot);
		}
		host.appendChild(layer);
	});
}

export function initEffects() {
	parallax();
	heroVideo();
	tocSpy();
	tilt();
	bentoTilt();
	particles();
	words();
	rise();
	timeline();
}
