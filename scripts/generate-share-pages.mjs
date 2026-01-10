import fs from "node:fs";
import path from "node:path";

// ===== EDIT THESE =====
const SITE_BASE = "https://ernestopinto.net";

// This must be the base that serves your API endpoint `/blog?...`
// If in production the API is served from the same domain, this can be SITE_BASE.
// If it’s under /luna, set it accordingly (example: `${SITE_BASE}/luna`)
const API_BASE = "https://arcadeluz.net/luna"; // or `${SITE_BASE}/luna`

// Optional: if you want theme pages too (dedupe by id)
const THEMES = [null, "World", "Arcadeluz", "Gaming"];

// Put a real file at public/og-default.jpg (or change this)
const DEFAULT_OG_IMAGE = `${SITE_BASE}/og-default.jpg`;
// ======================

const OUT_DIR = path.resolve("dist/share");

const esc = (s) =>
    String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

function isNonEmptyString(v) {
    return typeof v === "string" && v.trim().length > 0;
}

// Make ImageKit images share-friendly (1200x630)
function toOgImage1200x630(url) {
    if (!isNonEmptyString(url)) return "";
    try {
        const u = new URL(url);
        if (u.hostname.includes("imagekit.io")) {
            const required = "w-1200,h-630,c-at_max,q-90";
            const tr = u.searchParams.get("tr");
            u.searchParams.set("tr", tr ? `${tr},${required}` : required);
            return u.toString();
        }
        return url;
    } catch {
        return url;
    }
}

// Try many possible locations for a cover image URL
function pickImage(p) {
    // 1) Direct string fields (common)
    const directCandidates = [
        p.coverImage,
        p.cover_image,
        p.featuredImage,
        p.featured_image,
        p.headerImage,
        p.header_image,
        p.heroImage,
        p.hero_image,
        p.thumbnail,
        p.thumb,
        p.image,
        p.Image,
        p.mainImage,
        p.main_image,
        p.banner,
        p.banner_image,
    ];

    for (const v of directCandidates) {
        if (isNonEmptyString(v)) return v.trim();
    }

    // 2) Nested objects (common)
    const nestedCandidates = [
        p.cover?.url,
        p.cover?.src,
        p.featured?.url,
        p.featured?.src,
        p.featured_image?.url,
        p.featured_image?.src,
        p.image?.url,
        p.image?.src,
        p.thumbnail?.url,
        p.thumbnail?.src,
        p.media?.cover?.url,
        p.media?.image?.url,
        p.media?.thumbnail?.url,
        p.seo?.image,
        p.seo?.og_image,
        p.openGraph?.image,
    ];

    for (const v of nestedCandidates) {
        if (isNonEmptyString(v)) return v.trim();
    }

    // 3) Arrays
    const arrCandidates = [
        Array.isArray(p.images) ? (p.images[0]?.url || p.images[0]?.src) : null,
        Array.isArray(p.photos) ? (p.photos[0]?.url || p.photos[0]?.src) : null,
        Array.isArray(p.media) ? (p.media[0]?.url || p.media[0]?.src) : null,
    ];

    for (const v of arrCandidates) {
        if (isNonEmptyString(v)) return v.trim();
    }

    return "";
}

function pickTitle(p) {
    return (
        p.title ??
        p.Title ??
        p.name ??
        p.Name ??
        p.headline ??
        p.Headline ??
        "ernestopinto.net"
    );
}

function pickDescription(p) {
    // Prefer a short/excerpt
    const candidate =
        p.excerpt ??
        p.Excerpt ??
        p.shortDescription ??
        p.short_description ??
        p.description ??
        p.Description ??
        p.summary ??
        p.Summary ??
        "";

    const str = isNonEmptyString(candidate) ? candidate.trim() : "";
    return str || "Read the latest post on ernestopinto.net.";
}

function pickId(p) {
    const id = p.id ?? p.Id ?? p.postId ?? p.PostId ?? p.slug ?? p.Slug;
    return id != null ? String(id) : "";
}

function normalizePost(p) {
    const id = pickId(p);
    const title = pickTitle(p);
    const description = pickDescription(p);
    const image = pickImage(p);

    return { id, title, description, image };
}

function renderShareHtml({ id, title, description, image }) {
    const shareUrl = `${SITE_BASE}/share/${id}`;
    const canonical = `${SITE_BASE}/blog/${id}`;

    const ogImage = toOgImage1200x630(image) || DEFAULT_OG_IMAGE;

    return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${esc(title)} | ernestopinto.net</title>

  <link rel="canonical" href="${esc(canonical)}" />

  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${esc(shareUrl)}" />

  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />

  <meta http-equiv="refresh" content="1; url=/blog/${esc(id)}" />
</head>
<body>
  <p>Redirecting… <a href="/blog/${esc(id)}">Open the post</a></p>
</body>
</html>`;
}

async function fetchJson(url) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
}

/**
 * Expecting:
 * { error: 0, data: { data: [...], current_page: n, last_page: n } }
 */
function unwrapPayload(apiResponse) {
    if (!apiResponse || apiResponse.error !== 0) return null;
    return apiResponse.data;
}

async function fetchAllPostsFromListEndpoint() {
    const found = new Map(); // id -> post

    for (const theme of THEMES) {
        let page = 1;

        while (true) {
            const qs = new URLSearchParams({ page: String(page) });
            if (theme) qs.set("theme", theme);

            const url = `${API_BASE.replace(/\/$/, "")}/blog?${qs.toString()}`;

            const response = await fetchJson(url);
            const payload = unwrapPayload(response);

            if (!payload?.data || !Array.isArray(payload.data) || payload.data.length === 0) {
                break;
            }

            for (const raw of payload.data) {
                const post = normalizePost(raw);
                if (!post.id) continue;
                if (!found.has(post.id)) found.set(post.id, post);
            }

            const current = Number(payload.current_page ?? page);
            const last = Number(payload.last_page ?? current);

            if (current >= last) break;
            page++;
        }
    }

    return [...found.values()];
}

function writeSharePage(post) {
    const dir = path.join(OUT_DIR, post.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderShareHtml(post), "utf-8");
}

async function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const posts = await fetchAllPostsFromListEndpoint();
    if (!posts.length) {
        console.warn("⚠️ No posts found. Check API_BASE and your /blog endpoint.");
        return;
    }

    for (const post of posts) writeSharePage(post);

    console.log(`✅ Generated ${posts.length} share pages in ${OUT_DIR}`);
    console.log(`Example: ${SITE_BASE}/share/${posts[0].id}`);
    console.log(`⚠️ Ensure DEFAULT_OG_IMAGE exists at: ${DEFAULT_OG_IMAGE}`);
}

main().catch((e) => {
    console.error("❌ generate-share-pages failed:", e);
    process.exit(1);
});
