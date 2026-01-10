import fs from "node:fs";
import path from "node:path";

// ✅ EDIT THESE 2
const SITE_BASE = "https://ernestopinto.net";       // your public site
const API_BASE = "https://arcadeluz.net/luna";      // <-- CHANGE to your API base OR keep empty if same origin

const OUT_DIR = path.resolve("public/share");

// If you want to generate for specific themes too, list them here.
// If you don’t, keep as [null]
const THEMES = [null, "World", "Arcadeluz", "Gaming"];

// ---- helpers ----
const esc = (s) =>
    String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

function toOgImage1200x630(url) {
    if (!url) return "";
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

function renderShareHtml({ id, title, description, image }) {
    const shareUrl = `${SITE_BASE}/share/${id}`;
    const canonical = `${SITE_BASE}/blog/${id}`;
    const ogImage = toOgImage1200x630(image);

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
 * Your API response shape (based on your code):
 * response = { error: 0, data: payload }
 * payload = { data: posts[], last_page, current_page }
 */
function unwrapPostsList(apiResponse) {
    if (!apiResponse || apiResponse.error !== 0) return null;
    return apiResponse.data;
}

function normalizePost(p) {
    // ADAPT these keys to your actual BlogPostDTO
    const id = p.id ?? p.Id ?? p.postId ?? p.PostId;
    const title = p.title ?? p.Title ?? "ernestopinto.net";
    const description =
        p.shortDescription ??
        p.excerpt ??
        p.description ??
        p.Description ??
        "Read the latest post on ernestopinto.net.";

    // pick a cover image field you have (adjust)
    const image =
        p.coverImage ??
        p.image ??
        p.Image ??
        p.thumbnail ??
        p.heroImage ??
        "";

    return {
        id: String(id),
        title,
        description,
        image,
    };
}

async function fetchAllPosts() {
    const all = new Map(); // dedupe by id

    for (const theme of THEMES) {
        let page = 1;
        while (true) {
            const qs = new URLSearchParams({ page: String(page) });
            if (theme) qs.set("theme", theme);

            // If your endpoint is exactly "/blog", this becomes:
            // `${API_BASE}/blog?page=1&theme=World`
            const url = `${API_BASE.replace(/\/$/, "")}/blog?${qs.toString()}`;

            const response = await fetchJson(url);
            const payload = unwrapPostsList(response);

            if (!payload?.data || !Array.isArray(payload.data)) break;

            for (const p of payload.data) {
                const post = normalizePost(p);
                if (post.id && !all.has(post.id)) all.set(post.id, post);
            }

            const current = Number(payload.current_page ?? page);
            const last = Number(payload.last_page ?? current);
            if (current >= last) break;

            page++;
        }
    }

    return [...all.values()];
}

function writeSharePage(post) {
    const dir = path.join(OUT_DIR, post.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderShareHtml(post), "utf-8");
}

async function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const posts = await fetchAllPosts();
    if (!posts.length) {
        console.warn("⚠️ No posts found. Did you set API_BASE correctly?");
        return;
    }

    for (const post of posts) writeSharePage(post);

    console.log(`✅ Generated ${posts.length} share pages in ${OUT_DIR}`);
    console.log(`Example: ${SITE_BASE}/share/${posts[0].id}`);
}

main().catch((e) => {
    console.error("❌ generate-share-pages failed:", e);
    process.exit(1);
});
