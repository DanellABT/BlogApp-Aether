import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import RegisterView from '../views/Register.vue'
import LoginView from '../views/Login.vue'
import PostDetailView from '../views/PostDetail.vue'
import ProfileView from '../views/Profile.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/login', name: 'Login', component: LoginView }, // 2. Add Login Route
    { path: '/post/:id', name: 'PostDetail', component: PostDetailView },
    { path: '/profile/:username', name: 'Profile', component: ProfileView }
  ]
})

export default router