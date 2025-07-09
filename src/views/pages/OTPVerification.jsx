import { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import CustomSpinner from '../../reusable-components/CustomSpinner'
import { useDispatch, useSelector } from 'react-redux'
import { handleVerifyPhoneInput } from '../../redux/slices/commonSlice'
import { handleVerifyPhoneAPI } from '../../redux/actions/commonActions'



const OTPVerification = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 576);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 576);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        !isMobileScreen && inputsRef.current[0].focus()
    }, [])


    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };


    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        const enteredOtp = otp.join("");
        // if (enteredOtp.length === 6) {
        //     alert("Entered OTP: " + enteredOtp);
        // } else {
        //     alert("Please enter all 6 digits.");
        // }
        try {
            setLoading(true)
            const payload = {
                "phone_number": sessionStorage.getItem("phone_number"),
                "otp": enteredOtp,
                "email": sessionStorage.getItem("email_id")
            }
            const response = await axiosInstance.post('/verify-otp', payload)
            setLoading(false)
            navigate('/')
        } catch (error) {
            setLoading(false)
            console.log(error)
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
                    <Row className="forgot-password-container align-items-center  px-3 px-md-5 py-3  rounded-3 col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 " >
                        <Col className='my-5 '>
                            <h3 className='mb-5 text-center page-heading-text'>Verify OTP</h3>

                            <div className="mb-3">

                                <div style={{ display: "flex", gap: isMobileScreen ? "10px" : "20px", justifyContent: "center", margin: "20px 0" }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            ref={(el) => (inputsRef.current[index] = el)}
                                            style={{
                                                width: isMobileScreen ? "40px" : "50px",
                                                height: isMobileScreen ? "40px" : "50px",
                                                fontSize: isMobileScreen ? "16px" : "24px",
                                                textAlign: "center",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                outline: 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                                {/* 
                                {
                                    phoneError &&
                                    <p className="text-danger">{phoneError}</p>
                                } */}
                            </div>
                            <CustomButton
                                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Verify"}
                                className={`btn custom-button mt-5 mx-auto d-block w-100 cup ${loading && 'pe-none opacity-50'}`}
                                onClick={() => handleSubmit()}
                            />
                            <p className='mt-5 mb-0 text-center register-login-option-text fs-14'>
                                Back to &nbsp;
                                <Link to="/" className='signup-login-navigation-link'>Log in</Link>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </Container >

        </section>
    )
}

export default OTPVerification
