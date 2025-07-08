import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "default", onAction }) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "courses":
        return {
          title: "No Courses Found",
          description: "We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.",
          icon: "BookOpen",
          actionText: "Browse All Courses",
          gradient: "from-primary-100 to-secondary-100",
          iconColor: "text-primary-600"
        };
      case "my-learning":
        return {
          title: "Start Your Learning Journey",
          description: "You haven't enrolled in any courses yet. Discover thousands of courses to expand your knowledge.",
          icon: "GraduationCap",
          actionText: "Explore Courses",
          gradient: "from-accent-100 to-green-100",
          iconColor: "text-accent-600"
        };
      case "search":
        return {
          title: "No Results Found",
          description: "We couldn't find any courses matching your search. Try different keywords or browse our categories.",
          icon: "Search",
          actionText: "Clear Search",
          gradient: "from-gray-100 to-gray-200",
          iconColor: "text-gray-600"
        };
      case "lessons":
        return {
          title: "No Lessons Available",
          description: "This course doesn't have any lessons yet. Check back later for updates.",
          icon: "Video",
          actionText: "Back to Courses",
          gradient: "from-blue-100 to-indigo-100",
          iconColor: "text-blue-600"
        };
      default:
        return {
          title: "Nothing to Show",
          description: "There's no content available at the moment.",
          icon: "Package",
          actionText: "Go Home",
          gradient: "from-gray-100 to-gray-200",
          iconColor: "text-gray-600"
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <div className={`w-20 h-20 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center`}>
          <ApperIcon name={config.icon} className={`w-10 h-10 ${config.iconColor}`} />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-gray-900 mb-3"
      >
        {config.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {config.description}
      </motion.p>

      {onAction && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className="btn btn-primary btn-lg group"
        >
          <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
          {config.actionText}
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-sm text-gray-500"
      >
        Need help? <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Contact Support</a>
      </motion.div>
    </motion.div>
  );
};

export default Empty;