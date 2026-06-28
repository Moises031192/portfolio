import 'resend';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" }
});
const POST = async ({ request }) => {
  {
    console.error("RESEND_API_KEY is not set");
    return json({ error: "Servicio de email no configurado." }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
