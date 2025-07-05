import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '../src/pages/Home';
import AuthPage from '../src/pages/Signin';
import ProtectedRoute from '../src/components/ProtectedRoute';
import { ContextProvider } from './context';

function App() {
  return (
    <ContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </ContextProvider>
  );
}

export default App;
