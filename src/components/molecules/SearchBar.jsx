import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import AppIcon from "@/components/atoms/AppIcon";
import { cn } from "@/utils/cn";
const SearchBar = ({ 
  onSearch, 
  placeholder = "Search courses...",
  className,
  autoFocus = false 
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn("relative", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        "relative transition-all duration-200",
        isFocused && "transform scale-105"
      )}>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          autoFocus={autoFocus}
          className="pr-20"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <motion.button
              type="button"
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <AppIcon name="X" className="w-4 h-4" />
            </motion.button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="px-3"
            disabled={!query.trim()}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Search suggestions could go here */}
      {isFocused && query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          <div className="p-2 text-sm text-gray-600 border-b">
            Press Enter to search for "{query}"
          </div>
        </motion.div>
      )}
    </motion.form>
  );
};

export default SearchBar;