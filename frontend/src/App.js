import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './sign-in/SignIn.js'
import SignUp from './sign-up/SignUp.js'
import RefreshHandler from './RefreshHandler';
import { useState } from 'react';
import Home from './Home/Home.js'
import Saved from './Home/components/Saved.js'
import Add from './Home/components/Add.js'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/signin" />
  }
  return (
    <div className="App">
      <Router> {/* Wrap everything inside Router */}
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/home/' element={<PrivateRoute element={<Home currPage='/saved' />} />} >
            <Route index element={<Saved />} /> {/* Default route: /home */}
            <Route path="saved" element={<Saved />} />
            <Route path="add" element={<Add />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
