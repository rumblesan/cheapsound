/* eslint-disable no-console */
export function info(msg) {
  const t = new Date().toISOString();
  console.log(`${t}: ${msg}`);
}

export function error(msg) {
  const t = new Date().toISOString();
  console.error(`${t}: ERROR - ${msg}`);
}

export function print(msg) {
  console.log(msg);
}
