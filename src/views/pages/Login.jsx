import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import CustomInputGroup from '../../reusable-components/CustomInputGroup'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import sha256 from 'sha256';
import CustomSpinner from '../../reusable-components/CustomSpinner'
import axios from 'axios'


const Login = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState("")
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

  useEffect(() => {
    const phone = sessionStorage.getItem("phone_number");
    const token = sessionStorage.getItem("accessToken");

    if (phone || token) {
      sessionStorage.removeItem("phone_number");
      sessionStorage.removeItem("accessToken");
    }
  }, []);



  const handleShowPassword = (name) => {
    switch (name) {
      case "password":
        setShowPassword(!showPassword)
        break;
      default:
        break;
    }
  }

  const handleLoginInputs = (e) => {
    const { name, value } = e.target
    const maxLengths = {
      phoneNumber: 10
    };

    if (maxLengths[name] && value.length > maxLengths[name]) return;

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

    if (loginInputs?.phoneNumber && loginInputs?.phoneNumber?.length < 10) {
      setErrorMessage(prevState => ({ ...prevState, phoneNumberErrorMessage: "Phone number should not be less than 10 digits" }));
    }

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
      return;
    }

    try {
      setLoading(true)

      const phoneNumber = `+91${loginInputs.phoneNumber}`;
      const password = sha256(loginInputs?.password?.trim());

      const encodedAuth = btoa(`${phoneNumber}:${password}`);
      const basicAuth = "Basic " + encodedAuth;

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, null, {
        headers: {
          Authorization: basicAuth,
          domain: import.meta.env.VITE_DOMAIN,
        },
      });

      if (response.data.error_code === 200) {
        sessionStorage.setItem("phone_number", `+91${loginInputs.phoneNumber}`)
        sessionStorage.setItem("accessToken", response.data.data.token)
        sessionStorage.setItem("session_token", response.data.data.session_token)
        setTimeout(() => {
          setLoading(false)
          navigate('/chat')
        }, 300);
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

  const handleGoogleSignIn = async () => {
    try {
      setLoadingAction("googleSignIn")
      window.location.href = `${import.meta.env.VITE_REACT_APP_API_URL}/googlelogin`
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };


  return (
    <section className='layout' style={{ height: '100dvh' }}>
      <Header />
      <div className="left-purple-ball">
      </div>
      <div className="left-dark-ball">
      </div>
      <div className="right-purple-ball">
      </div>
      <div className="right-dark-ball">
      </div>
      <Container className='main-section' fluid >
        <Container className='d-flex flex-column justify-content-center align-items-center h-100' >
          <Row className="login-container align-items-center  px-3 px-md-5 py-3  rounded-3 col-12 col-md-8 col-lg-6 col-xl-5 " >
            <Col className='my-4 '>
              <h3 className='mb-5 text-center page-heading-text'>Log In</h3>

              <div className="mb-4">
                <CustomInput
                  inputLabel="Phone number"
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  onChange={handleLoginInputs}
                  value={loginInputs?.phoneNumber || ""}
                  className="mb-2 "
                />

                {
                  error.phoneNumberError &&
                  <p className="text-danger">{errorMessage.phoneNumberErrorMessage}</p>
                }
              </div>

              <div className="mb-4">
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
                  maxLength={16}
                />
                {
                  error.passwordError &&
                  <p className="text-danger">{errorMessage.passwordErrorMessage}</p>
                }
              </div>

              <p className='mt-2 text-end register-login-option-text fs-14'>
                <Link to="/forgot-password" className='text-light fs-14 text-decoration-none'>Forgot password?</Link>
              </p>

              <CustomButton
                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Log in"}
                className={`btn custom-button mt-5 mx-auto d-block w-100 cup ${loading && 'pe-none opacity-50'}`}
                onClick={handleLogin}
              />

              <div className="or-divider mt-4 mb-4 d-flex align-items-center">
                <hr className="flex-grow-1" />
                <span className="px-2">OR</span>
                <hr className="flex-grow-1" />
              </div>

              <div className="google-signin-btn" onClick={handleGoogleSignIn}>
                <button className="google-btn w-100">
                  {
                    loadingAction === "googleSignIn" ? <CustomSpinner variant="dark" size="sm" />
                      :
                      <>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                          alt="google-logo"
                          width={20}
                          height={20}
                        />
                        <span className="google-text ms-2">Sign in with Google</span>
                      </>
                  }

                </button>
              </div>


              <p className='mt-5 mb-0 text-center register-login-option-text fs-14'>
                Don't have an account? &nbsp;
                <Link to="/register" className='signup-login-navigation-link'>Register</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </Container >

    </section>
  )
}

export default Login
