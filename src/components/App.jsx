import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import Offers from "./Offers";
import Profile from "./Profile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Header from "./Header";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/offers" element={<Offers />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
