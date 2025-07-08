import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import AppIcon from "@/components/ApperIcon";
import CourseGrid from "@/components/organisms/CourseGrid";
import SearchBar from "@/components/molecules/SearchBar";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for courses, instructors, or topics..."
              autoFocus
            />
          </div>
          
          {query && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Results
              </h1>
              <p className="text-gray-600">
                Showing results for "{query}"
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {query ? (
          <CourseGrid 
            searchQuery={query}
            title=""
            showFilters={true}
          />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AppIcon name="Search" className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Search
              </h2>
              <p className="text-gray-600">
                Enter a search term above to find courses, instructors, or topics
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;