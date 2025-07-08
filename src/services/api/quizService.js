import quizzesData from "@/services/mockData/quizzes.json";

export const quizService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...quizzesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const quiz = quizzesData.find(q => q.Id === id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    return { ...quiz };
  },

  getByLessonId: async (lessonId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return quizzesData.find(q => q.lessonId === lessonId);
  },

  create: async (quizData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...quizzesData.map(q => q.Id)) + 1;
    const newQuiz = {
      Id: newId,
      ...quizData,
      attempts: 0
    };
    quizzesData.push(newQuiz);
    return { ...newQuiz };
  },

  update: async (id, quizData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = quizzesData.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Quiz not found");
    }
    quizzesData[index] = { ...quizzesData[index], ...quizData };
    return { ...quizzesData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = quizzesData.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Quiz not found");
    }
    quizzesData.splice(index, 1);
    return { success: true };
  }
};