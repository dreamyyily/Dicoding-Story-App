export function getActiveRoute() {
  return location.hash.replace('#', '') || '/';
}