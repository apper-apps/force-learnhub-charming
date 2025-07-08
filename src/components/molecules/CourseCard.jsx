import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CourseCard = ({ 
  course, 
  className,
  variant = "default",
  showProgress = false,
  onEnroll,
  onContinue 
}) => {
  const {
    Id,
    title,
    instructor,
    thumbnail,
    duration,
    difficulty,
    category,
    rating,
    enrolledCount,
    price,
    description
  } = course;

  const progress = showProgress ? course.progress || 0 : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "danger";
      default:
        return "default";
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("card group cursor-pointer", className)}
    >
      <Link to={`/course/${Id}`} className="block">
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Duration overlay */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            {formatDuration(duration)}
          </div>
          
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="primary" size="xs">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and difficulty */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
            <Badge variant={getDifficultyColor(difficulty)} size="xs">
              {difficulty}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <Avatar
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor}`}
              alt={instructor}
              size="sm"
              className="mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{instructor}</p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>

          {/* Rating and enrolled count */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 ml-1">
                {rating}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({enrolledCount?.toLocaleString()} students)
              </span>
            </div>
            
            <div className="text-lg font-bold text-primary-600">
              {formatPrice(price)}
            </div>
          </div>

          {/* Progress (if showing) */}
          {showProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </Link>

{/* Action buttons */}
      <div className="px-6 pb-6">
        {showProgress ? (
          <Button
            variant="primary"
            size="md"
            className="w-full text-white"
            onClick={() => onContinue?.(course)}
            icon="Play"
          >
            Continue Learning
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="w-full text-white"
            onClick={() => onEnroll?.(course)}
            icon="BookOpen"
          >
            {price === 0 ? "Enroll for Free" : `Enroll for ${formatPrice(price)}`}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;