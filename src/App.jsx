
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Signup from './views/pages/Signup'
import Login from './views/pages/Login'
import ProtectedRoute from './views/routes/ProtectedRoute'
import { ToastContainer } from "react-toastify";
import PageNotFound from './views/pages/PageNotFound'
import ChatPage from './views/pages/ChatPage'




const basename = import.meta.env.MODE === "development" ? "/" : `/${import.meta.env.VITE_PUBLIC_URL}`;


function App() {

  return (
    <>

      <BrowserRouter>

        <ToastContainer theme='light' />
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route path='/register' element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          <Route path='*' element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App




