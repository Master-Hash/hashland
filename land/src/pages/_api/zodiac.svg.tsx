export async function GET(request: Request): Promise<Response> {
  const mod = await import.meta.viteRsc.loadModule("ssr", "zodiac-module");
  return mod.render();
}
