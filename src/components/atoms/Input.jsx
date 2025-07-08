import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  success,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseStyles = "input-field";
  
  const stateStyles = {
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    success: "border-accent-500 focus:border-accent-500 focus:ring-accent-500"
  };

  const getStateStyle = () => {
    if (error) return stateStyles.error;
    if (success) return stateStyles.success;
    return "";
  };

  const hasIcon = icon && iconPosition;
  const iconPadding = iconPosition === "left" ? "pl-12" : "pr-12";

  return (
    <div className="relative">
      {hasIcon && (
        <div className={cn(
          "absolute inset-y-0 flex items-center pointer-events-none",
          iconPosition === "left" ? "left-0 pl-4" : "right-0 pr-4"
        )}>
          <ApperIcon 
            name={icon} 
            className={cn(
              "w-5 h-5",
              error ? "text-red-500" : success ? "text-accent-500" : "text-gray-400"
            )} 
          />
        </div>
      )}
      
      <input
        type={type}
        className={cn(
          baseStyles,
          getStateStyle(),
          hasIcon && iconPadding,
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;