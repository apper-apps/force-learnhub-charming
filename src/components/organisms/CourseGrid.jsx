import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CourseCard from "@/components/molecules/CourseCard";
import FilterPanel from "@/components/molecules/FilterPanel";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { cn } from "@/utils/cn";

const CourseGrid = ({ 
  searchQuery = "",
  selectedCategory = "",
  className,
  showFilters = true,
  title = "Courses",
  variant = "grid"
}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    loadCourses();
  }, [searchQuery, selectedCategory, filters, sortBy]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let allCourses = await courseService.getAll();
      
      // Apply filters
      if (searchQuery) {
        allCourses = allCourses.filter(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        allCourses = allCourses.filter(course => 
          course.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      if (filters.category) {
        allCourses = allCourses.filter(course => 
          course.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      if (filters.difficulty) {
        allCourses = allCourses.filter(course => 
          course.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }
      
      if (filters.duration) {
        allCourses = allCourses.filter(course => {
          const duration = course.duration;
          switch (filters.duration) {
            case "short":
              return duration < 120;
            case "medium":
              return duration >= 120 && duration <= 600;
            case "long":
              return duration > 600;
            default:
              return true;
          }
        });
      }
      
      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        allCourses = allCourses.filter(course => course.rating >= minRating);
      }
      
      // Apply sorting
      switch (sortBy) {
        case "popular":
          allCourses.sort((a, b) => b.enrolledCount - a.enrolledCount);
          break;
        case "rating":
          allCourses.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          allCourses.sort((a, b) => b.Id - a.Id);
          break;
        case "price-low":
          allCourses.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          allCourses.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
      
      setCourses(allCourses);
    } catch (err) {
      setError(err.message || "Failed to load courses");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    try {
      // Simulate enrollment
      toast.success(`Successfully enrolled in ${course.title}`);
    } catch (err) {
      toast.error("Failed to enroll in course");
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" }
  ];

  if (loading) return <Loading type="course-grid" />;
  if (error) return <Error message={error} onRetry={loadCourses} type="course-load" />;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {courses.length} {courses.length === 1 ? "course" : "courses"} found
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Sort */}
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

          {/* View Mode */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-l-lg transition-colors",
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ApperIcon name="Grid3x3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-r-lg transition-colors",
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        {showFilters && (
          <div className="lg:w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            />
          </div>
        )}

        {/* Courses */}
        <div className="flex-1">
          {courses.length === 0 ? (
            <Empty 
              type="courses" 
              onAction={() => {
                setFilters({});
                setSortBy("popular");
              }} 
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              )}
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard
                    course={course}
                    onEnroll={handleEnroll}
                    variant={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseGrid;