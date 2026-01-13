<template>
  <v-container fluid>
    
    <v-card class="mb-6">
      <v-card-title>
        
      </v-card-title>
      <v-card-text class="text-h6">
        Welcome to the Student Management System Dashboard
      </v-card-text>
    </v-card>

    
    <StudentTable />
  </v-container>
</template>

<script>
import StudentTable from '@/components/student/StudentTable.vue'
import { mapState } from 'vuex'

export default {
  name: 'DashboardPage',
  components: { StudentTable },
  computed: {
    ...mapState({
      totalStudents: state => state.students.length
    })
  }
}
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
  font-size: 18px;
}
</style>
