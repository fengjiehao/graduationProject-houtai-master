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
        name:'teacherSchedule',path:'/teacherSchedule',component:teacherSchedule,
      },{
        name:'teacherAttendanceManagement',path:'/teacherAttendanceManagement',component:teacherAttendanceManagement,
      },{
        name:'teacherAttendanceDetail',path:'/teacherAttendanceDetail',component:teacherAttendanceDetail,
      },{
        name:'teacherAttendanceStatistics',path:'/teacherAttendanceStatistics',component:teacherAttendanceStatistics,
      },{
        name:'teacherDoingAttendance',path:'/teacherDoingAttendance',component:teacherDoingAttendance,
      },
      // 学生帐号后台系统
      {
        name:'studentAttendanceDetail',path:'/studentAttendanceDetail',component:studentAttendanceDetail,
      },{
        name:'studentSchedule',path:'/studentSchedule',component:studentSchedule,
      },
      // 管理员帐号后台系统
      {
        name:'adminTeacherUser',path:'/adminTeacherUser',component:adminTeacherUser,
      },{
        name:'adminStudentUser',path:'/adminStudentUser',component:adminStudentUser,
      },{
        name:'adminChangePwd',path:'/adminChangePwd',component:adminChangePwd,
      },{
        name:'adminClassTimeManagement',path:'/adminClassTimeManagement',component:adminClassTimeManagement,
      },{
        name:'adminCollegeManagement',path:'/adminCollegeManagement',component:adminCollegeManagement,
      },{
        name:'adminMajorManagement',path:'/adminMajorManagement',component:adminMajorManagement,
      },{
        name:'adminClassManagement',path:'/adminClassManagement',component:adminClassManagement,
      },
    ]
  },
  {path:'/',component:login,},
  {name:'login',path:'/login',component:login,},

]
