import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  variant: "solid" | "outline";
  children: ReactNode;
  external?: boolean;
  className?: string;
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-3 px-[1.375rem] text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-editorial";

const variants = {
  solid: "bg-fog text-void hover:bg-white",
  outline: "border border-edge text-fog hover:border-fog",
} as const;

export function ButtonLink({
  href,
  variant,
  children,
  external,
  className,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]}${className ? ` ${className}` : ""}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
