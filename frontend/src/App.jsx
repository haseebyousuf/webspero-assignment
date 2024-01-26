import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Signin from './screens/Signin';
import Dashboard from './screens/Dashboard';
import Signup from './screens/Signup';
import NearbyUsers from './screens/NearbyUsers';
import UpdateProfile from './screens/UpdateProfile';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

function App() {
  const isAuth = useSelector((state) => state.global.user);
  return (
    <div className='className="w-screen h-screen"'>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={isAuth ? <Navigate to={'/dashboard'} /> : <Signin />}
          />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<Navigate to='/' />} />
          {isAuth && (
            <Route element={<Dashboard />}>
              <Route path='/dashboard' element={<NearbyUsers />} />
              <Route path='/update-profile' element={<UpdateProfile />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
