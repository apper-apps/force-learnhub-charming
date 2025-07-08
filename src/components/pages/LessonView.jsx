import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import CourseSidebar from "@/components/organisms/CourseSidebar";
import QuizComponent from "@/components/organisms/QuizComponent";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { lessonService } from "@/services/api/lessonService";
import { courseService } from "@/services/api/courseService";
import { cn } from "@/utils/cn";

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError("");
      
      const lessonData = await lessonService.getById(parseInt(id));
      const courseData = await courseService.getById(parseInt(lessonData.courseId));
      
      setLesson(lessonData);
      setCourse(courseData);
      setNotes(lessonData.notes || "");
      setIsCompleted(lessonData.completed || false);
      
    } catch (err) {
      setError(err.message || "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoProgress = (currentTime, duration) => {
    // Auto-mark as completed when 90% watched
    if (currentTime / duration > 0.9 && !isCompleted) {
      markAsCompleted();
    }
  };

  const handleVideoComplete = () => {
    if (!isCompleted) {
      markAsCompleted();
    }
  };

  const markAsCompleted = async () => {
    try {
      setIsCompleted(true);
      toast.success("Lesson completed!");
      
      // Auto-save progress
      await lessonService.update(lesson.Id, {
        ...lesson,
        completed: true,
        notes: notes
      });
      
    } catch (err) {
      toast.error("Failed to save progress");
    }
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const saveNotes = async () => {
    try {
      await lessonService.update(lesson.Id, {
        ...lesson,
        notes: notes
      });
      toast.success("Notes saved!");
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  const handleQuizComplete = (score) => {
    setShowQuiz(false);
    if (score >= 70) {
      toast.success("Quiz completed successfully!");
      // Navigate to next lesson or course overview
    }
  };

  const handleNextLesson = () => {
    // Navigate to next lesson (simplified logic)
    const nextId = lesson.Id + 1;
    navigate(`/lesson/${nextId}`);
  };

  const handlePreviousLesson = () => {
    // Navigate to previous lesson (simplified logic)
    const prevId = lesson.Id - 1;
    if (prevId > 0) {
      navigate(`/lesson/${prevId}`);
    }
  };

  if (loading) return <Loading type="video-player" />;
  if (error) return <Error message={error} onRetry={loadLesson} />;
  if (!lesson) return <Error message="Lesson not found" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="hover:text-primary-600 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            </button>
            <span>/</span>
            <span className="hover:text-primary-600 cursor-pointer">
              {course?.title}
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{lesson.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <VideoPlayer
                src={lesson.videoUrl}
                title={lesson.title}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
                className="aspect-video"
              />
            </motion.div>

            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {lesson.title}
                  </h1>
                  <p className="text-gray-600">
                    Part of: <span className="font-medium">{course?.title}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {isCompleted && (
                    <div className="flex items-center text-accent-600">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Actions */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  variant="primary"
                  onClick={() => markAsCompleted()}
                  disabled={isCompleted}
                  icon={isCompleted ? "CheckCircle" : "Check"}
                >
                  {isCompleted ? "Completed" : "Mark as Complete"}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => setShowQuiz(true)}
                  icon="HelpCircle"
                >
                  Take Quiz
                </Button>
                
                <Button
                  variant="outline"
                  onClick={saveNotes}
                  icon="Save"
                >
                  Save Notes
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  icon="ChevronLeft"
                  disabled={lesson.Id === 1}
                >
                  Previous Lesson
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleNextLesson}
                  icon="ChevronRight"
                  iconPosition="right"
                >
                  Next Lesson
                </Button>
              </div>
            </motion.div>

            {/* Notes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                My Notes
              </h3>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Add your notes here..."
                className="w-full h-32 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 resize-none"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Notes are automatically saved
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveNotes}
                  icon="Save"
                >
                  Save Now
                </Button>
              </div>
            </motion.div>

            {/* Quiz Section */}
            {showQuiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <QuizComponent
                  lessonId={lesson.Id.toString()}
                  onComplete={handleQuizComplete}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar
              courseId={lesson.courseId}
              currentLessonId={lesson.Id}
              onLessonSelect={(selectedLesson) => {
                navigate(`/lesson/${selectedLesson.Id}`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;