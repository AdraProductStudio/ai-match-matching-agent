import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images'
import { useNavigate } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import Modal from 'react-bootstrap/Modal';
import { RiLogoutBoxLine } from "react-icons/ri";
import Cookies from 'js-cookie';



const Header = ({ currentPage }) => {
    const navigate = useNavigate()

    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);
    const [modalShow, setModalShow] = useState(false);


    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        Cookies.remove("accessToken")
        Cookies.remove("phone_number")
        navigate("/");
    }

    const handleLogoClick = () => {
        Cookies.remove("accessToken")
        Cookies.remove("phone_number")
        navigate("/");
    }

    return (
        <>
            <Navbar className="header-section" >
                <Container>
                    <Navbar.Brand >
                        <img
                            className='cup'
                            style={{ marginLeft: '-30px' }}
                            src={Image.adraWhiteLogo}
                            alt="adra-white-logo"
                            width={120}
                            onClick={handleLogoClick} />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    {
                        currentPage === "ChatPage" ?
                            <div className='d-flex justify-content-end gap-2'>
                                <Navbar.Collapse className="">
                                    <CustomButton
                                        buttonName={
                                            <div className='d-flex align-items-center gap-2'>
                                                <RiLogoutBoxLine size={18} />
                                                <span>Log out</span>
                                            </div>
                                        }
                                        className='px-3 btn logout-button'
                                        onClick={handleLogout}
                                    />
                                </Navbar.Collapse>
                            </div>
                            :
                            null
                    }


                </Container>
            </Navbar>


            {/* Instructions Modal */}
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <Modal.Body >

                    <h3 className='my-3 mb-4 text-center ' style={{ color: '#5b719b' }}>Digiform – Forms Made Easy. Just Talk, We Fill!</h3>

                    <p className='px-2' style={{ fontWeight: '450', fontSize: '16px' }}>
                        DigiForm is an AI-powered automated form-filling solution that securely retrieves user data via DigiLocker and completes missing details through an interactive voice agent.
                    </p>

                    <div className='px-2 px-md-5' style={{ color: '#666', fontSize: '15px' }}>
                        Step 1: Sign up and Form selection
                        Sign-up and log-in into the Application
                        On the home screen, select the desired bank form (SBI, ICICI, or Bank of Baroda).
                        Click on the "Use" button to proceed.
                        <br />   <br />

                        Step 2: Authenticate via DigiLocker
                        The application integrates with DigiLocker to fetch your Aadhaar-based personal information securely.
                        Enter your Aadhaar Number and click "Next".
                        Follow the DigiLocker authentication steps to grant access to your details.
                        Once authenticated, the system will autofill the form using the retrieved information.
                        <br />   <br />

                        Step 3: Complete Additional Questions via Voice Agent
                        After the basic form details are fetched, additional details may be required.
                        Enter your mobile number, and click "Call Now" to receive a call from the voice agent.
                        Choose a language (English or Hindi) for the interaction.
                        The voice agent will ask you the remaining required questions and automatically update the form.
                        <br />   <br />

                        Step 4: Generate Final PDF
                        Once the call is completed and all details are collected, click "Generate New PDF" to create an updated version of the form with all information filled in.
                        <p>Download or print the finalized document for submission.</p>

                    </div>

                    <div className="mx-2 my-3">
                        <CustomButton
                            buttonName="Close"
                            className='px-3 mt-2 w-100 btn logout-button'
                            onClick={() => setModalShow(false)}
                        />
                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default Header
