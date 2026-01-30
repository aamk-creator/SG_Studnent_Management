<template>
  <v-container fluid class="white py-8 px-10">
    <v-row align="center" class="mb-10">
      <v-col>
        <div class="d-flex align-center mb-2">
          <v-chip color="light-green lighten-5" text-color="light-green darken-3" small class="font-weight-black px-4">
            LIVE SYSTEM STATUS
          </v-chip>
        </div>
        <h1 class="text-h4 font-weight-black grey--text text--darken-4">
          Academic <span class="light-green--text text--darken-1">Performance</span>
        </h1>
      </v-col>
      <v-col cols="auto">
        <v-btn depressed class="light-green darken-1 rounded-lg px-6 white--text font-weight-bold" height="48">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          New Admission
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3" v-for="(stats, i) in summaryStats" :key="i">
        <v-card outlined class="rounded-xl pa-5 border-mint shadow-soft">
          <div class="d-flex justify-space-between align-center mb-4">
            <v-avatar :color="stats.color + ' lighten-5'" size="44">
              <v-icon :color="stats.color + ' darken-1'" size="24">{{ stats.icon }}</v-icon>
            </v-avatar>
            <v-chip x-small color="grey lighten-4" class="grey--text text--darken-1 font-weight-bold">
              {{ stats.period }}
            </v-chip>
          </div>
          <div>
            <div class="text-h4 font-weight-black grey--text text--darken-4 mb-1">{{ stats.value }}</div>
            <div class="caption font-weight-bold grey--text text--lighten-1 text-uppercase tracking-widest">
              {{ stats.title }}
            </div>
          </div>
          <v-progress-linear
            :value="stats.progress"
            :color="stats.color + ' lighten-2'"
            height="4"
            class="mt-4 rounded-pill"
          ></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-10">
      <v-col cols="12" md="8">
        <v-card outlined class="rounded-xl pa-6 border-mint">
          <div class="d-flex align-center justify-space-between mb-8">
            <span class="text-h6 font-weight-black grey--text text--darken-3">Student Growth</span>
            <div class="d-flex border-sm rounded-lg overflow-hidden">
              <v-btn x-small depressed tile class="grey lighten-5 grey--text">Day</v-btn>
              <v-btn x-small depressed tile color="light-green lighten-4" class="light-green--text text--darken-3">Month</v-btn>
            </div>
          </div>
          
          <div class="d-flex align-end justify-space-around" style="height: 220px;">
            <div v-for="(bar, i) in enrollmentData" :key="i" class="text-center">
              <v-hover v-slot="{ hover }">
                <div 
                  class="light-green transition-all rounded-t-xl" 
                  :class="hover ? 'light-green darken-1' : 'light-green lighten-2'"
                  :style="{ height: bar.height + 'px', width: '40px' }"
                ></div>
              </v-hover>
              <div class="caption mt-3 font-weight-black blue-grey--text text--lighten-2">{{ bar.month }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined class="rounded-xl pa-6 border-mint">
          <span class="text-h6 font-weight-black grey--text text--darken-3 d-block mb-6">Course Load</span>
          <div v-for="(course, i) in courseDist" :key="i" class="mb-6">
            <div class="d-flex justify-space-between mb-2 align-center">
              <span class="body-2 font-weight-bold grey--text text--darken-2">{{ course.name }}</span>
              <span class="caption font-weight-black light-green--text text--darken-3">{{ course.pct }}%</span>
            </div>
            <v-progress-linear 
              :value="course.pct" 
              color="light-green lighten-1" 
              background-color="grey lighten-4"
              rounded 
              height="10"
            ></v-progress-linear>
          </div>
          <v-btn block text color="light-green darken-2" class="rounded-lg mt-2 font-weight-bold">
            View Department Details
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex align-center mb-6">
      <v-icon color="light-green darken-2" class="mr-2">mdi-layers-outline</v-icon>
      <span class="text-h6 font-weight-black grey--text text--darken-3">Recent Enrollments</span>
      <v-spacer></v-spacer>
      <v-btn small outlined color="grey lighten-1" class="rounded-pill grey--text text--darken-2 px-4 font-weight-bold">
        View All
      </v-btn>
    </div>
    
    <v-card outlined class="rounded-xl border-mint overflow-hidden">
      <StudentTable />
    </v-card>
  </v-container>
</template>

<script>
import StudentTable from '@/components/student/StudentTable.vue'

export default {
  name: 'DashboardPage',
  components: { StudentTable },
  data() {
    return {
      summaryStats: [
        { title: 'Total Students', value: '1,284', icon: 'mdi-account-group-outline', color: 'light-green', progress: 75, period: 'Monthly' },
        { title: 'Active Courses', value: '42', icon: 'mdi-book-open-outline', color: 'light-blue', progress: 40, period: 'Annual' },
        { title: 'Attendance', value: '94.2%', icon: 'mdi-calendar-check-outline', color: 'amber', progress: 94, period: 'Weekly' },
        { title: 'New Leads', value: '+12', icon: 'mdi-trending-up', color: 'deep-orange', progress: 20, period: 'Daily' },
      ],
      enrollmentData: [
        { month: 'JAN', height: 110 }, { month: 'FEB', height: 160 },
        { month: 'MAR', height: 90 }, { month: 'APR', height: 200 },
        { month: 'MAY', height: 150 }, { month: 'JUN', height: 170 },
      ],
      courseDist: [
        { name: 'Computer Science', pct: 85 },
        { name: 'Business Admin', pct: 60 },
        { name: 'Digital Arts', pct: 35 },
      ]
    }
  }
}
</script>

<style scoped>
.border-mint {
  border: 1px solid #F1F8E9 !important; /* Very light mint border */
}
.border-sm {
  border: 1px solid #ECEFF1;
}
.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
}
.tracking-widest {
  letter-spacing: 2px !important;
}
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.v-card:hover {
  border-color: #DCEDC8 !important; /* light-green lighten-4 */
}
</style>