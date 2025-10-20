import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import ContinentSelect from '../components/ContinentSelect.vue'
import GeoMap from '../components/GeoMap.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/continents',
    name: 'Continents',
    component: ContinentSelect
  },
  {
    path: '/play/:continent',
    name: 'Play',
    component: GeoMap,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router