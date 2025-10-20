import Recat from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";

function App()
{
  return(
    <Router>
      <Navbar/>
      <Routes>
     <Route path="/" element={<Home/>}/>
     <Route path="/feedback" element={<Feedbackpage/>}/>
     <Route path="/complaints" element={<ComplaintPage/>}/>
      </Routes>
    </Router>
  )
}
export default App;