import { site } from "@/content/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Rotas de serviço não têm o que indexar e só gastariam orçamento de rastreio.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.urlSite}/sitemap.xml`,
    host: site.urlSite,
  };
}
