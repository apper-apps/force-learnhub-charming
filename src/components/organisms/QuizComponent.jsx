import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { quizService } from "@/services/api/quizService";
import { cn } from "@/utils/cn";

const QuizComponent = ({ 
  lessonId, 
  onComplete,
  className 
}) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError("");
      
      const allQuizzes = await quizService.getAll();
      const lessonQuiz = allQuizzes.find(q => q.lessonId === lessonId);
      
      if (!lessonQuiz) {
        throw new Error("Quiz not found for this lesson");
      }
      
      setQuiz(lessonQuiz);
      setTimeLeft(lessonQuiz.timeLimit * 60); // Convert minutes to seconds
    } catch (err) {
      setError(err.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Calculate score
      let correctAnswers = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const finalScore = (correctAnswers / quiz.questions.length) * 100;
      setScore(finalScore);
      setShowResults(true);
      
      // Check if passed
      const passed = finalScore >= quiz.passingScore;
      
      if (passed) {
        toast.success(`Congratulations! You scored ${Math.round(finalScore)}%`);
        onComplete?.(finalScore);
      } else {
        toast.error(`You scored ${Math.round(finalScore)}%. Minimum required: ${quiz.passingScore}%`);
      }
      
    } catch (err) {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuiz} type="quiz-load" />;
  if (!quiz) return <Error message="Quiz not found" />;

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("bg-white rounded-lg border border-gray-200 shadow-sm p-8", className)}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
              score >= quiz.passingScore
                ? "bg-gradient-to-r from-accent-100 to-accent-200"
                : "bg-gradient-to-r from-red-100 to-red-200"
            )}>
              <ApperIcon 
                name={score >= quiz.passingScore ? "Trophy" : "AlertCircle"} 
                className={cn(
                  "w-10 h-10",
                  score >= quiz.passingScore ? "text-accent-600" : "text-red-600"
                )} 
              />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {score >= quiz.passingScore ? "Congratulations!" : "Keep Learning!"}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {score >= quiz.passingScore 
                ? "You've successfully completed the quiz!" 
                : "You can retake the quiz to improve your score."
              }
            </p>
          </motion.div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {Math.round(score)}%
                </div>
                <div className="text-sm text-gray-600">Your Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {quiz.passingScore}%
                </div>
                <div className="text-sm text-gray-600">Required</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {Object.keys(answers).length}/{quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Answered</div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {score < quiz.passingScore && (
              <Button
                variant="primary"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                  setScore(0);
                  setTimeLeft(quiz.timeLimit * 60);
                }}
                icon="RefreshCw"
              >
                Retake Quiz
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              icon="ArrowLeft"
            >
              Back to Lesson
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Quiz</h2>
          <div className="flex items-center space-x-4">
            {timeLeft && (
              <Badge 
                variant={timeLeft < 300 ? "danger" : "outline"}
                className="font-mono"
              >
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
            )}
            <Badge variant="outline">
              {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </div>
        </div>
        
        <ProgressBar progress={progressPercentage} />
      </div>

      {/* Question */}
      <div className="p-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Question {currentQuestion + 1}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                  answers[currentQuestion] === index
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    answers[currentQuestion] === index
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-300"
                  )}>
                    {answers[currentQuestion] === index && (
                      <ApperIcon name="Check" className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            icon="ArrowLeft"
          >
            Previous
          </Button>

          <div className="flex items-center space-x-3">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length}
                loading={isSubmitting}
                icon="Check"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                icon="ArrowRight"
                iconPosition="right"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;