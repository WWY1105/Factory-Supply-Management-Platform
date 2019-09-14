import Index from './pages/index/index'
import Mine from './pages/mine/mine';
import Mission from './pages/mission/mission';
import Circle from './pages/circle/circle';
export default [
    {
        exact:true,
        path:'/index',
        component:Index
    },
    {
        path:'/mine',
        component:Mine
    },
    {
        path:'/mission',
        component:Mission
    },
    {
        path:'/circle',
        component:Circle
    }
   
]