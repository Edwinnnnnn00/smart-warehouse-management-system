import { BrowserRouter, Routes, Route } from "react-router-dom";
import CameraPage from "./camera";
import AboutPage from "./about";
import TemperaturePage from "./temperature";
import RecordsPage from "./records";
import HomePage from "./home";

const RoutesMap = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/temperature" element={<TemperaturePage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesMap;
