import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  const CourseCardSkeleton = () => (
    <div className="card p-6 space-y-4">
      <div className="skeleton h-48 rounded-lg"></div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-3/4 rounded"></div>
        <div className="skeleton h-3 w-1/2 rounded"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-16 rounded"></div>
        <div className="skeleton h-4 w-12 rounded"></div>
      </div>
    </div>
  );

  const LessonSkeleton = () => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
      <div className="skeleton w-8 h-8 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded"></div>
        <div className="skeleton h-3 w-1/2 rounded"></div>
      </div>
      <div className="skeleton h-4 w-12 rounded"></div>
    </div>
  );

  const VideoPlayerSkeleton = () => (
    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full"
      />
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "course-grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CourseCardSkeleton />
              </motion.div>
            ))}
          </div>
        );
      case "lesson-list":
        return (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <LessonSkeleton />
              </motion.div>
            ))}
          </div>
        );
      case "video-player":
        return <VideoPlayerSkeleton />;
      default:
        return (
          <div className="flex items-center justify-center p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
            />
          </div>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      {renderSkeleton()}
    </div>
  );
};

export default Loading;