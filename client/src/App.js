import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home';
import Join from './Pages/Join';
import Donation from './Pages/Donation';
import QRCodePage from './Pages/QRCode';
import Ministries from './Pages/Ministries';
import YouthMinistryPage from './Pages/YouthMinistry';
import WomensMinistryPage from './Pages/WomensMinistry';
import CharityFoundationPage from './Pages/CharityFoundation';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/qr" element={<QRCodePage />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/youth-ministry" element={<YouthMinistryPage />} />
        <Route path="/womens-ministry" element={<WomensMinistryPage />} />
        <Route path="/charity-foundation" element={<CharityFoundationPage />} />
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
