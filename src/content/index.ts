import { runtime } from 'webextension-polyfill'
console.log("[content] loaded ");
let count = 0;
type Listener = (event: MouseEvent) => void;

function registerClickListener(listener: Listener) {
  window.addEventListener("click", listener);
}

function countClicks() {
  count++;
  console.log("click(): ", process.env.GOOGLE_CLIENT_ID);
  return runtime.sendMessage({ 
	from: 'content', 
	to: 'background', 
	action: 'click' 
  });
}

export function init() {
  registerClickListener(countClicks);
}

init();
export {};
