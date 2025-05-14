import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import CustomInputGroup from '../../reusable-components/CustomInputGroup'
import { Link, replace, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import sha256 from 'sha256';
import CustomSpinner from '../../reusable-components/CustomSpinner'
import Cookies from 'js-cookie';
import axios from 'axios'




const Login = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginInputs, setLoginInputs] = useState({})
  const [errorMessage, setErrorMessage] = useState({
    phoneNumberErrorMessage: "",
    passwordErrorMessage: "",
  })
  const [error, setError] = useState({
    phoneNumberError: false,
    passwordError: false,
  })


  const handleShowPassword = (name) => {
    switch (name) {
      case "password":
        setShowPassword(!showPassword)
        break;
      default:
        console.log("default")
        break;
    }
  }

  const handleLoginInputs = (e) => {
    const { name, value } = e.target
    setLoginInputs((prevState) => (
      { ...prevState, [name]: value }
    ))

    if (value.trim() !== "") {
      setError((prevState) => (
        { ...prevState, [`${name}Error`]: false }
      ));

      setErrorMessage((prevState) => (
        { ...prevState, [`${name}ErrorMessage`]: "" }
      ));
    }

  }


  const handleLogin = async () => {
    let hasError = false;

    if (!loginInputs?.phoneNumber?.trim()) {
      setError(prevState => ({ ...prevState, phoneNumberError: true }));
      setErrorMessage(prevState => ({ ...prevState, phoneNumberErrorMessage: "Phone number should not be empty" }));
      hasError = true;
    }

    if (!loginInputs?.password?.trim()) {
      setError(prevState => ({ ...prevState, passwordError: true }));
      setErrorMessage(prevState => ({ ...prevState, passwordErrorMessage: "Password should not be empty" }));
      hasError = true;
    }

    if (hasError) {
      console.error("Validation failed: Fields cannot be empty");
      return;
    }


    try {
      setLoading(true)

      // const phoneNumber = `+91${loginInputs.phoneNumber}`;
      // const password = sha256(loginInputs?.password?.trim());

      // const encodedAuth = btoa(`${phoneNumber}:${password}`);
      // const basicAuth = "Basic " + encodedAuth;

      // const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, {
      //   headers: {
      //     Authorization: basicAuth,
      //     domain: import.meta.env.VITE_DOMAIN        },
      // });

      // Cookies.set("phone_number", `+91${loginInputs.phoneNumber}`)

      const phoneNumber = `+91${loginInputs.phoneNumber}`;
      const password = sha256(loginInputs?.password?.trim());
      const payload = {
        "password": sha256(loginInputs?.password?.trim()),
        "phone_number": phoneNumber,
      };
      const encodedAuth = btoa(`${phoneNumber}:${password}`);
      const basicAuth = "Basic " + encodedAuth;


      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, payload, {
        headers: {
          Authorization: basicAuth,
          domain: import.meta.env.VITE_DOMAIN
        },
      });


      if (response.data.error_code === 200) {
        Cookies.set("phone_number", `+91${loginInputs.phoneNumber}`)
        setLoading(false)
        Cookies.set("accessToken", response.data.data.token)
        navigate('/chat')
      } else {
        setLoading(false)
        toast.warn(response.data.message);
      }
    } catch (error) {
      setLoading(false)
      toast.error("Login error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <section className='layout'>
      <Header />
      <Container className='main-section' fluid >
        <Container className='d-flex flex-column justify-content-center align-items-center h-100' >
          <Row className="login-container px-3 px-md-5 py-3  rounded-3 col-12 col-md-8 col-lg-6 col-xl-5 " >
            <Col className='my-5 '>
              <h3 className='mb-5 text-center main-text'>Login</h3>

              <div className="mb-3">
                <CustomInput
                  inputLabel="Phone number"
                  autoFocus={true}
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  onChange={handleLoginInputs}
                  value={loginInputs?.phoneNumber || ""}
                  className="mb-2"
                />
                {
                  error.phoneNumberError &&
                  <p className="text-danger">{errorMessage.phoneNumberErrorMessage}</p>
                }
              </div>

              <div className="mb-3">
                <CustomInputGroup
                  inputLabel="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onClick={() => handleShowPassword("password")}
                  showPassword={showPassword}
                  placeholder="Enter password"
                  onChange={handleLoginInputs}
                  value={loginInputs.password || ""}
                  className="mb-2 "
                  onKeyDown={handleKeyDown}
                />
                {
                  error.passwordError &&
                  <p className="text-danger">{errorMessage.passwordErrorMessage}</p>
                }
              </div>
              <CustomButton
                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Log in"}
                className={`btn custom-button-sm mt-5 mx-auto d-block w-100 cup py-2 ${loading && 'pe-none opacity-50'}`}
                onClick={handleLogin}
              />
              <p className='mt-4 text-center register-login-option-text fs-14'>
                Don't have an account?
                <Link to="/register" className='signup-login-navigation-link'> Register</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </Container >

      <Footer isFooterText={true} />

    </section>
  )
}

export default Login
