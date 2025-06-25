import { TopBar, NavBar } from '../components'
import { useLocation } from 'react-router-dom';

const AppLayout = ({children}) => {
  const location = useLocation();

  const hideNavBarRoutes = [
    "/users/login",
    "/users/register",
    "/profile",
    "/profile/edit/:id",
  ];

  const hideTopBarRoutes = [
    "/users/login",
    "/users/register",
    "/profile",
    "/profile/edit/:id",
  ];

  return (

    <div className='app-wrapper'>
      {!hideTopBarRoutes.includes(location.pathname) && <TopBar />}
     
      <div className='content'>{children}</div>
      
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
    </div>
  )
}

export {AppLayout}
