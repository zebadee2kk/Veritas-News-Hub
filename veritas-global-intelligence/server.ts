import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import "dotenv/config";
import { saveArticle, saveReport, getHistory, getReportsForArticle, getStats } from "./src/services/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // CORS — allow the Cloudflare Pages frontend
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  app.use(express.json());

  // API Proxy for NewsAPI (to avoid CORS and hide key)
  app.get("/api/news", async (req, res) => {
    const apiKey = process.env.NEWS_API_KEY;
    const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'MISSING';
    console.log(`Incoming news request. API Key: ${maskedKey}`);
    
    const { q, country, category, pageSize = 20 } = req.query;
    console.log(`News request parameters: q=${q}, country=${country}, category=${category}, pageSize=${pageSize}`);

    // If key is missing or invalid, provide sample data instead of 401
    // This allows the app to load and show the UI even without all keys configured
    const isInvalidKey = !apiKey || apiKey.includes('MY_NEWS_API_KEY') || apiKey.includes('YOUR_NEWS_API_KEY') || apiKey.length < 10;

    if (isInvalidKey) {
      console.warn("NEWS_API_KEY not configured correctly. Providing sample intelligence data.");
      return res.json({
        status: 'ok',
        totalResults: 6,
        articles: [
          {
            source: { id: 'intel-1', name: 'Global Intelligence' },
            author: 'Strategic Command',
            title: 'Anomalous Signal Detected in Northern Pacific',
            description: 'Unidentified underwater acoustic signatures detected near the Aleutian Islands. Intelligence agencies are monitoring for potential undersea infrastructure interference.',
            url: '#',
            urlToImage: 'https://picsum.photos/seed/ocean/800/400',
            publishedAt: new Date().toISOString(),
            content: 'Strategic Command has deployed reconnaissance assets to the region.',
            location: { lat: 52.0, lng: 175.0, name: 'Aleutian Islands' }
          },
          {
            source: { id: 'intel-2', name: 'Cyber Watch' },
            author: 'Cyber Security Division',
            title: 'Major Financial Infrastructure Targeted in Zero-Day Campaign',
            description: 'Coordinated cyber-attacks targeting SWIFT nodes across Southeast Asia. Attribution points to state-sponsored actors using advanced obfuscation techniques.',
            url: '#',
            urlToImage: 'https://picsum.photos/seed/cyber/800/400',
            publishedAt: new Date().toISOString(),
            content: 'Financial institutions are advised to escalate to high-alert status.',
            location: { lat: 1.35, lng: 103.8, name: 'Singapore' }
          },
          {
            source: { id: 'intel-3', name: 'Tech Sentinel' },
            author: 'Emerging Tech Desk',
            title: 'Quantum Computing Breakthrough Reported in Zurich',
            description: 'Researchers achieve stable 1000-qubit coherence at room temperature. Potential implications for current encryption standards are being evaluated by security experts.',
            url: '#',
            urlToImage: 'https://picsum.photos/seed/quantum/800/400',
            publishedAt: new Date().toISOString(),
            content: 'The breakthrough could render RSA encryption obsolete within the decade.',
            location: { lat: 47.37, lng: 8.54, name: 'Zurich, Switzerland' }
          },
          {
            source: { id: 'intel-4', name: 'Space Command' },
            author: 'Orbital Surveillance',
            title: 'Unidentified Satellite Maneuver in Geosynchronous Orbit',
            description: 'A decommissioned satellite has performed a high-energy orbital adjustment, approaching a critical telecommunications node. Collision risk is currently being calculated.',
            url: '#',
            urlToImage: 'https://picsum.photos/seed/space/800/400',
            publishedAt: new Date().toISOString(),
            content: 'Orbital debris tracking has been intensified.',
            location: { lat: 0, lng: 0, name: 'Geosynchronous Orbit' }
          },
          {
            source: { id: 'intel-5', name: 'Energy Watch' },
            author: 'Resource Security',
            title: 'Critical Rare Earth Mineral Discovery in Greenland',
            description: 'Extensive deposits of Neodymium and Dysprosium discovered in previously inaccessible glacial regions. Geopolitical tensions expected to rise over extraction rights.',
            url: '#',
            urlToImage: 'https://picsum.photos/seed/arctic/800/400',
            publishedAt: new Date().toISOString(),
            content: 'Mining consortiums are already filing claims.',
            location: { lat: 74.7, lng: -41.6, name: 'Greenland' }
          },
          {
            source: { id: 'intel-6', name: 'Bio-Security' },
            author: 'Health Intelligence',
            title: 'Novel Pathogen Surveillance in Amazon Basin',
            description: 'Unusual cluster of respiratory illnesses reported in remote communities. Early sequencing suggests a previously unknown viral strain with high zoonotic potential.',
            url: '#',
            urlToImage: 'https://picsum.photos/seed/jungle/800/400',
            publishedAt: new Date().toISOString(),
            content: 'Field hospitals are being established.',
            location: { lat: -3.46, lng: -62.2, name: 'Amazon Basin' }
          }
        ]
      });
    }

    try {
      const categories = ['technology', 'science', 'business', 'general'];
      const searchTerms = ['global', 'intelligence', 'security', 'anomalous', 'cyber'];
      
      let url = '';
      if (q || country || category) {
        url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&pageSize=${pageSize}`;
        if (q) url += `&q=${encodeURIComponent(q as string)}`;
        if (country) url += `&country=${country}`;
        if (category) url += `&category=${category}`;
      } else {
        // Fetch a broader set of news by default
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        url = `https://newsapi.org/v2/everything?q=${randomTerm}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=publishedAt&language=en`;
      }

      console.log(`Fetching from NewsAPI: ${url.replace(apiKey, 'REDACTED')}`);
      
      // Use global fetch if available (Node 18+), otherwise fallback to node-fetch
      const fetchFn = (globalThis as any).fetch || fetch;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        console.warn(`NewsAPI request timed out after 8s for URL: ${url.replace(apiKey, 'REDACTED')}`);
        controller.abort();
      }, 8000); // 8s timeout for NewsAPI
      
      const startTime = Date.now();
      const response = await fetchFn(url, {
        headers: {
          "User-Agent": "Veritas-Intelligence-Platform/1.0"
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      console.log(`NewsAPI response received in ${duration}ms. Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP ${response.status}: ${await response.text()}` };
        }
        console.error("NewsAPI returned error:", errorData);
        return res.status(response.status).json({
          status: 'error',
          error: errorData.message || `NewsAPI returned ${response.status}`,
          code: errorData.code || 'unknown'
        });
      }

      const data = await response.json();
      console.log("NewsAPI success:", data.status, data.totalResults);

      // Persist articles to DB so we build history over time
      if (data.status === "ok" && Array.isArray(data.articles)) {
        for (const article of data.articles) {
          try { saveArticle(article); } catch { /* non-fatal */ }
        }
      }

      res.json(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      res.status(500).json({ status: 'error', error: "Internal server error fetching news" });
    }
  });

  // API Proxy for Twitter/X (Optional)
  app.get("/api/social", async (req, res) => {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const { q } = req.query;
    console.log(`Incoming social request for query: ${q}`);

    if (!bearerToken || bearerToken === 'MY_TWITTER_BEARER_TOKEN') {
      console.warn("Twitter API not configured. Skipping social fetch.");
      return res.status(404).json({ error: "Twitter API not configured" });
    }

    try {
      const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(q as string)}&tweet.fields=created_at,public_metrics`;
      console.log(`Fetching from Twitter API: ${url}`);
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${bearerToken}`
        }
      });
      console.log(`Twitter API response status: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch social data:", error);
      res.status(500).json({ error: "Failed to fetch social data" });
    }
  });

  // -------------------------------------------------------------------------
  // History / DB endpoints
  // -------------------------------------------------------------------------

  // POST /api/reports — client saves an intelligence report after analysis
  app.post("/api/reports", (req, res) => {
    const { articleUrl, report, model } = req.body;
    if (!articleUrl || typeof articleUrl !== "string" || !report || typeof report !== "object") {
      return res.status(400).json({ error: "articleUrl (string) and report (object) are required" });
    }
    const allowedModels = ["gemini", "grok"];
    const safeModel = allowedModels.includes(model) ? model : "gemini";
    try {
      saveReport(articleUrl, report, safeModel);
      res.json({ ok: true });
    } catch (err) {
      console.error("Failed to save report:", err);
      res.status(500).json({ error: "Failed to save report" });
    }
  });

  // GET /api/history?limit=50&offset=0 — paginated history of all analysed articles
  app.get("/api/history", (req, res) => {
    const limit = parseInt((req.query.limit as string) || "50", 10);
    const offset = parseInt((req.query.offset as string) || "0", 10);
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: "limit and offset must be numbers" });
    }
    try {
      const rows = getHistory(limit, offset);
      res.json({ ok: true, data: rows });
    } catch (err) {
      console.error("Failed to fetch history:", err);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // GET /api/history/:encodedUrl — reports for a specific article
  app.get("/api/history/:encodedUrl", (req, res) => {
    const articleUrl = decodeURIComponent(req.params.encodedUrl);
    try {
      const rows = getReportsForArticle(articleUrl);
      res.json({ ok: true, data: rows });
    } catch (err) {
      console.error("Failed to fetch article history:", err);
      res.status(500).json({ error: "Failed to fetch article history" });
    }
  });

  // GET /api/stats — aggregate DB stats
  app.get("/api/stats", (_req, res) => {
    try {
      res.json({ ok: true, data: getStats() });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // GET /api/health — health check used by CI
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, status: "healthy" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
