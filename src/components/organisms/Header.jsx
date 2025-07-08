import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const navigationItems = [
    { name: "Browse Courses", href: "/", icon: "BookOpen" },
    { name: "My Learning", href: "/my-learning", icon: "GraduationCap" },
    { name: "Categories", href: "/categories", icon: "Grid3x3" }
  ];

  const isActiveRoute = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
        : "bg-white border-b border-gray-100"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-display font-bold text-gray-800">
              LearnHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group",
                  isActiveRoute(item.href)
                    ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:text-primary-700 hover:bg-gray-50"
                )}
              >
<ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActiveRoute(item.href) ? "text-primary-600" : "text-gray-600 group-hover:text-primary-600"
                  )} 
                />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              icon="Heart"
              className="relative"
            >
              Wishlist
              <Badge variant="danger" size="xs" className="absolute -top-2 -right-2">
                3
              </Badge>
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon="User"
            >
              Profile
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
<button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6 text-gray-600 hover:text-primary-600 transition-colors" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                  isActiveRoute(item.href)
                    ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700"
                    : "text-gray-600 hover:text-primary-700 hover:bg-gray-50"
                )}
>
                <ApperIcon name={item.icon} className={cn(
                  "w-5 h-5 transition-colors",
                  isActiveRoute(item.href) ? "text-primary-600" : "text-gray-600"
                )} />
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <Button
                variant="outline"
                size="md"
                icon="Heart"
                className="w-full justify-start"
              >
                Wishlist
              </Button>
              <Button
                variant="primary"
                size="md"
                icon="User"
                className="w-full justify-start"
              >
                Profile
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;