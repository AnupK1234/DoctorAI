import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomeLayout from "./components/HomeLayout";
import Contact from "./pages/Contact";

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
