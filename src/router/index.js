import VueRouter from 'vue-router';

const routes =[
    {
        path:'/',
        name:'login',
        component:()=>import('../components/LoginPage1')
    },
    {
        path:'/Index',
        name:'index',
        component:()=>import('../components/Index'),
        children:[
            {
                path:'/Home',
                name:'Home',
                meta:{
                    title:'首页'
                },
                component:()=>import('../components/Home'),
            },
            {
                path:'/Admin',
                name:'admin',
                meta:{
                    title:'管理员管理'
                },
                component:()=>import('../components/admin/AdminManage.vue'),
            },
            {
                path:'/User',
                name:'user',
                meta:{
                    title:'用户管理'
                },
                component:()=>import('../components/user/UserManage.vue'),
            },
            {
                path:'/Storage',
                name:'storage',
                meta:{
                    title:'仓库管理'
                },
                component:()=>import('../components/storage/StorageManage.vue'),
            },
        ]
    }
]
const router = new VueRouter({
    mode:'history',
    routes
})

new VueRouter({
    mode: 'history',
    routes: []
}).matcher

export function resetRouter() {
    router.matcher = new VueRouter({
        mode:'history',
        routes: []
    }).matcher
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export  default router;