import { getTranslations } from "next-intl/server";
import { INTRO_PRE_PAINT_SCRIPT } from "@/lib/intro-gate";
import { LogoIntro } from "./LogoIntro";

/** Server side of the intro: the pre-paint gate script and the (CSS-hidden until needed) overlay. */
export async function Intro({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "intro" });
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_PRE_PAINT_SCRIPT }} />
      <LogoIntro skipLabel={t("skip")} />
    </>
  );
}
