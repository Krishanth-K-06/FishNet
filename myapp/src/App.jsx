// App.jsx
import { Routes, Route } from 'react-router-dom';
import FishMap from './Components/fishpage';
import Profile from './Components/profile';
import Lee from './Buy/Lee'; 
import Landing from './pages/Landing';
import FishDetail from './Buy/FishDetail';
import './index.css'; 


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path = "/fishmap" element={<FishMap />} />
      <Route path="/proe" element={<Profile />} />
      <Route path="/visit" element={<Lee/>} />
      <Route path="/fish/:name" element={<FishDetail />} />
    </Routes>
  );
}

export default App;
