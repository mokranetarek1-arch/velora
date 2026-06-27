import { useEffect } from "react";

const SITE_NAME = "Velora";
const SITE_URL = "https://www.velora.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/ICONe.png`;

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  path = "/",
  keywords,
  noindex = false,
  image = DEFAULT_OG_IMAGE,
  jsonLd,
}) {
  useEffect(() => {
    const canonicalUrl = new URL(path, SITE_URL).toString();
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" });

    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    }

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

    upsertLink("canonical", canonicalUrl);

    const existingScript = document.getElementById("seo-json-ld");
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-json-ld";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [description, image, jsonLd, keywords, noindex, path, title]);

  return null;
}
