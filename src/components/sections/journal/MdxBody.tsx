import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

/** Styled prose for journal posts (no typography plugin needed). */
const components = {
  h2: ({ children, ...p }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-4 text-h3" {...p}>
      {children}
    </h2>
  ),
  h3: ({ children, ...p }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 text-xl" {...p}>
      {children}
    </h3>
  ),
  p: (p: ComponentPropsWithoutRef<"p">) => <p className="mb-6 leading-relaxed" {...p} />,
  ul: (p: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-6 list-disc space-y-2 ps-6 marker:text-orange" {...p} />
  ),
  ol: (p: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-6 list-decimal space-y-2 ps-6 marker:text-orange-text" {...p} />
  ),
  a: ({ children, ...p }: ComponentPropsWithoutRef<"a">) => (
    <a className="font-medium underline decoration-orange underline-offset-4" {...p}>
      {children}
    </a>
  ),
  blockquote: (p: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-8 border-s-4 border-orange ps-6 text-xl italic" {...p} />
  ),
  strong: (p: ComponentPropsWithoutRef<"strong">) => <strong className="font-semibold" {...p} />,
  hr: () => <hr className="my-10 border-line" />,
};

export function MdxBody({ source }: { source: string }) {
  return (
    <div className="text-ink/90">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
