export const APP_PORT = 55577;

export function isProduction() {
  return String(APP_PORT).includes('66');
}
