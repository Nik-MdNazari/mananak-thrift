import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ThriftStoresList from './pages/ThriftStoresList.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ThriftStore from './pages/ThriftStore.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import { AuthProvider } from './components/AuthProvider.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute'
import CreateStore from './pages/CreateStore.jsx';
import EditStore from './pages/EditStore.jsx';
import ToastProvider from './components/ToastProvider.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <AppLayout>
            <Routes>
              <Route path="/" element={ <Home /> }/>
              <Route path="/login" element={ <Login /> }/>
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }/>
              <Route path="/stores" element={ <ThriftStoresList /> }/>
              <Route path="/stores/:id" element={ <ThriftStore /> }/>
              <Route path="/stores/new" element={ <CreateStore /> }/>
              <Route path="/stores/:id/edit" element={<EditStore />} />
              <Route path="/*" element={ <ErrorPage /> }/>
            </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  </ToastProvider>
  )
}