self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("app-cache").then(cache => {
            return cache.addAll([
                "login.html",
                "student.html",
                "hod.html",
                "style.css",
                "script.js"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});