
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Register from './views/pages/Register'
import Login from './views/pages/Login'
import ProtectedRoute from './views/routes/ProtectedRoute'
import { ToastContainer } from "react-toastify";
import PageNotFound from './views/pages/PageNotFound'
import ChatPage from './views/pages/ChatPage'
import ForgotPassword from './views/pages/ForgotPassword';
import ResetPassword from './views/pages/ResetPassword';
import VerifyPhone from './views/pages/VerifyPhone';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import OTPVerification from './views/pages/OTPVerification';


const basename = import.meta.env.MODE === "development" ? "/" : `/${import.meta.env.VITE_PUBLIC_URL}`;


function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer theme='light' />
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/continue-with-mobile' element={<VerifyPhone />} />
          {/* <Route path='/verify-otp' element={<OTPVerification />} /> */}
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App




