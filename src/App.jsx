import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ThriftStores from './pages/ThriftStores.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ThriftStore from './pages/ThriftStore.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home /> }/>
        <Route path="/stores" element={ <ThriftStores /> }/>
        <Route path="/*" element={ <ErrorPage /> }/>
        <Route path="/thriftStore" element={ <ThriftStore /> }/>
      </Routes>
    </BrowserRouter>
  )
}