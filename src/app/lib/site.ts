export const SITE_NAME = "LearnMap";

// The public address of the site, without a trailing slash.
// Set NEXT_PUBLIC_SITE_URL on Vercel; locally it defaults to localhost.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");