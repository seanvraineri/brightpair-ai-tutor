import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ButtonSecondary = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "border-brightpair text-brightpair hover:bg-brightpair/10 transition-all duration-300 shadow-button hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-sm rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

ButtonSecondary.displayName = "ButtonSecondary";

export default ButtonSecondary; 