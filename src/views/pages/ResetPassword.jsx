import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import CustomInputGroup from '../../reusable-components/CustomInputGroup'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import sha256 from 'sha256';
import CustomSpinner from '../../reusable-components/CustomSpinner'
import Cookies from 'js-cookie';


const ResetPassword = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [resetInputs, setResetInputs] = useState({})
    const [errorMessage, setErrorMessage] = useState({
        passwordErrorMessage: "",
        confirmPasswordErrorMessage: ""
    })
    const [error, setError] = useState({
        passwordError: false,
        confirmPasswordError: false
    })
    useEffect(() => {
        getEmailId();
    }, []);

    const getEmailId = () => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) return;

        const parts = token.split(".");
        let payload;
        try {
            payload = JSON.parse(atob(parts[1]));
        } catch (e) {
            console.error("Invalid token");
            return;
        }

        const email = payload.sub;

        if (email) {
            Cookies.set("forgot_password_email", email);
            Cookies.set("reset_password_token", token);
        }

        const baseUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, baseUrl);
    };



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


    const handleResetInputs = (e) => {
        const { name, value } = e.target
        const maxLengths = {
            phoneNumber: 10
        };
        if (maxLengths[name] && value.length > maxLengths[name]) return;

        setResetInputs((prevState) => (
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

    const validatePassword = (password) => {
        const minLengthCheck = password.length >= 8;
        const uppercaseCheck = /[A-Z]/.test(password);
        const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return minLengthCheck && uppercaseCheck && specialCharCheck;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLogin();
        }
    };

    const handleReset = async () => {
        let hasError = false;

        const password = resetInputs?.password?.trim() || "";
        const confirmPassword = resetInputs?.confirmPassword?.trim() || "";



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
            setLoading(true)

            const payload = {
                "token": Cookies.get("reset_password_token"),
                "new_password": sha256(resetInputs?.password?.trim()),
                "confirm_password": sha256(resetInputs?.confirmPassword?.trim()),
            };

            const response = await axiosInstance.post('/reset_password', payload);
            if (response.data.error_code === 200) {
                setLoading(false)

                navigate("/");
                toast.success(response.data.message);
            } else {
                setLoading(false)
                toast.error(response.data.message);
            }
        } catch (error) {
            setLoading(false)
            toast.error(response.data.message);
        }
    };




    return (
        <section className='layout' style={{ height: '100dvh', backgroundColor: 'pink' }}>
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
                    <Row className="reset-password-container align-items-center   px-3 px-md-5 py-3  rounded-3 col-12 col-md-8 col-lg-6 col-xl-5 " >
                        <Col className='pt-3'>
                            <h3 className='mb-5 text-center login-register-text'>Reset Password</h3>

                            <div className="row">
                                <div className="mb-3">
                                    <CustomInput
                                        btnDisable={true}
                                        inputLabel="Email"
                                        id="email"
                                        name="email"
                                        value={Cookies.get("forgot_password_email")}
                                        className="mb-2 email-disabled"
                                    />
                                </div>

                                <div className="mb-3 ">
                                    <CustomInputGroup
                                        autoFocus={true}
                                        inputLabel="Password"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        onClick={() => handleShowPassword("password")}
                                        showPassword={showPassword}
                                        placeholder="Enter password"
                                        onChange={handleResetInputs}
                                        value={resetInputs?.password || ""}
                                        className="mb-2"
                                    />
                                    {
                                        error.passwordError &&
                                        <p className="text-danger">{errorMessage.passwordErrorMessage}</p>
                                    }
                                </div>
                                <div className="mb-3 ">
                                    <CustomInputGroup
                                        inputLabel="Confirm password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onClick={() => handleShowPassword("confirmPassword")}
                                        showPassword={showConfirmPassword}
                                        placeholder="Enter confirm password"
                                        onChange={handleResetInputs}
                                        value={resetInputs?.confirmPassword || ""}
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
                                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Reset"}
                                className={`btn custom-button mt-5 mx-auto d-block w-100 cup ${loading && 'pe-none opacity-50'}`}
                                onClick={handleReset}
                            />
                            <p className='mt-5  mb-0 text-center register-login-option-text fs-14'>
                                Back to &nbsp;
                                <Link to="/" className='signup-login-navigation-link'>Login</Link>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </Container >

        </section>
    )
}

export default ResetPassword
