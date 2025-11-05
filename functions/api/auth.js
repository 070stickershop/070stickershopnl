// functions/api/auth.js
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const client_id = context.env.GITHUB_CLIENT_ID;
  const client_secret = context.env.GITHUB_CLIENT_SECRET;

  // Start OAuth: redirect naar GitHub
  if (path.endsWith("/api/auth") || path.endsWith("/api/auth/")) {
    const redirect = new URL("https://github.com/login/oauth/authorize");
    redirect.searchParams.set("client_id", client_id);
    redirect.searchParams.set("scope", "repo");
    redirect.searchParams.set("redirect_uri", `${url.origin}/api/auth/callback`);
    return Response.redirect(redirect.toString(), 302);
  }

  // Callback: code -> access_token
  if (path.endsWith("/api/auth/callback")) {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) {
      return new Response(JSON.stringify(tokenJson), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

// Token zonder geneste template strings
const tokenLiteral = JSON.stringify(tokenJson.access_token);
const html =
  "<!doctype html><html><body><script>" +
  "(function(){" +
  "var token = " + tokenLiteral + ";" +
  "if (window.opener) {" +
  "window.opener.postMessage('authorization:github:success:' + token, '*');" +
  "window.close();" +
  "} else {" +
  "document.body.textContent = 'Login gelukt. Je kunt dit venster sluiten.';" +
  "}" +
  "})();" +
  "</script></body></html>";

return new Response(html, { headers: { "Content-Type": "text/html" } });
