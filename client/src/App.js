import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PersonalPage from './pages/PersonalPage';
// import AdminPage from './pages/AdminPage';
import NotificationPage from './pages/NotificationPage';
import ProductDashboard from './pages/ProductDashboard';
import OrderDashboard from './pages/OrderDashboard';
import NotificationDashboard from './pages/NotificationDashboard';

function App() {  
  return (
    <UserContextProvider>
      <Routes>
        <Route path={'/'}>
          <Route index element={<HomePage />} />
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/register'} element={<RegisterPage />} />
          <Route path={'/personal'} element={<PersonalPage />} />
          <Route path={'/notifications'} element={<NotificationPage />} />
          {/* <Route path={'/dashboard'} element={<AdminPage />}> */}
          <Route path={'/dashboard'}>
            <Route path={'/dashboard/orders'} element={<OrderDashboard />} />
            <Route path={'/dashboard/products'} element={<ProductDashboard />} />
            <Route path={'/dashboard/notifications'} element={<NotificationDashboard />} />
          </Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
