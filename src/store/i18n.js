import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const messages = {
  en: {
    dashboard: "Dashboard",
    addStudent: "Add Student",
    deleteStudent: "Delete Student",
    exportStudent: "Export Students",
    totalStudents: "Total Students",
    name: "Name",
    phone: "Phone",
    address: "Address",
    branch: "Branch",
    subjects: "Subjects",
    status: "Status",
    complete: "Complete",
    pending: "Pending",
    viewAllStudents: "View and manage all student records.",
  },
  my: {
    dashboard: "ဒက်ရှ်ဘုတ်",
    addStudent: "ကျောင်းသားအသစ်ထည့်ရန်",
    deleteStudent: "ကျောင်းသားဖျက်ရန်",
    exportStudent: "ကျောင်းသားအချက်အလက်ထုတ်ရန်",
    totalStudents: "ကျောင်းသားစုစုပေါင်း",
    name: "နာမည်",
    phone: "ဖုန်းနံပါတ်",
    address: "လိပ်စာ",
    branch: "ဌာန",
    subjects: "ဘာသာရပ်များ",
    status: "အခြေအနေ",
    complete: "ပြီးစီးသည်",
    pending: "မပြီးစီးသေးပါ",
    viewAllStudents: "ကျောင်းသားအချက်အလက်အားလုံးကို ကြည့်ရှုစီမံရန်။",
  },
};

export default new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
});
