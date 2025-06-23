import { useState } from 'react'
import { Col, Container,  Row } from 'react-bootstrap'
import Header from '../components/Header'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import { Link} from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import CustomSpinner from '../../reusable-components/CustomSpinner'



const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState(false)
    const [loading, setLoading] = useState(false)

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }

    const handleInputs = (e) => {
        const { name, value } = e.target
        if (value.trim() !== "") {
            setEmailError(false)
            setEmailErrorMessage(false)
        }
        setEmail(value)
    }


    const handleSendPassword = async () => {
        let hasError = false;

        if (!email.trim()) {
            setEmailError(true)
            setEmailErrorMessage("Email should not be empty")
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError(true)
            setEmailErrorMessage("Please enter a valid email")
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {

            setLoading(true)

            const payload = {
                "email": email.trim(),
            };

            const response = await axiosInstance.post('/forgot_password', payload);
            if (response.data.error_code === 200) {
                setLoading(false)
                sessionStorage.setItem("forgot_password_email", email)
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendPassword();
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
                    <Row className="forgot-password-container align-items-center  px-3 px-md-5 py-3  rounded-3 col-12 col-md-8 col-lg-6 col-xl-5 " >
                        <Col className='my-5 '>
                            <h3 className='mb-5 text-center login-register-text'>Forgot Password</h3>

                            <div className="mb-3">
                                <CustomInput
                                    inputLabel="Email"
                                    autoFocus={true}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email"
                                    onChange={(e) => handleInputs(e)}
                                    value={email || ""}
                                    className="mb-2"
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                                {
                                    emailError &&
                                    <p className="text-danger">{emailErrorMessage}</p>
                                }
                            </div>
                            <CustomButton
                                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Send password link"}
                                className={`btn custom-button mt-5 mx-auto d-block w-100 cup ${loading && 'pe-none opacity-50'}`}
                                onClick={handleSendPassword}
                            />
                            <p className='mt-5 mb-0 text-center register-login-option-text fs-14'>
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

export default ForgotPassword
