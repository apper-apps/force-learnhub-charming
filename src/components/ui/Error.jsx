import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, type = "default" }) => {
  const getErrorConfig = () => {
    switch (type) {
      case "course-load":
        return {
          title: "Unable to Load Courses",
          description: "We're having trouble loading the course catalog. Please try again.",
          icon: "BookOpen",
          actionText: "Retry Loading"
        };
      case "video-load":
        return {
          title: "Video Loading Error",
          description: "The video content couldn't be loaded. Please check your connection and try again.",
          icon: "Play",
          actionText: "Retry Video"
        };
      case "quiz-load":
        return {
          title: "Quiz Loading Failed",
          description: "We couldn't load the quiz questions. Please try again.",
          icon: "HelpCircle",
          actionText: "Retry Quiz"
        };
      default:
        return {
          title: "Something went wrong",
          description: message || "An unexpected error occurred. Please try again.",
          icon: "AlertCircle",
          actionText: "Try Again"
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name={config.icon} className="w-8 h-8 text-red-600" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        {config.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-6 max-w-md"
      >
        {config.description}
      </motion.p>

      {onRetry && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onRetry}
          className="btn btn-primary btn-md group"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2 group-hover:animate-spin" />
          {config.actionText}
        </motion.button>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-500 mt-4"
      >
        If the problem persists, please contact support.
      </motion.p>
    </motion.div>
  );
};

export default Error;