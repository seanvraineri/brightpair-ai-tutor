import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ButtonPrimary = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "bg-[#FFC83D] text-black hover:bg-[#ebba38] transition-all duration-300 shadow-button hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-sm rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

ButtonPrimary.displayName = "ButtonPrimary";

export default ButtonPrimary;
