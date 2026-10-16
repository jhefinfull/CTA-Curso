import { Nunito_Sans, Sora } from "next/font/google";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/bold";
import "@phosphor-icons/web/fill";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { site } from "@/content/site";
import { buscarVitrine, contarPorModalidade } from "@/lib/vitrine";
import { MODALIDADES } from "@/config/tiposCurso";
import { listarAreas } from "@/config/areas";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.urlSite),
  title: {
    default: `${site.nomeCompleto} — ${site.slogan}`,
    template: `%s | ${site.nome}`,
  },
  description:
    "CTA Boa Vista Cursos: graduação, cursos técnicos, pós-graduação, EJA, cursos livres online e cursos presenciais no Centro de Boa Vista/RR, com parceiras como UNIP, FAMAR e Unicorp.",
  keywords: [
    "cta boa vista",
    "cursos em boa vista",
    "cursos técnicos boa vista",
    "graduação ead roraima",
    "pós-graduação ead",
    "eja ead ensino médio",
    "cursos profissionalizantes boa vista",
    "cursos livres online",
    "unicorp",
    "famar",
  ],
  authors: [{ name: site.nomeLegal }],
  creator: site.nomeLegal,
  publisher: site.nomeLegal,
  applicationName: site.nome,
  category: "education",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.urlSite,
    siteName: site.nomeCompleto,
    title: `${site.nomeCompleto} — ${site.slogan}`,
    description:
      "Do EJA à pós-graduação: cursos presenciais no Centro de Boa Vista e EAD, com instituições parceiras reconhecidas nacionalmente.",
    images: [{ url: "/imagens/site/og-image.jpg", width: 1200, height: 630, alt: site.nomeCompleto }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nomeCompleto} — ${site.slogan}`,
    description:
      "Do EJA à pós-graduação: cursos presenciais no Centro de Boa Vista e EAD, com instituições parceiras reconhecidas nacionalmente.",
    images: ["/imagens/site/og-image.jpg"],
  },
  alternates: { canonical: site.urlSite },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/imagens/site/marca.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport = {
  themeColor: "#00467A",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

/** Dados estruturados da instituição — vale para o site inteiro, então vivem no layout. */
function dadosEstruturados() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.nomeLegal,
    alternateName: site.nome,
    url: site.urlSite,
    logo: `${site.urlSite}/imagens/site/logo_cor.png`,
    description:
      "Escola de cursos em Boa Vista/RR: graduação, técnicos, pós-graduação, EJA, cursos livres online e cursos presenciais, com instituições parceiras.",
    email: site.email,
    telephone: `+${site.whatsapp}`,
    taxID: site.cnpj,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.endereco.linha,
      addressLocality: "Boa Vista",
      addressRegion: "RR",
      postalCode: site.endereco.cep,
      addressCountry: "BR",
    },
    sameAs: [site.redes.instagram, site.redes.facebook],
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

export default async function RootLayout({ children }) {
  // Uma chamada só alimenta o menu e o rodapé com as áreas e as modalidades reais.
  // API fora do ar ou loja vazia → as listas chegam vazias e o menu se adapta sozinho.
  const { facetas } = await buscarVitrine();
  const areas = listarAreas(facetas?.categorias);
  const totais = contarPorModalidade(MODALIDADES, facetas?.tipos);

  return (
    <html lang="pt-BR" className={`${nunito.variable} ${sora.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados()) }}
        />

        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>

        <Header areas={areas} totais={totais} />
        <main id="conteudo">{children}</main>
        <Footer areas={areas} totais={totais} />
        <WhatsAppButton />
      </body>
    </html>
  );
}
