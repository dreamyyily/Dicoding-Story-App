export function initRouter(callback) {
  if (!document.startViewTransition) {
    window.navigate = (hash) => { window.location.hash = hash; };
    return;
  }

  let currentTransition;
  window.navigate = (hash) => {
    if (currentTransition) return;
    currentTransition = document.startViewTransition(() => {
      window.location.hash = hash;
    });
    currentTransition.finished.finally(() => currentTransition = null);
  };
}