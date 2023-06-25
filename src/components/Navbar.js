import React, {useEffect} from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";

  
const Navbar = () => {
    let location = useLocation();
    let navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/login');
    }
    useEffect(() => {
      }, [location]);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">POS</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/"? "active": ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/bill"? "active": ""}`} to="/bill">Billing</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/billhistory"? "active": ""}`} to="/billhistory">Bills History</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/billdisplay"? "active": ""}`} onClick={()=>window.reload()} to="/billdisplay">Bills Search</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/customer"? "active": ""}`} to="/customer">Customers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/product"? "active": ""}`} to="/product">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/category"? "active": ""}`} to="/category">Category</Link>
                        </li>
                    </ul>
                    {!localStorage.getItem('token') && <form>
                    <Link className="btn btn-primary mx-1" to="/login">Login</Link>
                    {/* <Link className="btn btn-primary mx-1" to="/Register">Register</Link> */}
                    </form>}
                    { localStorage.getItem('token')&&<button onClick={handleLogout} className="btn btn-primary">Log Out</button>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar