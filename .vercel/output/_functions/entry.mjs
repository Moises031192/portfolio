import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_A5UzkJg0.mjs';
import { manifest } from './manifest_B-omoUFE.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/401.astro.mjs');
const _page2 = () => import('./pages/404.astro.mjs');
const _page3 = () => import('./pages/akra-restaurante.astro.mjs');
const _page4 = () => import('./pages/api/contact.astro.mjs');
const _page5 = () => import('./pages/basica-co.astro.mjs');
const _page6 = () => import('./pages/contacto.astro.mjs');
const _page7 = () => import('./pages/estudioarquo.astro.mjs');
const _page8 = () => import('./pages/huntingtallares.astro.mjs');
const _page9 = () => import('./pages/lulas-lulas.astro.mjs');
const _page10 = () => import('./pages/proyectos.astro.mjs');
const _page11 = () => import('./pages/sobre-mi.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/401.astro", _page1],
    ["src/pages/404.astro", _page2],
    ["src/pages/akra-restaurante.astro", _page3],
    ["src/pages/api/contact.ts", _page4],
    ["src/pages/basica-co.astro", _page5],
    ["src/pages/contacto.astro", _page6],
    ["src/pages/estudioarquo.astro", _page7],
    ["src/pages/huntingtallares.astro", _page8],
    ["src/pages/lulas-lulas.astro", _page9],
    ["src/pages/proyectos.astro", _page10],
    ["src/pages/sobre-mi.astro", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "8ec16aaa-9302-42a0-b96b-cfd309c7c41a",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
