// api/_lib/auth.js
// Helper otentikasi sederhana (HTTP Basic Auth) untuk endpoint admin.
// Kredensial diset lewat env var ADMIN_USER & ADMIN_PASSWORD di Vercel.

export function requireAdminAuth(req, res) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
    res.status(500).json({
      error: "Admin belum dikonfigurasi. Set ADMIN_USER & ADMIN_PASSWORD di environment variables.",
    });
    return false;
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, encoded] = authHeader.split(" ");

  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
      return true;
    }
  }

  res.setHeader("WWW-Authenticate", 'Basic realm="Admin TfY"');
  res.status(401).json({ error: "Username atau password salah." });
  return false;
}
