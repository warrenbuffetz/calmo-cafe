import type { MetadataRoute } from "next";

/** Pre-launch: block crawlers until the official domain goes live. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
