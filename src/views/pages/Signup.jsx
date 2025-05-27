import React, { useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import CustomInputGroup from '../../reusable-components/CustomInputGroup'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import sha256 from 'sha256';
import { toast } from 'react-toastify'





const Signup = () => {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupInputs, setSignupInputs] = useState({})
  const [errorMessage, setErrorMessage] = useState({
    firstNameErrorMessage: "",
    lastNameErrorMessage: "",
    emailErrorMessage: "",
    phoneNumberErrorMessage: "",
    passwordErrorMessage: "",
    confirmPasswordErrorMessage: ""
  })
  const [error, setError] = useState({
    firstNameError: false,
    lastNameError: false,
    emailError: false,
    phoneNumberError: false,
    passwordError: false,
    confirmPasswordError: false
  })

  const handleShowPassword = (name) => {
    switch (name) {
      case "password":
        setShowPassword(!showPassword)
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword)
        break;
      default:
        console.log("default")
        break;
    }
  }

  const handleSignupInputs = (e) => {
    const { name, value } = e.target
    const maxLengths = {
      phoneNumber: 10
    };
    if (maxLengths[name] && value.length > maxLengths[name]) return;

    setSignupInputs((prevState) => (
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSignup();
    }
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const minLengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLengthCheck && uppercaseCheck && specialCharCheck;
  };


  const handleSignup = async () => {
    let hasError = false;

    const firstName = signupInputs?.firstName?.trim() || "";
    const lastName = signupInputs?.lastName?.trim() || "";
    const email = signupInputs?.email?.trim() || "";
    const phone = signupInputs?.phoneNumber?.trim() || "";
    const password = signupInputs?.password?.trim() || "";
    const confirmPassword = signupInputs?.confirmPassword?.trim() || "";

    if (!firstName) {
      setError(prev => ({ ...prev, firstNameError: true }));
      setErrorMessage(prev => ({ ...prev, firstNameErrorMessage: "First name should not be empty" }));
      hasError = true;
    }

    if (!lastName) {
      setError(prev => ({ ...prev, lastNameError: true }));
      setErrorMessage(prev => ({ ...prev, lastNameErrorMessage: "Last name should not be empty" }));
      hasError = true;
    }

    if (!email) {
      setError(prev => ({ ...prev, emailError: true }));
      setErrorMessage(prev => ({ ...prev, emailErrorMessage: "Email should not be empty" }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setError(prev => ({ ...prev, emailError: true }));
      setErrorMessage(prev => ({ ...prev, emailErrorMessage: "Please enter a valid email" }));
      hasError = true;
    }

    if (!phone) {
      setError(prev => ({ ...prev, phoneNumberError: true }));
      setErrorMessage(prev => ({ ...prev, phoneNumberErrorMessage: "Phone number should not be empty" }));
      hasError = true;
    } else if (!/^\d{10}$/.test(phone)) {
      setError(prev => ({ ...prev, phoneNumberError: true }));
      setErrorMessage(prev => ({ ...prev, phoneNumberErrorMessage: "Phone number should be 10 digits" }));
      hasError = true;
    }

    if (!password) {
      setError(prev => ({ ...prev, passwordError: true }));
      setErrorMessage(prev => ({ ...prev, passwordErrorMessage: "Password should not be empty" }));
      hasError = true;
    } else if (!validatePassword(password)) {
      setError(prev => ({ ...prev, passwordError: true }));
      setErrorMessage(prev => ({ ...prev, passwordErrorMessage: "Password must be at least 8 characters & contain at least one uppercase & one special character" }));
      hasError = true;
    }

    if (!confirmPassword) {
      setError(prev => ({ ...prev, confirmPasswordError: true }));
      setErrorMessage(prev => ({ ...prev, confirmPasswordErrorMessage: "Confirm password should not be empty" }));
      hasError = true;
    } else if (confirmPassword !== password) {
      setError(prev => ({ ...prev, confirmPasswordError: true }));
      setErrorMessage(prev => ({ ...prev, confirmPasswordErrorMessage: "Confirm password should match the password" }));
      hasError = true;
    }

    if (hasError) {
      console.error("Validation failed: Fields cannot be empty or invalid");
      return;
    }

    try {
      const payload = {
        "firstname": signupInputs?.firstName?.trim(),
        "lastname": signupInputs?.lastName?.trim(),
        "email": signupInputs?.email?.trim(),
        "password": sha256(signupInputs?.password?.trim()),
        "phone_number": `+91${signupInputs?.phoneNumber?.trim()}`,
        "allowed_domain": import.meta.env.VITE_DOMAIN
      };

      const response = await axiosInstance.post('/signup', payload);
      if (response.data.error_code === 200) {
        navigate("/");
        toast.success(response.data.message);
      } else if (response.data.error_code === 409) {
        toast.warn(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(response.data.message);
    }
  };


  return (
    <section className='layout'>
      <Header />
      <Container className='main-section' fluid >
        <Container className='d-flex flex-column justify-content-center align-items-center h-100' >
          <Row className="signup-container px-3 px-md-5 py-3 rounded-3 col-12 col-md-8 col-lg-8 col-xl-8 " >
            <Col className='my-5 '>
              <h3 className='mb-5 text-center main-text'>Register</h3>
              <div className="row">
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInput
                    inputLabel="First name"
                    autoFocus={true}
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    onChange={handleSignupInputs}
                    value={signupInputs?.firstName || ""}
                    className="mb-2"
                  />
                  {
                    error.firstNameError &&
                    <p className="text-danger">{errorMessage.firstNameErrorMessage}</p>
                  }
                </div>
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInput
                    inputLabel="Last name"
                    autoFocus={true}
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    onChange={handleSignupInputs}
                    value={signupInputs?.lastName || ""}
                    className="mb-2"
                  />
                  {
                    error.lastNameError &&
                    <p className="text-danger">{errorMessage.lastNameErrorMessage}</p>
                  }
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInput
                    inputLabel="Email"
                    autoFocus={true}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    onChange={handleSignupInputs}
                    value={signupInputs?.email || ""}
                    className="mb-2"
                  />
                  {
                    error.emailError &&
                    <p className="text-danger">{errorMessage.emailErrorMessage}</p>
                  }
                </div>
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInput
                    inputLabel="Phone number"
                    autoFocus={true}
                    type="number"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    onChange={handleSignupInputs}
                    value={signupInputs?.phoneNumber || ""}
                    className="mb-2"
                  />
                  {
                    error.phoneNumberError &&
                    <p className="text-danger">{errorMessage.phoneNumberErrorMessage}</p>
                  }
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInputGroup
                    inputLabel="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    onClick={() => handleShowPassword("password")}
                    showPassword={showPassword}
                    placeholder="Enter password"
                    onChange={handleSignupInputs}
                    value={signupInputs?.password || ""}
                    className="mb-2"
                  />
                  {
                    error.passwordError &&
                    <p className="text-danger">{errorMessage.passwordErrorMessage}</p>
                  }
                </div>
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInputGroup
                    inputLabel="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    onClick={() => handleShowPassword("confirmPassword")}
                    showPassword={showConfirmPassword}
                    placeholder="Enter confirm password"
                    onChange={handleSignupInputs}
                    value={signupInputs?.confirmPassword || ""}
                    className="mb-2"
                    onKeyDown={handleKeyDown}
                  />
                  {
                    error.confirmPasswordError &&
                    <p className="text-danger">{errorMessage.confirmPasswordErrorMessage}</p>
                  }
                </div>
              </div>

              <CustomButton
                buttonName="Register"
                className="btn custom-button-sm mt-5 mx-auto d-block w-100 py-2"
                onClick={handleSignup}
              />
              <p className='mt-4 text-center register-login-option-text fs-14'>
                Already have an account?
                <Link to="/" className='signup-login-navigation-link'> Log in</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </Container >

      <Footer isFooterText={true} />

    </section>
  )
}

export default Signup

