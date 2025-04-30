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
    setSignupInputs((prevState) => (
      { ...prevState, [name]: value }
    ))

    // Remove error messages dynamically when user starts typing
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

  const validateConfirmPassword = (confirmPassword, password) => {
    return confirmPassword === password;
  };


  const handleSignup = async () => {
    let hasError = false;

    if (!signupInputs?.firstName?.trim()) {
      setError((prevState) => ({ ...prevState, firstNameError: true }));
      setErrorMessage((prevState) => ({ ...prevState, firstNameErrorMessage: "First name should not be empty" }));
      hasError = true;
    }
    if (!signupInputs?.lastName?.trim()) {
      setError((prevState) => ({ ...prevState, lastNameError: true }));
      setErrorMessage((prevState) => ({ ...prevState, lastNameErrorMessage: "Last name should not be empty" }));
      hasError = true;
    }
    if (!signupInputs?.email?.trim()) {
      setError((prevState) => ({ ...prevState, emailError: true }));
      setErrorMessage((prevState) => ({ ...prevState, emailErrorMessage: "Email should not be empty" }));
      hasError = true;
    }
    if (signupInputs?.email?.trim()) {
      if (!validateEmail(signupInputs?.email)) {
        setError((prevState) => (
          { ...prevState, emailError: true }
        ))
        setErrorMessage((prevState) => (
          { ...prevState, emailErrorMessage: "Please enter valid email", }
        ))
        hasError = true;
      }
    }
    if (!signupInputs?.phoneNumber?.trim()) {
      setError((prevState) => ({ ...prevState, phoneNumberError: true }));
      setErrorMessage((prevState) => ({ ...prevState, phoneNumberErrorMessage: "Phone number should not be empty" }));
      hasError = true;
    }

    if (!signupInputs?.password?.trim()) {
      setError((prevState) => ({ ...prevState, passwordError: true }));
      setErrorMessage((prevState) => ({ ...prevState, passwordErrorMessage: "Password should not be empty" }));
      hasError = true;
    }

    if (signupInputs?.password) {
      if (!validatePassword(signupInputs?.password)) {
        setError((prevState) => (
          { ...prevState, passwordError: true }
        ))
        setErrorMessage((prevState) => (
          { ...prevState, passwordErrorMessage: "Password must be at least 8 characters & contain at least one uppercase & one special character", }
        ))
        hasError = true;
      }
    }

    if (!signupInputs?.confirmPassword?.trim()) {
      setError((prevState) => ({ ...prevState, confirmPasswordError: true }));
      setErrorMessage((prevState) => ({ ...prevState, confirmPasswordErrorMessage: "Confirm password should not be empty" }));
      hasError = true;
    }

    if (signupInputs?.confirmPassword?.trim()) {
      if (!validateConfirmPassword(signupInputs?.confirmPassword, signupInputs?.password)) {
        setError((prevState) => (
          { ...prevState, confirmPasswordError: true }
        ))
        setErrorMessage((prevState) => (
          { ...prevState, confirmPasswordErrorMessage: "Confirm passwords should match with password" }
        ))
        hasError = true;
      }
    }


    if (hasError) {
      console.error("Validation failed: Fields cannot be empty");
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

      console.log(payload)

      const response = await axiosInstance.post('/signup', payload);
      console.log("response.data", response.data)
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




// const handleBlur = (name) => {
//   switch (name) {
//     case "username":
//       if (!signupInputs?.username?.trim()) {
//         setError((prevState) => (
//           { ...prevState, usernameError: true }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, usernameErrorMessage: "Username should not be empty" }
//         ))
//       }

//       break;
//     case "password":
//       if (!signupInputs?.password?.trim()) {
//         setError((prevState) => (
//           { ...prevState, passwordError: true }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, passwordErrorMessage: "Password should not be empty" }
//         ))
//       }
//       else if (!validatePassword(signupInputs?.password)) {
//         setError((prevState) => (
//           { ...prevState, passwordError: true }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, passwordErrorMessage: "Password must be at least 8 characters & contain at least one uppercase & one special character", }
//         ))
//       }
//       else {
//         setError((prevState) => (
//           { ...prevState, passwordError: false }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, passwordErrorMessage: "" }
//         ))
//       }
//       break;
//     case "confirmPassword":
//       if (!signupInputs?.confirmPassword?.trim()) {
//         setError((prevState) => (
//           { ...prevState, confirmPasswordError: true }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, confirmPasswordErrorMessage: "Confirm password should not be empty" }
//         ))
//       }
//       else if (!validateConfirmPassword(signupInputs?.confirmPassword, signupInputs?.password)) {
//         setError((prevState) => (
//           { ...prevState, confirmPasswordError: true }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, confirmPasswordErrorMessage: "Confirm passwords should match with password" }
//         ))
//       }
//       else {
//         setError((prevState) => (
//           { ...prevState, confirmPasswordError: false }
//         ))
//         setErrorMessage((prevState) => (
//           { ...prevState, confirmPasswordErrorMessage: "" }
//         ))
//       }
//       break;
//     default:
//       console.log("default")
//       break;
//   }
// }