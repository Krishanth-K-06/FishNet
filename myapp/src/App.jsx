// App.jsx

import { Routes, Route } from 'react-router-dom';
import FishMap from './Components/fishpage';
import Profile from './Components/profile';
import Lee from './Buy/Lee'; 
import Landing from './pages/Landing';
import FishDetail from './Buy/FishDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Afterlogin from './pages/Afterlogin';
import './index.css'; 


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path = "/fishmap" element={<FishMap />} />
      <Route path="/proe" element={<Profile />} />
      <Route path="/visit" element={<Lee/>} />
      <Route path="/fish/:name" element={<FishDetail />} />
      <Route path ="/afterlogin" element={<Afterlogin />} />

  <Route path="/login" element={<Login/>} />
  <Route path="/register" element={<Register/>} />

    </Routes>
  );
}

export default App;
