import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Contacts from '@/views/Contacts.vue'
import BlogPost from '@/views/BlogPost.vue'

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
            path: '/blog/:id',
            name: 'blog-post',
            component: BlogPost,
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

export default router
