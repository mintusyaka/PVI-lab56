const staticCacheName = 's-app-v2'
const dynamicCacheName = 'd-app-v1'

const assetUrls = [
    'index.html',
    'scripts/script.js',
    'scripts/modal-add-edit.js',
    'handle-data.php',
    'styles/modal-style.css',
    'styles/notifications-dropdown.css',
    'styles/profile-dropdown.css',
    'styles/smartphone-style.css' 
]

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName)
    await cache.addAll(assetUrls)
    // console.log("[SW]: install");
    // event.waitUntil(
    //     caches.open(staticCacheName).then(cache => cache.addAll(assetUrls))
    // )
})

self.addEventListener('activate', async event=>{
    const cacheNames = await caches.keys()
    await Promise.all(
        cacheNames
        .filter(name => name !== staticCacheName)
        .filter(name => name !== dynamicCacheName)
        .map(name => caches.delete(name))
    )
    // console.log("[SW]: activate");
})

self.addEventListener('fetch', event=>{
    const {request} = event

    const url = new URL(request.url)
    if(url.origin === location.origin) {
        event.respondWith(cacheFirst(event.request))
    } else {
        event.respondWith(networkFirst(event.request))
    }

})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    return cached ?? await fetch(request)
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request)
        await cache.put(request, response.clone())
        return response
    } catch(e) {
        const cached = await cache.match(request);
        return cached ?? caches.match('index.html')
    }
}

// const staticCacheName = 's-app-v3'
// const dynamicCacheName = 'd-app-v3'

// const assetUrls = [
//   'index.html',
//   '/scripts/script.js',
//   '/img/avatar.png',
//   '/img/notifications2.png',
//   '/scripts/modal-add-edit.js',
//   '/styles/smartphone-style.css',
//   '/styles/notifications-dropdown.css',
//   '/styles/profile-dropdown.css',
//   '/styles/modal-style.css'
// ]

// self.addEventListener('install', async event => {
//   const cache = await caches.open(staticCacheName)
//   await cache.addAll(assetUrls)
// })

// self.addEventListener('activate', async event => {
//   const cacheNames = await caches.keys()
//   await Promise.all(
//     cacheNames
//       .filter(name => name !== staticCacheName)
//       .filter(name => name !== dynamicCacheName)
//       .map(name => caches.delete(name))
//   )
// })

// self.addEventListener('fetch', event => {
//   const {request} = event

//   const url = new URL(request.url)
//   if (url.origin === location.origin) {
//     event.respondWith(cacheFirst(request))
//   } else {
//     event.respondWith(networkFirst(request))
//   }
// })


// async function cacheFirst(request) {
//   const cached = await caches.match(request)
//   return cached ?? await fetch(request)
// }

// async function networkFirst(request) {
//   const cache = await caches.open(dynamicCacheName)
//   try {
//     const response = await fetch(request)
//     await cache.put(request, response.clone())
//     return response
//   } catch (e) {
//     const cached = await cache.match(request)
//     return cached ?? await caches.match('/index.html')
//   }
// }