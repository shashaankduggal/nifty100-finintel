import { cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "../../lib/utils";

export const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", asChild = false, children, ...props },
  ref,
) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-0 disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" &&
      "bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:shadow-indigo-500/30",
    variant === "secondary" &&
      "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
    variant === "ghost" &&
      "text-slate-300 hover:bg-white/5 hover:text-white",
    variant === "danger" &&
      "bg-rose-500 text-white hover:bg-rose-400",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      className: cn(styles, children.props.className),
    });
  }

  return (
    <button ref={ref} className={styles} {...props}>
      {children}
    </button>
  );
});
