/**
 * Application Configuration
 * 
 * VITE_API_URL should be set in environment variables for production.
 * - Local Development: "" (uses Vite proxy to localhost:3000)
 * - Vercel Production: "https://your-backend.onrender.com"
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
