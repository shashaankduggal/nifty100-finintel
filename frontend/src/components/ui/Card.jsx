import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl p-6 backdrop-blur-xl transition-transform duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

