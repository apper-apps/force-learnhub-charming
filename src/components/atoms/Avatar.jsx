import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = forwardRef(({ 
  className, 
  src,
  alt,
  fallback,
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20"
  };

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl"
  };

  const baseStyles = "relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-full";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          baseStyles,
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        baseStyles,
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {fallback ? (
        <span className={cn("font-medium text-gray-600", textSizes[size])}>
          {fallback}
        </span>
      ) : (
        <ApperIcon 
          name="User" 
          className={cn("text-gray-400", size === "xs" ? "w-3 h-3" : size === "sm" ? "w-4 h-4" : "w-5 h-5")} 
        />
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;