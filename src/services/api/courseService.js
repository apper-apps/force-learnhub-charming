import coursesData from "@/services/mockData/courses.json";

export const courseService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...coursesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = coursesData.find(c => c.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  create: async (courseData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...coursesData.map(c => c.Id)) + 1;
    const newCourse = {
      Id: newId,
      ...courseData,
      enrolledCount: 0,
      rating: 0
    };
    coursesData.push(newCourse);
    return { ...newCourse };
  },

  update: async (id, courseData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = coursesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    coursesData[index] = { ...coursesData[index], ...courseData };
    return { ...coursesData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = coursesData.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    coursesData.splice(index, 1);
    return { success: true };
  }
};