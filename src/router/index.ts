import Vue from 'vue'
import Router from 'vue-router'
import cruiseBook from '../components/cruise-book.vue'
import cruiseMap from '../components/cruise-map.vue'
import cruiseMain from '../components/cruise-main.vue'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'cruiseMain',
            component: cruiseMain
        },
        {
            path: '/cruiseMap',
            name: 'cruiseMap',
            component: cruiseMap,
            props: true
        },
        {
            path: '/cruiseBook',
            name: 'cruiseBook',
            component: cruiseBook,
            props: true
        }
    ]
})

export default router;