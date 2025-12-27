import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Contacts from '@/views/Contacts.vue'

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
    ],
})

export default router
