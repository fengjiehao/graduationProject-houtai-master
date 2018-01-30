import login from './page/login/login.vue'
import mainPage from './page/mainPage/mainPage.vue'
// 教师后台系统
import teacherSchedule from './page/teacherSchedule/teacherSchedule.vue'
import teacherAttendanceManagement from './page/teacherAttendanceManagement/teacherAttendanceManagement.vue'
import teacherAttendanceDetail from './page/teacherAttendanceDetail/teacherAttendanceDetail.vue'
import teacherAttendanceStatistics from './page/teacherAttendanceStatistics/teacherAttendanceStatistics.vue'
import teacherDoingAttendance from './page/teacherDoingAttendance/teacherDoingAttendance.vue'
// 学生后台系统
import studentAttendanceDetail from './page/studentAttendanceDetail/studentAttendanceDetail.vue'
import studentSchedule from './page/studentSchedule/studentSchedule.vue'
// 管理员后台系统
import adminTeacherUser from './page/adminTeacherUser/adminTeacherUser.vue'
import adminStudentUser from './page/adminStudentUser/adminStudentUser.vue'
import adminClassTimeManagement from './page/adminClassTimeManagement/adminClassTimeManagement.vue'
import adminCollegeManagement from './page/adminCollegeManagement/adminCollegeManagement.vue'
import adminMajorManagement from './page/adminMajorManagement/adminMajorManagement.vue'
import adminClassManagement from './page/adminClassManagement/adminClassManagement.vue'
import adminChangePwd from './page/adminChangePwd/adminChangePwd.vue'

export default [
  {
    name:'mainPage', path: '/mainPage', component: mainPage,
    children: [
      // 教师帐号后台系统
      {
        path:'/teacherSchedule',component:teacherSchedule,
      },{
        path:'/teacherAttendanceManagement',component:teacherAttendanceManagement,
      },{
        path:'/teacherAttendanceDetail',component:teacherAttendanceDetail,
      },{
        path:'/teacherAttendanceStatistics',component:teacherAttendanceStatistics,
      },{
        path:'/teacherDoingAttendance',component:teacherDoingAttendance,
      },
      // 学生帐号后台系统
      {
        path:'/studentAttendanceDetail',component:studentAttendanceDetail,
      },{
        path:'/studentSchedule',component:studentSchedule,
      },
      // 管理员帐号后台系统
      {
        path:'/adminTeacherUser',component:adminTeacherUser,
      },{
        path:'/adminStudentUser',component:adminStudentUser,
      },{
        path:'/adminChangePwd',component:adminChangePwd,
      },{
        path:'/adminClassTimeManagement',component:adminClassTimeManagement,
      },{
        path:'/adminCollegeManagement',component:adminCollegeManagement,
      },{
        path:'/adminMajorManagement',component:adminMajorManagement,
      },{
        path:'/adminClassManagement',component:adminClassManagement,
      },
    ]
  },
  {path:'/',component:login,},
  {path:'/login',component:login,},

]
