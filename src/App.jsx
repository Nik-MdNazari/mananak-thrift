import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ThriftStoresList from './pages/ThriftStoresList.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ThriftStore from './pages/ThriftStore.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import { AuthProvider } from './components/AuthProvider.jsx';
import AppLayout from './layouts/AppLayout.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <AppLayout>
          <Routes>
            <Route path="/" element={ <Home /> }/>
            <Route path="/login" element={ <Login /> }/>
            <Route path="/profile" element={ <Profile /> }/>
            <Route path="/stores" element={ <ThriftStoresList /> }/>
            <Route path="/stores/:id" element={ <ThriftStore /> }/>
            <Route path="/*" element={ <ErrorPage /> }/>
          </Routes>
      </AppLayout>
    </BrowserRouter>
  </AuthProvider>
  )
}