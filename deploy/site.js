// hifinis.com: serve the static site exactly as written (/page.html stays /page.html, so the Play
// privacy URL and every old link keep working). Only "/" needs mapping to index.html.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // One address only: https://hifinis.com (www and plain http are sent there).
    if (url.hostname === "www.hifinis.com" || url.protocol === "http:") {
      url.hostname = "hifinis.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/" || url.pathname === "") url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url.toString(), request));
  },
};
