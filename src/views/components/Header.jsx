import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { RiLogoutBoxLine } from "react-icons/ri";
import axiosInstance from '../../services/axiosInstance';
import CustomSpinner from '../../reusable-components/CustomSpinner';



const Header = ({ currentPage }) => {
    const navigate = useNavigate()

    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 576);
    const [logoutModal, setLogoutModal] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)




    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 576);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            setLogoutLoading(true)
            sessionStorage.setItem("is_logged_in", "false");

            let payload;
            payload = {
                session_token: sessionStorage.getItem("session_token")
            }

            const response = await axiosInstance.post("/logout", payload);

            if (response.data.error_code === 200) {
                setLogoutModal(false)
                sessionStorage.removeItem("accessToken")
                sessionStorage.removeItem("session_token")
                sessionStorage.removeItem("phone_number")
                sessionStorage.removeItem("is_logged_in");
                sessionStorage.removeItem("email_id");
                setLogoutLoading(false)
                navigate("/");
            } else {
                setLogoutLoading(false)
            }
        } catch (error) {
            setLogoutLoading(false)
            console.log(error)
        }
    }

    const handleLogoClick = async () => {
        try {
            let payload;
            payload = {
                "msg": "",
                "flag": "close",
                "phone_number": sessionStorage.getItem("phone_number")
            }
            const response = await axiosInstance.post("/chatbot_widget", payload);
            if (response.data.error_code === 200) {
                sessionStorage.removeItem("accessToken")
                sessionStorage.removeItem("phone_number")
                navigate("/");
            } else {
                console.log(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Navbar className="header-section" >
                <Container className='px-3 px-sm-0'>
                    <Navbar.Brand >
                        <img
                            className={window.location.pathname === "/" ? '' : 'cup'}
                            src={Image.vibeonLogo}
                            alt="vibeon-logo"
                            width={window.innerWidth < 576 ? 100 : 120}
                            onClick={window.location.pathname === "/" ? null : handleLogoClick} />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    {
                        currentPage === "ChatPage" ?
                            <div className='d-flex justify-content-end gap-2'>
                                <Navbar.Collapse className="">
                                    <CustomButton
                                        buttonName={

                                            <div className={`d-flex align-items-center gap-2 ${logoutLoading && 'pe-none opacity-50'}`}>
                                                {
                                                    isMobileScreen ?
                                                        <RiLogoutBoxLine size={16} />
                                                        :
                                                        <>
                                                            <RiLogoutBoxLine size={18} />
                                                            <span>Logout</span>
                                                        </>
                                                }

                                            </div>
                                        }
                                        className={`px-3 btn logout-button ${isMobileScreen ? "logout-header-button-mobile" : ""}`}
                                        onClick={() => setLogoutModal(true)}
                                    />
                                </Navbar.Collapse>
                            </div>
                            :
                            null
                    }


                </Container>
            </Navbar>

            {/* Logout Modal */}
            <Modal
                show={logoutModal}
                onHide={() => setLogoutModal(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body >
                    <h3 className='my-3 mb-4 text-center fw-bold' style={{ color: '#5b719b' }}>Log out</h3>
                    <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: isMobileScreen ? '14px' : '16px' }}>
                        Are you sure you want to log out?
                    </p>


                    <div className="mx-2 my-3 text-center d-flex gap-3">
                        <CustomButton
                            buttonName="Cancel"
                            className={`px-3 mt-4 w-50 btn cancel-button mx-auto d-block mb-4 ${logoutLoading ? 'pe-none opacity-50' : ""}`}
                            onClick={() => {
                                setLogoutModal(false);
                            }}
                        />
                        <CustomButton
                            buttonName={
                                logoutLoading ?
                                    <CustomSpinner variant="light" size="sm" /> :
                                    "Logout"
                            }
                            className={`px-3 mt-4 w-50 btn logout-button mx-auto d-block mb-4 ${logoutLoading ? 'pe-none opacity-50' : ""}`}
                            onClick={() => {
                                handleLogout();
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Header
