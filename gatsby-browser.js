// Force unregister stale service worker from old PWA cache
export const onClientEntry = () => {
  if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    if ('caches' in window) {
      caches.keys().then(keys => {
        for (let key of keys) {
          caches.delete(key);
        }
      });
    }
  }
};
