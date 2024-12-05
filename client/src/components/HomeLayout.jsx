import Footer from "./Footer";
import Navbar from "./Navbar";


const HomeLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer/>
    </>
  );
};

export default HomeLayout;
