import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = (props) => {

  const [credentials, setCred]=useState({name:'', username:'', password:''})
  const [confirmpassword, setConfirm]=useState('');
  let navigate=useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/user/add", {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({name:credentials.name, username:credentials.username, password:credentials.password})
    });
    const json = await response.json();
    console.log(json);
    localStorage.setItem('token', json.authtoken);
    navigate('/')
  }

  const onChange = (e)=>{
    setCred({...credentials, [e.target.name]:e.target.value})
  }
  const onChangePassword = (e)=>{
    setConfirm(e.target.value)
  }
  return (
    <section className="vh-150 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{borderRadius:1+'rem'}}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                  <p className="text-white-50 mb-5">
                    Please register your name, email and password
                  </p>
                  <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                  <label className="form-label" htmlFor="typeNameX">
                      Name
                    </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    onChange={onChange}
                    value={credentials.name}
                  />
                  </div>
                    <label className="form-label" htmlFor="typeEmailX">
                      Username
                    </label>
                  <div className="form-outline form-white mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={credentials.username}
                    onChange={onChange}
                  />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typePasswordX">
                      Password
                    </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                  />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typePasswordX">
                      Confirm Password
                    </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmpassword"
                    value={confirmpassword}
                    onChange={onChangePassword}
                  />
                  </div>

                  <button
                    disabled={credentials.password!==confirmpassword}
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                  >
                    Register
                  </button>
                  </form>
                  {/* <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white">
                      <i className="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-google fa-lg"></i>
                    </a>
                  </div> */}
                </div>

                <div>
                  <p className="mb-0">
                    Already Registered?{" "}
                    <Link to="/Login" className="text-white-50 fw-bold">
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
