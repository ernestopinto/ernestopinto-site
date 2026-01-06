import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Contacts from '@/views/Contacts.vue'
import BlogPost from '@/views/BlogPost.vue'
import Projects from "@/views/Projects.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: Contacts,
        },
        {
            path: '/projects',
            name: 'projects',
            component: Projects,
        },
        {
            path: '/blog/:id',
            name: 'blog-post',
            component: BlogPost,
        },
    ],
    scrollBehavior(...args) {
        const savedPosition = args[2]
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

export default router
