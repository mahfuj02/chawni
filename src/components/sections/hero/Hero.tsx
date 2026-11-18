import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { heroSlides } from "@/content/hero";
import { STATUS_KEY } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { getBlur } from "@/lib/blur";
import { getContentSource } from "@/lib/content-source";
import { heroCaption } from "@/lib/hero-caption";
import { buttonStyles } from "@/components/ui/Button";
import { HeroSlideshow, type HeroCaption } from "./HeroSlideshow";

const rise = (delay: number) => ({ "--d": `${delay}s` }) as React.CSSProperties;

/**
 * Full-screen Home hero. The server renders everything that must always work: the first slide as a
 * priority next/image (the LCP element), the shade, the copy and the buttons. A client component adds
 * the slide controls, and an idle-loaded WebGL layer adds the depth parallax on top.
 */
export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const ts = await getTranslations({ locale, namespace: "projectsPage.status" });
  const projects = await getContentSource().getProjects();

  const captions: HeroCaption[] = heroSlides.map((s) => {
    const c = heroCaption(s, projects, locale, (slug) => {
      const p = projects.find((x) => x.slug === slug)!;
      return ts(STATUS_KEY[p.status]);
    });
    return {
      ...c,
      alt: t("imageAlt", { title: c.title }),
      image: s.image,
      blur: getBlur(s.image),
      fx: s.focusX,
      fxMobile: s.focusXMobile,
      fy: s.focusY,
    };
  });

  const first = captions[0];
  const firstImage = (
    <Image
      src={first.image}
      alt={first.alt}
      fill
      priority
      sizes="100vw"
      placeholder={first.blur ? "blur" : "empty"}
      blurDataURL={first.blur}
      className="hero-img object-cover"
      style={
        {
          "--fx": `${first.fx * 100}%`,
          "--fxm": `${first.fxMobile * 100}%`,
          "--fy": `${first.fy * 100}%`,
        } as React.CSSProperties
      }
    />
  );

  const copy = (
    // Flex-column container: the copy sits at the bottom-left, and the top padding (header + 32px)
    // guarantees it can never reach the header, however short the viewport is.
    <div className="relative z-10 flex flex-1 flex-col justify-end px-[clamp(20px,5vw,72px)] pt-[calc(var(--header-h)+32px)] pb-[clamp(110px,16vh,170px)] max-md:pb-[calc(clamp(110px,16vh,170px)+48px)]">
      <div className="flex max-w-[min(640px,88vw)] flex-col gap-[26px]">
        <span
          className="hero-rise flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.12em]"
          style={rise(0.3)}
        >
          <i aria-hidden="true" className="block size-2.5 bg-orange" />
          {t("eyebrow")}
        </span>
        <h1 className="font-heading text-[clamp(40px,min(6.4vw,9.5vh),96px)] leading-none tracking-[-0.03em] text-white">
          <span className="hero-rise inline-block" style={rise(0.45)}>
            {t("title1")}
          </span>{" "}
          <span className="hero-rise inline-block" style={rise(0.6)}>
            {t("title2")}
          </span>{" "}
          <span
            className="hero-rise inline-block shadow-[inset_0_-0.16em_0_#F47C24]"
            style={rise(0.75)}
          >
            {t("title3")}
          </span>
        </h1>
        <p
          className="hero-rise max-w-[520px] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-[#E6E8EB]"
          style={rise(1.1)}
        >
          {t("description")}
        </p>
        <div className="hero-rise flex flex-wrap gap-3.5" style={rise(1.3)}>
          <Link href="/projects" className={buttonStyles("primary", "lg")}>
            {t("ctaProjects")}
          </Link>
          <Link href="/about" className={buttonStyles("outline-light", "lg")}>
            {t("ctaWho")}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <HeroSlideshow
      slides={heroSlides}
      captions={captions}
      labels={{
        choose: t("choose"),
        show: t("show", { title: "{title}" }),
        pause: t("pause"),
        play: t("play"),
        scroll: t("scroll"),
      }}
      firstImage={firstImage}
      copy={copy}
    />
  );
}
