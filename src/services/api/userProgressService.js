import userProgressData from "@/services/mockData/userProgress.json";

export const userProgressService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...userProgressData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const progress = userProgressData.find(p => p.Id === id);
    if (!progress) {
      throw new Error("User progress not found");
    }
    return { ...progress };
  },

  getByCourseId: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return userProgressData.find(p => p.courseId === courseId);
  },

  create: async (progressData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...userProgressData.map(p => p.Id)) + 1;
    const newProgress = {
      Id: newId,
      ...progressData,
      completedLessons: [],
      quizScores: [],
      completionPercentage: 0,
      lastAccessed: new Date().toISOString()
    };
    userProgressData.push(newProgress);
    return { ...newProgress };
  },

  update: async (id, progressData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = userProgressData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("User progress not found");
    }
    userProgressData[index] = { ...userProgressData[index], ...progressData };
    return { ...userProgressData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = userProgressData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("User progress not found");
    }
    userProgressData.splice(index, 1);
    return { success: true };
  }
};