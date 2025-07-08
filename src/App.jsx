import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import CourseDetail from "@/components/pages/CourseDetail";
import MyLearning from "@/components/pages/MyLearning";
import Categories from "@/components/pages/Categories";
import LessonView from "@/components/pages/LessonView";
import SearchResults from "@/components/pages/SearchResults";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/lesson/:id" element={<LessonView />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/courses" element={<Home />} />
        </Routes>
      </motion.main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;