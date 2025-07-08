import lessonsData from "@/services/mockData/lessons.json";

export const lessonService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...lessonsData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lesson = lessonsData.find(l => l.Id === id);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    return { ...lesson };
  },

  getByCourseId: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return lessonsData.filter(l => l.courseId === courseId);
  },

  create: async (lessonData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...lessonsData.map(l => l.Id)) + 1;
    const newLesson = {
      Id: newId,
      ...lessonData,
      completed: false,
      notes: ""
    };
    lessonsData.push(newLesson);
    return { ...newLesson };
  },

  update: async (id, lessonData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = lessonsData.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error("Lesson not found");
    }
    lessonsData[index] = { ...lessonsData[index], ...lessonData };
    return { ...lessonsData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = lessonsData.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error("Lesson not found");
    }
    lessonsData.splice(index, 1);
    return { success: true };
  }
};