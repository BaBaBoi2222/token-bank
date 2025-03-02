import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './sign-in/SignIn.js'
import SignUp from './sign-up/SignUp.js'
import RefreshHandler from './RefreshHandler';
import { useState } from 'react';
import Home from './home/home.js'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/home" />
  }
  return (
    <div className="App">
      <Router> {/* Wrap everything inside Router */}
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
