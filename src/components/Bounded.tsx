import { ReactNode } from "react";
import clsx from "clsx";

export function Bounded({
  className,
  children,
  ...restProps
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={clsx(
        "px-6 ~py-10/16 [.header+&]:pt-44 [.header+&]:md:pt-32",
        className
      )}
      {...restProps}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
