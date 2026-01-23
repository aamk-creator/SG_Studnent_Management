import axios from "@/plugins/axios";

export default {
  namespaced: true,

  state: {
    courses: [],
  },

  getters: {
    // All courses with formatted dates
    allCourses: (state) =>
      state.courses.map((c) => ({
        ...c,
        formattedStart: c.course_start_at
          ? c.course_start_at.toLocaleDateString()
          : "-",
        formattedEnd: c.course_end_at
          ? c.course_end_at.toLocaleDateString()
          : "-",
      })),

    completedCourses: (state) =>
      state.courses
        .filter((c) => c.status === "completed")
        .map((c) => ({
          ...c,
          formattedStart: c.course_start_at
            ? c.course_start_at.toLocaleDateString()
            : "-",
          formattedEnd: c.course_end_at
            ? c.course_end_at.toLocaleDateString()
            : "-",
        })),

    ongoingCourses: (state) =>
      state.courses
        .filter((c) => c.status === "ongoing")
        .map((c) => ({
          ...c,
          formattedStart: c.course_start_at
            ? c.course_start_at.toLocaleDateString()
            : "-",
          formattedEnd: c.course_end_at
            ? c.course_end_at.toLocaleDateString()
            : "-",
        })),
  },

  mutations: {
    SET_COURSES(state, courses) {
      state.courses = courses;
    },
  },

  actions: {
    async fetchMyCourses({ commit }) {
      try {
        const res = await axios.get("/student/courses");
        const courses = (res.data.data || []).map((course) => ({
          ...course,
          course_start_at: course.course_start_at
            ? new Date(course.course_start_at)
            : null,
          course_end_at: course.course_end_at
            ? new Date(course.course_end_at)
            : null,
        }));
        commit("SET_COURSES", courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    },
  },
};
