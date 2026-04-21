const CACHE_NAME = 'form-cache-v1';
const urlsToCache = [
  './service-work.html',
  './sw.js'
];

// 安装阶段：缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//  fetch 阶段：缓存优先策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，返回缓存
        if (response) {
          return response;
        }
        // 否则网络请求
        return fetch(event.request);
      })
  );
});

// 注意：Service Worker 无法在页面完全关闭后直接操作 DOM 或弹出 alert。
// 如果需要“关闭5s后通知”，通常需要使用 Push API (需要后端支持) 或 Background Sync。
// 下面的代码是一个示例，展示如何监听消息，但不能主动在页面关闭后触发 UI。
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});