import React, { useEffect, useRef, useState } from 'react'
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
import { FaCircleCheck } from "react-icons/fa6";
import { LuRefreshCcw } from "react-icons/lu";
import CustomSpinner from '../../reusable-components/CustomSpinner'




const Register = () => {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [suggestedPasswords, setSuggestedPasswords] = useState([]);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
  const [suggestedPasswordsContainer, setSuggestedPasswordsContainer] = useState(false)
  const [regeneratePasswords, setRegeneratePasswords] = useState(false)
  const [signupInputs, setSignupInputs] = useState({})
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState("")
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
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState("")




  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setSuggestedPasswordsContainer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  console.log(signupInputs)

  useEffect(() => {
    const result = strongPasswords(3, 12, 16);
    setSuggestedPasswords(result);
  }, [regeneratePasswords]);

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
    const { name, value } = e.target;

    const maxLengths = {
      phoneNumber: 10
    };
    if (maxLengths[name] && value.length > maxLengths[name]) return;

    if (name === "email") {
      if (value !== verifiedEmail) {
        setEmailVerified(false);
      }
    }

    const updatedInputs = {
      ...signupInputs,
      [name]: value
    };

    if (
      (name === "password" || name === "confirmPassword") &&
      updatedInputs.password === updatedInputs.confirmPassword
    ) {
      setError((prev) => ({ ...prev, confirmPasswordError: false }));
      setErrorMessage((prev) => ({ ...prev, confirmPasswordErrorMessage: "" }));
    }

    setSignupInputs(updatedInputs);

    if (value.trim() !== "") {
      setError((prevState) => ({
        ...prevState,
        [`${name}Error`]: false
      }));

      setErrorMessage((prevState) => ({
        ...prevState,
        [`${name}ErrorMessage`]: ""
      }));
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSignup();
    }
  };

  const handleVerifyEmail = async () => {
    let hasError = false;
    const email = signupInputs?.email?.trim() || "";
    if (!email) {
      setError(prev => ({ ...prev, emailError: true }));
      setErrorMessage(prev => ({ ...prev, emailErrorMessage: "Email should not be empty" }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setError(prev => ({ ...prev, emailError: true }));
      setErrorMessage(prev => ({ ...prev, emailErrorMessage: "Please enter a valid email" }));
      hasError = true;
    }
    if (hasError) {
      console.error("Email Validation failed");
      return;
    }
    try {

      setEmailVerifying(true)

      const payload = {
        "email": signupInputs?.email?.trim(),
      };
      const response = await axiosInstance.post('/verify_email', payload);

      if (response.data.error_code === 200) {
        setEmailVerifying(false)
        setEmailVerified(true)
        setVerifiedEmail(response.data.data.verified_email)
        setError(prev => ({ ...prev, emailError: false }));
        setErrorMessage(prev => ({ ...prev, emailErrorMessage: "" }));
        toast.success(response.data.message);
      } else {
        setEmailVerifying(false)
        toast.error(response.data.message);
      }
    } catch (error) {
      setEmailVerifying(false)
      toast.error(error.message);
    }
  }

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
    } else if (!emailVerified) {
      setTimeout(() => {
        const iconEl = document.getElementById('email-verify-icon');
        if (iconEl) {
          iconEl.classList.add("email-verify-icon-boom");
          setTimeout(() => iconEl.classList.remove("email-verify-icon-boom"), 1000);
        }
      }, 0);
      setError(prev => ({ ...prev, emailError: true }));
      setErrorMessage(prev => ({ ...prev, emailErrorMessage: "Please check if the email is available" }));
      hasError = true;
    } else if (email !== verifiedEmail) {
      setTimeout(() => {
        const iconEl = document.getElementById('email-verify-icon');
        if (iconEl) {
          iconEl.classList.add("email-verify-icon-boom");
          setTimeout(() => iconEl.classList.remove("email-verify-icon-boom"), 1000);
        }
      }, 0);
      setError(prev => ({ ...prev, emailError: true }));
      setErrorMessage(prev => ({ ...prev, emailErrorMessage: "Please check if the email is available" }));
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
    } else {
      setError(prev => ({ ...prev, confirmPasswordError: false }));
      setErrorMessage(prev => ({ ...prev, confirmPasswordErrorMessage: "" }));
    }

    if (hasError) {
      return;
    }

    try {

      setLoading(true)

      const payload = {
        "firstname": signupInputs?.firstName?.trim(),
        "lastname": signupInputs?.lastName?.trim(),
        "email": signupInputs?.email?.trim(),
        "password": sha256(signupInputs?.password?.trim()),
        "email_or_phone": `+91${signupInputs?.phoneNumber?.trim()}`,
        "allowed_domain": import.meta.env.VITE_DOMAIN
      };

      const response = await axiosInstance.post('/signup', payload);
      if (response.data.error_code === 200) {
        setLoading(false)
        navigate("/");
        toast.success(response.data.message);
      } else if (response.data.error_code === 409) {
        setLoading(false)
        toast.warn(response.data.message);
      } else {
        setLoading(false)
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message);
    }
  };

  const strongPasswords = function generateMultipleStrongPasswords(count, min, max) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "@$!%*?&#";
    const all = upper + lower + digits + special;

    const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

    const generatePassword = (length) => {
      if (length < 4) throw new Error("Minimum length must be at least 4");

      let password = [
        getRandom(upper),
        getRandom(lower),
        getRandom(digits),
        getRandom(special)
      ];

      for (let i = 4; i < length; i++) {
        password.push(getRandom(all));
      }

      return password.sort(() => 0.5 - Math.random()).join('');
    };

    const passwords = [];
    for (let i = 0; i < count; i++) {
      const randomLength = Math.floor(Math.random() * (max - min + 1)) + min;
      passwords.push(generatePassword(randomLength));
    }

    return passwords;
  }


  const handleAuth = async () => {
    try {

      window.location.href = 'https://wondrous-briefly-sunfish.ngrok-free.app/oauth'
      // window.location.href = 'http://10.10.1.101:5000/oauth'

      return

      const response = await axios.get('http://10.10.1.101:5000/oauth');
      if (response.data.error_code === 200) {
        console.log(response.data)
        toast.success(response.data.message);
      } else if (response.data.error_code === 409) {
        console.log(response.data)
        toast.warn(response.data.message);
      } else {
        console.log(response.data)
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoadingAction("googleSignUp")

      window.location.href = 'https://finer-dodo-famous.ngrok-free.app/googlelogin'
      // window.location.href = 'https://wondrous-briefly-sunfish.ngrok-free.app/oauth'
      // window.location.href = 'http://10.10.1.101:5000/oauth'

      return

      const response = await axios.get('http://10.10.1.101:5000/oauth');
      if (response.data.error_code === 200) {
        console.log(response.data)
        toast.success(response.data.message);
      } else if (response.data.error_code === 409) {
        console.log(response.data)
        toast.warn(response.data.message);
      } else {
        console.log(response.data)
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };


  return (
    <section className='layout'>
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
          <Row className="signup-container align-items-center px-3 px-md-5 py-3 rounded-3 col-12 col-md-8 col-lg-8 col-xl-7 " >
            <Col className='my-4 '>
              <h3 className='mb-5 text-center page-heading-text'>Register</h3>
              <div className="row">
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInput
                    inputLabel="First name"
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
                <div className="mb-3 col-12 col-xl-6 register-email-field ">
                  <div className='position-relative'>
                    <CustomInput
                      inputLabel="Email"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      onChange={handleSignupInputs}
                      value={signupInputs?.email || ""}
                      className="mb-2 position-relative"
                    />
                    {
                      signupInputs.email &&
                      <div className={`position-absolute verify-icon cup ${emailVerified && 'pe-none'}`} onClick={handleVerifyEmail}>
                        <FaCircleCheck
                          id='email-verify-icon'
                          title='Check Email Availability'
                          size={20}
                          className={
                            emailVerifying ? 'email-verifying-icon' : emailVerified && (signupInputs?.email === verifiedEmail) ?
                              'email-verified-icon' : error.emailError ?
                                'email-verify-warning-icon' : 'email-verify-icon'}
                        />
                      </div>
                    }
                  </div>
                  {
                    error.emailError &&
                    <p className="text-danger">{errorMessage.emailErrorMessage}</p>
                  }
                </div>
                <div className="mb-3 col-12 col-xl-6">
                  <CustomInput
                    inputLabel="Phone number"
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
                <div className="mb-3 col-12 col-xl-6" ref={inputRef}>
                  <CustomInputGroup
                    inputLabel="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    maxLength={16}
                    onClick={() => handleShowPassword("password")}
                    showPassword={showPassword}
                    placeholder="Enter password"
                    onChange={handleSignupInputs}
                    value={signupInputs?.password || ""}
                    className="mb-2"
                    onFocus={() => setSuggestedPasswordsContainer(true)}
                  />
                  <div
                    className={`mt-3 suggested-passwords-container ${suggestedPasswordsContainer ? 'show' : ''}`}
                    ref={suggestionRef}
                  >
                    <label className="form-label mb-3 small">
                      Suggested Passwords : &nbsp;
                      <LuRefreshCcw
                        title='Regenerate passwords'
                        className="custom-primary-light reload-passwords-icons cup"
                        onClick={() => setRegeneratePasswords(!regeneratePasswords)}
                      />
                    </label>
                    <ul className="list-unstyled d-flex flex-wrap gap-3">
                      {suggestedPasswords.map((pass, idx) => (
                        <li
                          key={idx}
                          className="bg-dark text-light py-1 px-3 rounded-2 small user-select-all border border-secondary cup"
                          onClick={() => {
                            setSignupInputs((prevState) => ({
                              ...prevState,
                              password: pass,
                            }));
                          }}
                        >
                          {pass}
                        </li>
                      ))}
                    </ul>
                  </div>


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
                    maxLength={16}
                  />
                  {
                    error.confirmPasswordError &&
                    <p className="text-danger">{errorMessage.confirmPasswordErrorMessage}</p>
                  }
                </div>
              </div>

              <CustomButton
                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Register"}
                className="btn custom-button mt-4 mx-auto d-block w-100 "
                onClick={handleSignup}
              />


              <div className="or-divider mt-4 mb-4 d-flex align-items-center">
                <hr className="flex-grow-1" />
                <span className="px-2">OR</span>
                <hr className="flex-grow-1" />
              </div>

              {/* <CustomButton
                buttonName={
                  loadingAction === "googleSignUp" ? <CustomSpinner variant="light" size="sm" />
                    :
                    <div className='d-flex align-items-center'>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                        alt="google-logo"
                        width={20}
                        height={20}
                      />
                      <span className="google-text ms-2 fs-14 ">Sign up with Google</span>
                    </div>
                }
                className="btn custom-button mt-3 mx-auto d-block w-100 cup d-flex align-items-center justify-content-center"
                onClick={handleGoogleSignUp}
              /> */}

              <div className="google-signin-btn" onClick={handleGoogleSignUp}>
                <button className="google-btn w-100">
                  {
                    loadingAction === "googleSignUp" ? <CustomSpinner variant="dark" size="sm" />
                      :
                      <>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                          alt="google-logo"
                          width={20}
                          height={20}
                        />
                        <span className="google-text ms-2">Sign up with Google</span>
                      </>
                  }

                </button>
              </div>


              <p className='mt-5 mb-0 text-center register-login-option-text fs-14'>
                Already have an account? &nbsp;
                <Link to="/" className='signup-login-navigation-link'>Log in</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </Container >

      {/* <Footer isFooterText={true} /> */}

    </section>
  )
}

export default Register

