// Service worker for GRIP.
//
// Strategy: precache the app shell + all static assets at install time using
// the asset manifest that SvelteKit generates for us (build from
// $service-worker). Because every asset lives in the SPA shell or static/,
// the entire app is reachable offline once install succeeds.
//
// An SPA without a server must always have a fallback: the `200.html` shell
// is served for any navigation request that misses the cache.

import { build, files, version } from '$service-worker';

// In dev the SvelteKit dev server serves this SW with a *fixed* `version`
// constant and `build = []`, so a cache-first strategy would keep serving the
// first-cached shell forever — the preview would never show code changes.
// Only enable offline caching for production builds; in dev, take over and
// pass everything through to the network.
if (!import.meta.env.DEV) {
	const CACHE_NAME = `grip-${version}`;

	const ASSETS = [
		...build,
		...files.filter((f) => f !== '/robots.txt'),
		'/'
	];

	// Everything the app needs on first paint. `cache.addAll` fails atomically if
	// a single request 4xx/5xxs, so cache each asset individually and let the
	// install complete regardless.
	self.addEventListener('install', (event) => {
		event.waitUntil(
			caches
				.open(CACHE_NAME)
				.then((cache) =>
					Promise.all(
						ASSETS.map((asset) =>
							cache.add(asset).catch(() => {
								/* tolerate offline/unavailable assets during install */
							})
						)
					)
				)
				.then(() => self.skipWaiting())
		);
	});

	// New SW (new build) takes over immediately; old cache is dropped afterwards.
	self.addEventListener('activate', (event) => {
		event.waitUntil(
			caches
				.keys()
				.then((keys) =>
					Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
				)
				.then(() => self.clients.claim())
		);
	});

	self.addEventListener('fetch', (event) => {
		const { request } = event;
		const url = new URL(request.url);
		if (url.origin !== self.location.origin) return;

		if (request.mode === 'navigate') {
			// Always serve the app shell so routes keep working offline. The shell
			// is `/` (the adapter-static fallback is served at the root), so match
			// the cached root response; fall back to the network.
			event.respondWith(
				caches.match('/').then((response) => response || fetch(request))
			);
			return;
		}

		// Cache-first for same-origin GETs.
		if (request.method === 'GET') {
			event.respondWith(
				caches.match(request).then((cached) => {
					if (cached) return cached;
					return fetch(request).then((response) => {
						if (response.ok) {
							const clone = response.clone();
							caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
						}
						return response;
					});
				})
			);
		}
	});
} else {
	// Dev: never serve from cache — the preview must always reflect the latest
	// code. Take over immediately, drop any stale caches from earlier runs, and
	// let every request go straight to the network.
	self.addEventListener('install', () => {
		self.skipWaiting();
	});

	self.addEventListener('activate', (event) => {
		event.waitUntil(
			caches
				.keys()
				.then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
				.then(() => self.clients.claim())
		);
	});
}
