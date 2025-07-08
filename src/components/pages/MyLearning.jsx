import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CourseCard from "@/components/molecules/CourseCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { userProgressService } from "@/services/api/userProgressService";
import { cn } from "@/utils/cn";

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      
      // Simulate loading enrolled courses with progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allCourses = await courseService.getAll();
      const allProgress = await userProgressService.getAll();
      
      // Simulate enrolled courses (first 5 courses)
      const enrolled = allCourses.slice(0, 5).map(course => {
        const progress = allProgress.find(p => p.courseId === course.Id.toString());
        return {
          ...course,
          progress: progress ? progress.completionPercentage : Math.floor(Math.random() * 100),
          lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          completedLessons: progress ? progress.completedLessons.length : Math.floor(Math.random() * 10),
          totalLessons: 12
        };
      });
      
      setEnrolledCourses(enrolled);
    } catch (err) {
      toast.error("Failed to load enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (course) => {
    // Navigate to next lesson or course overview
    toast.success(`Continuing with ${course.title}`);
  };

  const getFilteredCourses = () => {
    let filtered = [...enrolledCourses];
    
    switch (filter) {
      case "in-progress":
        filtered = filtered.filter(course => course.progress > 0 && course.progress < 100);
        break;
      case "completed":
        filtered = filtered.filter(course => course.progress >= 100);
        break;
      case "not-started":
        filtered = filtered.filter(course => course.progress === 0);
        break;
      default:
        break;
    }
    
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
        break;
      case "progress":
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: enrolledCourses.filter(c => c.progress >= 100).length,
    notStarted: enrolledCourses.filter(c => c.progress === 0).length
  };

  const filterOptions = [
    { value: "all", label: "All Courses", count: stats.total },
    { value: "in-progress", label: "In Progress", count: stats.inProgress },
    { value: "completed", label: "Completed", count: stats.completed },
    { value: "not-started", label: "Not Started", count: stats.notStarted }
  ];

  const sortOptions = [
    { value: "recent", label: "Recently Accessed" },
    { value: "progress", label: "Progress" },
    { value: "alphabetical", label: "Alphabetical" }
  ];

  if (loading) return <Loading type="course-grid" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
          <p className="text-gray-600">Track your progress and continue your learning journey</p>
        </div>

        {enrolledCourses.length === 0 ? (
          <Empty 
            type="my-learning" 
            onAction={() => window.location.href = "/"} 
          />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Play" className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.notStarted}</div>
                    <div className="text-sm text-gray-600">Not Started</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
                        filter === option.value
                          ? "bg-primary-50 text-primary-700 border-2 border-primary-200"
                          : "text-gray-600 hover:text-primary-700 hover:bg-gray-50 border-2 border-transparent"
                      )}
                    >
                      <span>{option.label}</span>
                      <Badge variant={filter === option.value ? "primary" : "outline"} size="xs">
                        {option.count}
                      </Badge>
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <Empty 
                type="courses" 
                onAction={() => setFilter("all")} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CourseCard
                      course={course}
                      showProgress={true}
                      onContinue={handleContinue}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyLearning;