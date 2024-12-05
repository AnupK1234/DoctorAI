import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomeLayout from "./components/HomeLayout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomeLayout>
              <Home />
            </HomeLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <HomeLayout>
              <Contact />
            </HomeLayout>
          }
        />
        <Route
          path="/login"
          element={
            <HomeLayout>
              <Login />
            </HomeLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <HomeLayout>
              <Signup />
            </HomeLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
