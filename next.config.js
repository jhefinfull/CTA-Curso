/** @type {import('next').NextConfig} */

const dadosCta = require("./src/content/cursosCta.json");

// A vitrine de cursos e a matrícula moram no AcadGSD (cta-cursos.acadgsd.com), então o CSP
// libera esse endereço: as capas dos cursos vêm de lá e o botão de matrícula leva para lá.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://cta-cursos.acadgsd.com https://acadgsd.com",
  "frame-src 'self' https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

// Endereços de curso do site antigo (WordPress, /cursos/<slug>/) → página nova. Os cursos
// trazidos de lá vão para /curso-cta/<slug>; os que já estão na loja, para a modalidade.
const cursosAntigos = [
  ...dadosCta.cursos.map((c) => ({ source: `/cursos/${c.wpSlug}`, destination: `/curso-cta/${c.slug}` })),
  ...Object.entries(dadosCta.redirecionarParaLoja).map(([slug, destino]) => ({
    source: `/cursos/${slug}`,
    destination: destino,
  })),
].map((r) => ({ ...r, permanent: true }));

const nextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      { protocol: "https", hostname: "*.acadgsd.com", pathname: "/**" },
      { protocol: "https", hostname: "acadgsd.com", pathname: "/**" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      // Páginas do site antigo que já circulam por aí (menu, Google, WhatsApp).
      { source: "/sobre-nos", destination: "/quem-somos", permanent: true },
      { source: "/fale-conosco", destination: "/contato", permanent: true },
      { source: "/inscricoes", destination: "/cursos", permanent: true },
      { source: "/todos-os-cursos", destination: "/cursos", permanent: true },
      { source: "/todos-os-cursos/:rest*", destination: "/cursos", permanent: true },
      { source: "/politicas-de-privacidade", destination: "/politica-privacidade", permanent: true },
      { source: "/termos-de-uso", destination: "/politica-privacidade", permanent: true },
      ...cursosAntigos,
    ];
  },
};

module.exports = nextConfig;
