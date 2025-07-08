import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterPanel = ({ 
  filters = {},
  onFiltersChange,
  className,
  isOpen = false,
  onToggle
}) => {
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    difficulty: "",
    duration: "",
    rating: ""
  });

  const filterOptions = {
    category: [
      { value: "programming", label: "Programming" },
      { value: "design", label: "Design" },
      { value: "business", label: "Business" },
      { value: "marketing", label: "Marketing" },
      { value: "data-science", label: "Data Science" }
    ],
    difficulty: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" }
    ],
    duration: [
      { value: "short", label: "Under 2 hours" },
      { value: "medium", label: "2-10 hours" },
      { value: "long", label: "10+ hours" }
    ],
    rating: [
      { value: "4", label: "4+ Stars" },
      { value: "4.5", label: "4.5+ Stars" },
      { value: "5", label: "5 Stars" }
    ]
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: activeFilters[filterType] === value ? "" : value
    };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: "",
      difficulty: "",
      duration: "",
      rating: ""
    });
    onFiltersChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className={cn("relative", className)}>
      {/* Mobile toggle button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          icon={isOpen ? "X" : "Filter"}
          className="w-full justify-between"
        >
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter panel */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        className={cn(
          "overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm",
          "lg:opacity-100 lg:h-auto lg:overflow-visible"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Filter sections */}
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType} className="space-y-3">
              <h4 className="font-medium text-gray-700 capitalize">
                {filterType.replace("-", " ")}
              </h4>
              <div className="space-y-2">
                {options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleFilterChange(filterType, option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                      activeFilters[filterType] === option.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                    {activeFilters[filterType] === option.value && (
                      <ApperIcon name="Check" className="w-4 h-4 text-primary-600" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([filterType, value]) => {
                  if (!value) return null;
                  const option = filterOptions[filterType].find(opt => opt.value === value);
                  return (
                    <Badge
                      key={`${filterType}-${value}`}
                      variant="primary"
                      className="cursor-pointer"
                      onClick={() => handleFilterChange(filterType, value)}
                    >
                      {option?.label}
                      <ApperIcon name="X" className="w-3 h-3 ml-1" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FilterPanel;