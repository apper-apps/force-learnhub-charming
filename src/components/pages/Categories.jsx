import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { cn } from "@/utils/cn";

const Categories = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await courseService.getAll();
      setCourses(allCourses);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: "Programming",
      icon: "Code",
      color: "from-blue-500 to-blue-600",
      description: "Learn programming languages and software development",
      subcategories: ["Web Development", "Mobile Development", "Data Structures", "Algorithms"]
    },
    {
      name: "Design",
      icon: "Palette",
      color: "from-purple-500 to-purple-600",
      description: "Master visual design and user experience",
      subcategories: ["UI/UX Design", "Graphic Design", "Web Design", "Mobile Design"]
    },
    {
      name: "Business",
      icon: "Briefcase",
      color: "from-green-500 to-green-600",
      description: "Develop business skills and entrepreneurship",
      subcategories: ["Management", "Leadership", "Strategy", "Entrepreneurship"]
    },
    {
      name: "Marketing",
      icon: "TrendingUp",
      color: "from-orange-500 to-orange-600",
      description: "Learn digital marketing and growth strategies",
      subcategories: ["Digital Marketing", "Social Media", "SEO", "Content Marketing"]
    },
    {
      name: "Data Science",
      icon: "BarChart",
      color: "from-indigo-500 to-indigo-600",
      description: "Analyze data and build machine learning models",
      subcategories: ["Python", "Machine Learning", "Statistics", "Data Analysis"]
    },
    {
      name: "Photography",
      icon: "Camera",
      color: "from-pink-500 to-pink-600",
      description: "Capture and edit stunning photographs",
      subcategories: ["Portrait", "Landscape", "Wedding", "Photo Editing"]
    },
    {
      name: "Music",
      icon: "Music",
      color: "from-red-500 to-red-600",
      description: "Learn instruments and music production",
      subcategories: ["Guitar", "Piano", "Music Production", "Audio Engineering"]
    },
    {
      name: "Fitness",
      icon: "Dumbbell",
      color: "from-yellow-500 to-yellow-600",
      description: "Stay healthy with fitness and wellness courses",
      subcategories: ["Yoga", "Nutrition", "Personal Training", "Meditation"]
    }
  ];

  const getCategoryStats = (categoryName) => {
    const categoryLower = categoryName.toLowerCase();
    const categoryCourses = courses.filter(course => 
      course.category.toLowerCase() === categoryLower
    );
    
    return {
      count: categoryCourses.length,
      totalStudents: categoryCourses.reduce((sum, course) => sum + course.enrolledCount, 0),
      avgRating: categoryCourses.length > 0 
        ? categoryCourses.reduce((sum, course) => sum + course.rating, 0) / categoryCourses.length
        : 0
    };
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover courses across a wide range of topics. Find the perfect learning path for your goals.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const stats = getCategoryStats(category.name);
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="card p-6 h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  {/* Category Icon */}
                  <div className="flex items-center justify-center mb-4">
                    <div className={cn(
                      "w-16 h-16 bg-gradient-to-r rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform",
                      category.color
                    )}>
                      <ApperIcon name={category.icon} className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Courses</span>
                      <Badge variant="outline" size="xs">
                        {stats.count}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Students</span>
                      <span className="font-medium text-gray-900">
                        {stats.totalStudents.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avg Rating</span>
                      <div className="flex items-center">
                        <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="font-medium text-gray-900">
                          {stats.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="mb-6">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Popular Topics
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <Badge key={sub} variant="outline" size="xs" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/courses?category=${category.name.toLowerCase()}`}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full group-hover:shadow-lg"
                      icon="ArrowRight"
                      iconPosition="right"
                    >
                      Explore Courses
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Popular Categories Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Most Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              These categories have the most enrolled students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories
              .map(category => ({
                ...category,
                stats: getCategoryStats(category.name)
              }))
              .sort((a, b) => b.stats.totalStudents - a.stats.totalStudents)
              .slice(0, 3)
              .map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={cn(
                      "w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center",
                      category.color
                    )}>
                      <ApperIcon name={category.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.stats.count} courses</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {category.stats.totalStudents.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {category.stats.avgRating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>

                  <Link to={`/courses?category=${category.name.toLowerCase()}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Start Learning
                    </Button>
                  </Link>
                </motion.div>
              ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            We're constantly adding new courses and categories. Let us know what you'd like to learn!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-50"
            >
              <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
              Request a Course
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
            >
              <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;