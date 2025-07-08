import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  className,
  size = "md",
  variant = "primary",
  showPercentage = true,
  animated = true 
}) => {
  const sizes = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6"
  };

  const variants = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    success: "from-accent-500 to-accent-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600"
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizes[size]
      )}>
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            variants[variant]
          )}
          initial={{ width: animated ? 0 : `${clampedProgress}%` }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0,
            ease: "easeOut"
          }}
        />
      </div>
      
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-0 top-full mt-1 text-xs text-gray-600 font-medium"
        >
          {Math.round(clampedProgress)}%
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;