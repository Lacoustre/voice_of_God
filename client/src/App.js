import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home.jsx';
import Donation from './Pages/Donation.jsx';
import QRCodePage from './Pages/QRCode.jsx';
import Ministries from './Pages/Ministries.jsx';
import YouthMinistryPage from './Pages/YouthMinistry.jsx';
import WomensMinistryPage from './Pages/WomensMinistry.jsx';
import CharityFoundationPage from './Pages/CharityFoundation.jsx';
import ChosenGenerationPage from './Pages/ChosenGeneration.jsx';
import MensMinistryPage from './Pages/MensMinistry.jsx';
import ChildrensMinistryPage from './Pages/ChildrensMinistry.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/qr" element={<QRCodePage />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/youth-ministry" element={<YouthMinistryPage />} />
        <Route path="/womens-ministry" element={<WomensMinistryPage />} />
        <Route path="/charity-foundation" element={<CharityFoundationPage />} />
        <Route path="/chosen-generation" element={<ChosenGenerationPage />} />
        <Route path="/mens-ministry" element={<MensMinistryPage />} />
        <Route path="/childrens-ministry" element={<ChildrensMinistryPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;
