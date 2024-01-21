import { RouteObject, useRoutes } from 'react-router-dom'
import { Landing } from '../pages/Landing'
import { publicRoutes } from './public'
import { protectedRoutes } from './protected'


export const AppRoutes = () => {
    const commonRoutes: RouteObject[] = [
        { 
            path: '/landing',
            element: <Landing />,
     }
    ]

    const routes = true ? protectedRoutes : publicRoutes

    const element = useRoutes([...commonRoutes, ...routes])

    return  <>{element}</>
}