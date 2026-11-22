import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import "../globals.css";

/**
 * Translation namespaces used by client components (anything that calls useTranslations in a
 * "use client" file, plus cards rendered inside them). Server components read messages
 * directly, so the rest are never sent to the browser. Add a namespace here when a client
 * component starts using it.
 */
const CLIENT_NAMESPACES = [
  "common",
  "nav",
  "what",
  "trusted",
  "projectsPage",
  "projectDetail",
  "journalPage",
  "contact",
  "notFound",
  "error",
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { template: t("titleTemplate"), default: t("defaultTitle") },
    description: t("defaultDescription"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Opt this request into static rendering.
  setRequestLocale(locale);

  const allMessages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, allMessages[ns]]));

  // Each locale only loads (and preloads) the fonts it actually uses.
  const fontClass =
    locale === "bn"
      ? (await import("@/lib/fonts-bn")).hindSiliguri.variable
      : (({ sora, inter }) => `${sora.variable} ${inter.variable}`)(
          await import("@/lib/fonts-latin"),
        );

  return (
    <html lang={locale} className={fontClass} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <SkipLink />
          <SmoothScroll />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
