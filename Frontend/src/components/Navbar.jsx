import React from "react";
import {Link} from "react-router-dom"

const Navbar =()=>
{
 return(
<nav>
    <Link to="/">Home</Link>|
    <Link to="/feedback">Feedback</Link>|
    <Link to="/complaints">Complaints</Link>|
    
</nav>
 );
}
export default Navbar