/**
 * Veritas SQLite Database Service
 *
 * Persists articles and intelligence reports to build history over time.
 * DB file: ./data/veritas.db (relative to CWD, i.e. project root on the VPS)
 *
 * Tables:
 *   articles          — raw news articles ingested from NewsAPI
 *   intelligence_reports — AI analysis results linked to an article URL
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { NewsArticle, IntelligenceReport } from "../types.js";

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "veritas.db");

// Ensure ./data directory exists before opening the DB
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---------------------------------------------------------------------------
// Schema bootstrap
// ---------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    url           TEXT PRIMARY KEY,
    source_id     TEXT,
    source_name   TEXT NOT NULL,
    author        TEXT,
    title         TEXT NOT NULL,
    description   TEXT,
    url_to_image  TEXT,
    published_at  TEXT NOT NULL,
    content       TEXT,
    location_lat  REAL,
    location_lng  REAL,
    location_name TEXT,
    first_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );

  CREATE TABLE IF NOT EXISTS intelligence_reports (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    article_url     TEXT NOT NULL REFERENCES articles(url) ON DELETE CASCADE,
    model           TEXT NOT NULL DEFAULT 'gemini',
    credibility     INTEGER NOT NULL,
    bot_likelihood  INTEGER NOT NULL,
    sentiment       TEXT NOT NULL,
    truth_index     INTEGER NOT NULL,
    truth_score     INTEGER,
    risk_score      INTEGER,
    confidence_score INTEGER,
    summary         TEXT NOT NULL,
    reasoning       TEXT NOT NULL,
    explainability  TEXT,
    analyzed_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );

  CREATE INDEX IF NOT EXISTS idx_reports_article   ON intelligence_reports(article_url);
  CREATE INDEX IF NOT EXISTS idx_reports_analyzed  ON intelligence_reports(analyzed_at);
  CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
`);

// ---------------------------------------------------------------------------
// Prepared statements
// ---------------------------------------------------------------------------

const insertArticle = db.prepare(`
  INSERT OR IGNORE INTO articles
    (url, source_id, source_name, author, title, description,
     url_to_image, published_at, content,
     location_lat, location_lng, location_name)
  VALUES
    (@url, @source_id, @source_name, @author, @title, @description,
     @url_to_image, @published_at, @content,
     @location_lat, @location_lng, @location_name)
`);

const insertReport = db.prepare(`
  INSERT INTO intelligence_reports
    (article_url, model, credibility, bot_likelihood, sentiment,
     truth_index, truth_score, risk_score, confidence_score,
     summary, reasoning, explainability)
  VALUES
    (@article_url, @model, @credibility, @bot_likelihood, @sentiment,
     @truth_index, @truth_score, @risk_score, @confidence_score,
     @summary, @reasoning, @explainability)
`);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Persist a raw article (idempotent — ignores duplicate URLs).
 */
export function saveArticle(article: NewsArticle): void {
  insertArticle.run({
    url: article.url,
    source_id: article.source.id ?? null,
    source_name: article.source.name,
    author: article.author ?? null,
    title: article.title,
    description: article.description ?? null,
    url_to_image: article.urlToImage ?? null,
    published_at: article.publishedAt,
    content: article.content ?? null,
    location_lat: article.location?.lat ?? null,
    location_lng: article.location?.lng ?? null,
    location_name: article.location?.name ?? null,
  });
}

/**
 * Persist an intelligence report for a given article URL.
 * @param articleUrl  URL of the article this report belongs to
 * @param report      The IntelligenceReport returned by AI analysis
 * @param model       Which model produced this report ('gemini' | 'grok')
 */
export function saveReport(
  articleUrl: string,
  report: IntelligenceReport,
  model: "gemini" | "grok" = "gemini"
): void {
  insertReport.run({
    article_url: articleUrl,
    model,
    credibility: report.credibilityScore,
    bot_likelihood: report.botLikelihood,
    sentiment: report.sentiment,
    truth_index: report.truthIndex,
    truth_score: report.truthScore ?? null,
    risk_score: report.riskScore ?? null,
    confidence_score: report.confidenceScore ?? null,
    summary: report.summary,
    reasoning: report.reasoning,
    explainability: report.explainability
      ? JSON.stringify(report.explainability)
      : null,
  });
}

/**
 * Fetch paginated history records — most recent first.
 * @param limit   Max rows to return (default 50, max 200)
 * @param offset  Pagination offset
 */
export function getHistory(
  limit = 50,
  offset = 0
): Array<Record<string, unknown>> {
  const safeLimit = Math.min(Math.max(1, limit), 200);
  const safeOffset = Math.max(0, offset);

  return db
    .prepare(
      `SELECT
        a.url, a.source_name, a.author, a.title, a.description,
        a.url_to_image, a.published_at, a.location_name,
        r.model, r.credibility, r.bot_likelihood, r.sentiment,
        r.truth_index, r.truth_score, r.risk_score, r.confidence_score,
        r.summary, r.reasoning, r.explainability, r.analyzed_at
       FROM intelligence_reports r
       JOIN articles a ON a.url = r.article_url
       ORDER BY r.analyzed_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(safeLimit, safeOffset) as Array<Record<string, unknown>>;
}

/**
 * Fetch all stored reports for a specific article URL.
 */
export function getReportsForArticle(
  articleUrl: string
): Array<Record<string, unknown>> {
  return db
    .prepare(
      `SELECT * FROM intelligence_reports
       WHERE article_url = ?
       ORDER BY analyzed_at DESC`
    )
    .all(articleUrl) as Array<Record<string, unknown>>;
}

/**
 * Basic stats: total articles seen, total reports, avg truth index.
 */
export function getStats(): Record<string, number> {
  const stats = db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM articles)            AS total_articles,
        (SELECT COUNT(*) FROM intelligence_reports) AS total_reports,
        COALESCE(
          (SELECT ROUND(AVG(truth_index), 1) FROM intelligence_reports), 0
        )                                           AS avg_truth_index`
    )
    .get() as Record<string, number>;
  return stats;
}

export default db;
