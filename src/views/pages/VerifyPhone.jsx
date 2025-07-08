import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from '../components/Header'
import CustomInput from '../../reusable-components/CustomInput'
import CustomButton from '../../reusable-components/CustomButton'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import CustomSpinner from '../../reusable-components/CustomSpinner'
import { useDispatch, useSelector } from 'react-redux'
import { handleErrors, handleVerifyPhoneInput } from '../../redux/slices/commonSlice'
import { handleVerifyPhoneAPI } from '../../redux/actions/commonActions'



const VerifyPhone = () => {

    const {
        verifyPhone,
        loading,
        error
    } = useSelector(state => state.commonReducer)

    const [phoneError, setPhoneError] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

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

        const emailFromToken = payload.sub;
        console.log("emailFromToken", emailFromToken)

        if (emailFromToken) {
            sessionStorage.setItem("email_id", emailFromToken);
        }
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, baseUrl);
    }



    const handleSendOTP = async () => {
        let hasError = false;
        if (!verifyPhone.trim()) {
            dispatch(handleErrors({
                verifyPhoneError: true,
                verifyPhoneErrorMessage: "Please enter phone number"
            }))
            setPhoneError("Please enter phone number")
            hasError = true;
        }
        if (hasError) {
            return;
        }
        setPhoneError("");
        dispatch(handleVerifyPhoneAPI(verifyPhone, navigate))
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            dispatch(handleVerifyPhoneAPI(verifyPhone, navigate))
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
                            <h3 className='mb-5 text-center page-heading-text'>Continue with Mobile</h3>

                            <div className="mb-3">
                                <CustomInput
                                    inputLabel="Phone number"
                                    type="number"
                                    id="verifyPhone"
                                    name="verifyPhone"
                                    placeholder="Enter your phone number"
                                    onChange={(e) => {
                                        dispatch(handleVerifyPhoneInput({ name: e.target.name, value: e.target.value }))

                                        if (error?.verifyPhoneError) {
                                            // setPhoneError("");
                                            dispatch(handleErrors({
                                                verifyPhoneError: false,
                                                verifyPhoneErrorMessage: ""
                                            }))
                                        }
                                    }}
                                    value={verifyPhone || ""}
                                    className="mb-2"
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                                {/* {
                                    phoneError &&
                                    <p className="text-danger">{phoneError}</p>
                                } */}
                                {
                                    error?.verifyPhoneError &&
                                    <p className="text-danger">{error?.verifyPhoneErrorMessage}</p>
                                }
                            </div>
                            <CustomButton
                                buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : "Send OTP"}
                                className={`btn custom-button mt-5 mx-auto d-block w-100 cup ${loading && 'pe-none opacity-50'}`}
                                onClick={() => handleSendOTP()}
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

export default VerifyPhone
