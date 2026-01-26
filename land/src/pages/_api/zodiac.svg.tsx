export async function GET(request: Request): Promise<Response> {
  const mod = await import.meta.viteRsc.import<
    typeof import("../../components/zodiac.tsx")
  >("../../components/zodiac.tsx", { environment: "ssr" });
  return mod.render();
}
