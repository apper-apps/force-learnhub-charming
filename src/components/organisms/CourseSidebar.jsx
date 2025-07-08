import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import { lessonService } from "@/services/api/lessonService";
import { cn } from "@/utils/cn";

const CourseSidebar = ({ 
  courseId, 
  currentLessonId,
  className,
  onLessonSelect 
}) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    loadLessons();
  }, [courseId]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const allLessons = await lessonService.getAll();
      const courseLessons = allLessons.filter(lesson => lesson.courseId === courseId);
      setLessons(courseLessons);
      
      // Expand all sections by default
      const sections = {};
      courseLessons.forEach(lesson => {
        const section = lesson.section || "Introduction";
        sections[section] = true;
      });
      setExpandedSections(sections);
    } catch (err) {
      console.error("Failed to load lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const section = lesson.section || "Introduction";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(lesson);
    return acc;
  }, {});

  const calculateProgress = () => {
    const completedLessons = lessons.filter(lesson => lesson.completed).length;
    return lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {Math.round(calculateProgress())}% Complete
            </span>
          </div>
          <ProgressBar progress={calculateProgress()} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>{lessons.length} lessons</span>
          <span>{formatDuration(lessons.reduce((total, lesson) => total + lesson.duration, 0))}</span>
        </div>
      </div>

      {/* Lessons */}
      <div className="max-h-[600px] overflow-y-auto">
        {Object.entries(groupedLessons).map(([section, sectionLessons]) => (
          <div key={section} className="border-b border-gray-100 last:border-b-0">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={expandedSections[section] ? "ChevronDown" : "ChevronRight"} 
                  className="w-4 h-4 text-gray-500" 
                />
                <span className="font-medium text-gray-900">{section}</span>
              </div>
              <Badge variant="outline" size="xs">
                {sectionLessons.length}
              </Badge>
            </button>

            {/* Section Lessons */}
            {expandedSections[section] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                {sectionLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/lesson/${lesson.Id}`}
                      onClick={() => onLessonSelect?.(lesson)}
                      className={cn(
                        "flex items-center space-x-3 p-3 ml-8 rounded-lg transition-all duration-200 group",
                        currentLessonId === lesson.Id
                          ? "bg-primary-50 border-l-4 border-l-primary-500"
                          : "hover:bg-gray-50"
                      )}
                    >
                      {/* Play/Complete Icon */}
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        lesson.completed
                          ? "bg-accent-500 text-white"
                          : currentLessonId === lesson.Id
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                      )}>
                        <ApperIcon 
                          name={lesson.completed ? "Check" : "Play"} 
                          className="w-4 h-4" 
                        />
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium truncate",
                          currentLessonId === lesson.Id
                            ? "text-primary-700"
                            : "text-gray-900"
                        )}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDuration(lesson.duration)}
                        </p>
                      </div>

                      {/* Lock Icon for premium content */}
                      {lesson.isPremium && !lesson.completed && (
                        <ApperIcon name="Lock" className="w-4 h-4 text-gray-400" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          icon="Download"
        >
          Download Resources
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          icon="MessageCircle"
        >
          Ask Questions
        </Button>
      </div>
    </div>
  );
};

export default CourseSidebar;