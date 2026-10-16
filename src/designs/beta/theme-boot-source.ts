import { THEMES, STORAGE_KEY } from './theme';

const names = Object.keys(THEMES) as Array<keyof typeof THEMES>;
const nameSet = JSON.stringify(names);
const colors = JSON.stringify(
	Object.fromEntries(names.map((name) => [name, THEMES[name].themeColor])),
);

export const THEME_BOOT_SOURCE = `(function(){var k=${JSON.stringify(STORAGE_KEY)};var ok=${nameSet};var colors=${colors};var name;try{name=localStorage.getItem(k)}catch(e){name=null}if(ok.indexOf(name)<0){name=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"light":(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"dark"}var html=document.documentElement;html.setAttribute("data-theme",name);html.style.colorScheme=name;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",colors[name])})();`;
