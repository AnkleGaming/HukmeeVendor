import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-elegant hover:scale-105 transform",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-background/80 backdrop-blur-sm hover:bg-primary-soft hover:border-primary",
        secondary:
          "bg-gradient-secondary text-secondary-foreground shadow-soft hover:shadow-elegant hover:scale-105 transform",
        ghost: "hover:bg-primary-soft hover:text-primary rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        luxury:
          "bg-luxury-gold text-foreground shadow-luxury hover:shadow-xl hover:scale-105 transform",
        wellness:
          "bg-wellness-green text-foreground shadow-soft hover:shadow-elegant hover:scale-105 transform",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
