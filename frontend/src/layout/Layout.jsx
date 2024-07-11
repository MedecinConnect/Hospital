
import Header from "../componnents/Header/Header";
import Footer from "../componnents/Footer/Footer";
import Router from "../routes/Router";



const Layout = () => {
  return <>
  <Header/>
  <main>
    <Router/>
  </main>
  <Footer/>
  
  </>
}
export default Layout