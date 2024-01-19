import { RouteObject, useRoutes } from 'react-router-dom'
import { Landing } from '../pages/Landing'
import { publicRoutes } from './public'


export const AppRoutes = () => {
    const commonRoutes: RouteObject[] = [
        { 
            path: '/landing',
            element: <Landing />
     }
    ]

    const element = useRoutes([...commonRoutes, ...publicRoutes])

    return  <>{element}</>
}