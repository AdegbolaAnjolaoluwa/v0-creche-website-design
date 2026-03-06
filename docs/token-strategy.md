
// TOKEN REPLAY RISK & ROTATION STRATEGY

/**
 * 1. Current Risk Assessment
 * - The parent JWT token has a 24-hour expiration time.
 * - Risk: If a token is stolen, an attacker has access for up to 24 hours.
 * - Mitigation: 
 *    a) HttpOnly cookies prevent XSS theft.
 *    b) Secure flag prevents Man-in-the-Middle theft (HTTPS only).
 *    c) SameSite=Strict prevents CSRF.
 * 
 * 2. Rotation & Invalidation Strategy (Future Implementation)
 * - To support forced logout or immediate revocation:
 *    a) Add a `tokenVersion` integer column to the `pupils` table.
 *    b) Include this `tokenVersion` in the JWT payload.
 *    c) On every request, fetch the pupil's current `tokenVersion` from DB (cached) and compare.
 *    d) To revoke all sessions for a user, increment their `tokenVersion` in DB.
 * 
 * 3. Replay Protection
 * - Current implementation relies on short-lived tokens (24h) and secure transport.
 * - Critical actions (like changing sensitive data) should require re-authentication or a fresh token (not applicable for read-only parent dashboard yet).
 */
