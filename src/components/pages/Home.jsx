import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CourseGrid from "@/components/organisms/CourseGrid";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { cn } from "@/utils/cn";

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setLoading(true);
      const allCourses = await courseService.getAll();
      
      // Get featured courses (highest rated)
      const featured = allCourses
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      
      // Get popular courses (most enrolled)
      const popular = allCourses
        .sort((a, b) => b.enrolledCount - a.enrolledCount)
        .slice(0, 8);
      
      setFeaturedCourses(featured);
      setPopularCourses(popular);
    } catch (err) {
      console.error("Failed to load featured content:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Programming", icon: "Code", color: "from-blue-500 to-blue-600", count: 120 },
    { name: "Design", icon: "Palette", color: "from-purple-500 to-purple-600", count: 85 },
    { name: "Business", icon: "Briefcase", color: "from-green-500 to-green-600", count: 95 },
    { name: "Marketing", icon: "TrendingUp", color: "from-orange-500 to-orange-600", count: 67 },
    { name: "Data Science", icon: "BarChart", color: "from-indigo-500 to-indigo-600", count: 78 },
    { name: "Photography", icon: "Camera", color: "from-pink-500 to-pink-600", count: 54 }
  ];

  const stats = [
    { label: "Students", value: "50K+", icon: "Users" },
    { label: "Courses", value: "1,200+", icon: "BookOpen" },
    { label: "Instructors", value: "500+", icon: "GraduationCap" },
    { label: "Countries", value: "100+", icon: "Globe" }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (searchQuery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseGrid 
          searchQuery={searchQuery}
          title={`Search Results for "${searchQuery}"`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Learn Without
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Limits
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100"
            >
              Discover thousands of courses from world-class instructors. 
              Build skills that matter in today's digital economy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <SearchBar 
                onSearch={handleSearch}
                placeholder="What do you want to learn today?"
                className="bg-white/10 backdrop-blur-sm border-white/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <ApperIcon name="BookOpen" className="w-5 h-5 mr-2" />
                Browse Courses
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our wide range of courses across different fields
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/category/${category.name.toLowerCase()}`}
                  className="group block"
                >
                  <div className="card p-6 group-hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-12 h-12 bg-gradient-to-r rounded-lg flex items-center justify-center",
                        category.color
                      )}>
                        <ApperIcon name={category.icon} className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.count} courses
                        </p>
                      </div>
                      <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Courses
              </h2>
              <p className="text-lg text-gray-600">
                Hand-picked courses from our top instructors
              </p>
            </div>
            <Link to="/courses">
              <Button variant="outline" icon="ArrowRight" iconPosition="right">
                View All Courses
              </Button>
            </Link>
          </div>

          {loading ? (
            <Loading type="course-grid" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Most Popular
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of students in these trending courses
            </p>
          </div>

          {loading ? (
            <Loading type="course-grid" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCourses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join millions of learners and start building the skills you need for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-50"
              >
                <ApperIcon name="User" className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
              >
                <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;