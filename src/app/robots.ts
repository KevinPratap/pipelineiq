import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/", "/pipeline/", "/analytics/", "/settings/"] },
    sitemap: "https://web-production-4f2d8.up.railway.app/sitemap.xml",
  }
}
