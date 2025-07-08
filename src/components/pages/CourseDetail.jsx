import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ProgressBar from "@/components/molecules/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { lessonService } from "@/services/api/lessonService";
import { cn } from "@/utils/cn";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCourseDetail();
  }, [id]);

  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      setError("");
      
      const courseData = await courseService.getById(parseInt(id));
      const allLessons = await lessonService.getAll();
      const courseLessons = allLessons.filter(lesson => lesson.courseId === id);
      
      setCourse(courseData);
      setLessons(courseLessons);
      
      // Check if user is enrolled (simulate check)
      setIsEnrolled(false);
      
    } catch (err) {
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      
      // Simulate enrollment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEnrolled(true);
      toast.success(`Successfully enrolled in ${course.title}!`);
      
      // Redirect to first lesson
      if (lessons.length > 0) {
        navigate(`/lesson/${lessons[0].Id}`);
      }
      
    } catch (err) {
      toast.error("Failed to enroll in course");
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (lessons.length > 0) {
      navigate(`/lesson/${lessons[0].Id}`);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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

  const totalDuration = lessons.reduce((total, lesson) => total + lesson.duration, 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: "Info" },
    { id: "curriculum", label: "Curriculum", icon: "BookOpen" },
    { id: "instructor", label: "Instructor", icon: "User" },
    { id: "reviews", label: "Reviews", icon: "Star" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourseDetail} />;
  if (!course) return <Error message="Course not found" />;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Badge variant="primary" className="bg-white text-primary-600">
                    {course.category}
                  </Badge>
                  <Badge variant={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-blue-100 mb-6">{course.description}</p>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center">
                    <ApperIcon name="Star" className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-medium mr-1">{course.rating}</span>
                    <span className="text-blue-200">({course.enrolledCount?.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Clock" className="w-5 h-5 text-blue-200 mr-1" />
                    <span>{formatDuration(totalDuration)} total</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="BookOpen" className="w-5 h-5 text-blue-200 mr-1" />
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Users" className="w-5 h-5 text-blue-200 mr-1" />
                    <span>{course.enrolledCount?.toLocaleString()} enrolled</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`}
                    alt={course.instructor}
                    size="lg"
                  />
                  <div>
                    <p className="font-medium">Created by {course.instructor}</p>
                    <p className="text-blue-200">Expert Instructor</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-xl p-6 text-gray-900"
              >
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <ApperIcon name="Play" className="w-16 h-16 text-gray-400" />
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </div>
                  {course.price > 0 && (
                    <div className="text-sm text-gray-600 line-through">
                      $199
                    </div>
                  )}
                </div>

{isEnrolled ? (
                  <div className="space-y-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full !text-white [&_svg]:!text-white"
                      onClick={handleStartLearning}
                      icon="Play"
                    >
                      Start Learning
                    </Button>
                    <div className="text-center">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent-500 inline mr-2" />
                      <span className="text-sm text-accent-600 font-medium">
                        You're enrolled!
                      </span>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleEnroll}
                    loading={enrolling}
                    icon="BookOpen"
                  >
                    {course.price === 0 ? "Enroll for Free" : `Enroll for $${course.price}`}
                  </Button>
                )}

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center">
                    <ApperIcon name="Clock" className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Smartphone" className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Award" className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700 border-l-4 border-l-primary-500"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Master the fundamentals of the subject",
                        "Build real-world projects",
                        "Understand advanced concepts",
                        "Develop practical skills",
                        "Learn industry best practices",
                        "Get ready for certification"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <ApperIcon name="Check" className="w-5 h-5 text-accent-500 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-3">
                        <ApperIcon name="Dot" className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">No prior experience required</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <ApperIcon name="Dot" className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">Access to a computer with internet</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <ApperIcon name="Dot" className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">Willingness to learn and practice</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        This comprehensive course is designed to take you from beginner to expert level. 
                        You'll learn through hands-on projects, real-world examples, and expert instruction. 
                        The curriculum is carefully structured to build your knowledge progressively, 
                        ensuring you master each concept before moving to the next.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        By the end of this course, you'll have the skills and confidence to tackle real-world 
                        challenges and advance your career. Join thousands of students who have already 
                        transformed their careers with this course.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "curriculum" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h3>
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.Id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">{lesson.section || "Introduction"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              {formatDuration(lesson.duration)}
                            </span>
                            <ApperIcon name="Play" className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "instructor" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Meet Your Instructor</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`}
                        alt={course.instructor}
                        size="2xl"
                      />
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{course.instructor}</h4>
                        <p className="text-gray-600 mb-4">Expert Instructor & Industry Professional</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">4.8</div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">15K+</div>
                            <div className="text-sm text-gray-600">Students Taught</div>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                          With over 10 years of industry experience, {course.instructor} has helped thousands 
                          of students master their skills. Known for making complex concepts easy to understand, 
                          they bring real-world insights to every lesson.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h3>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah Johnson",
                        rating: 5,
                        date: "2 days ago",
                        review: "Excellent course! The instructor explains everything clearly and the projects are very practical."
                      },
                      {
                        name: "Mike Chen",
                        rating: 5,
                        date: "1 week ago",
                        review: "This course exceeded my expectations. I learned so much and feel confident applying these skills."
                      },
                      {
                        name: "Emily Davis",
                        rating: 4,
                        date: "2 weeks ago",
                        review: "Great content and well-structured. Would definitely recommend to anyone starting out."
                      }
                    ].map((review, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`}
                            alt={review.name}
                            size="lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{review.name}</h4>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {Array(5).fill(0).map((_, i) => (
                                <ApperIcon
                                  key={i}
                                  name="Star"
                                  className={cn(
                                    "w-4 h-4",
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.review}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;