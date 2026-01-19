import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ThriftStoresList from './pages/ThriftStoresList.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ThriftStore from './pages/ThriftStore.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home /> }/>
        <Route path="/stores" element={ <ThriftStoresList /> }/>
        <Route path="/stores/:id" element={ <ThriftStoresList /> }/>
        <Route path="/thriftStore" element={ <ThriftStore /> }/>
        <Route path="/*" element={ <ErrorPage /> }/>
      </Routes>
    </BrowserRouter>
  )
}