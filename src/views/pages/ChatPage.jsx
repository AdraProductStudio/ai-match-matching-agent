import React, { useEffect, useState, useRef } from 'react'
import '../../stylesheets/ChatPage.css'
import Header from '../components/Header'
import { Container } from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';
import Modal from 'react-bootstrap/Modal';
import CustomButton from '../../reusable-components/CustomButton';
import CustomSpinner from '../../reusable-components/CustomSpinner';
import { useNavigate } from 'react-router-dom';



const ChatPage = () => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)
    const [userInputMessage, setUserInputMessage] = useState("");
    const [isCurrentConversationClosed, setIsCurrentConversationClosed] = useState(false)
    const timeouts = useRef([]);
    const loopTimeoutRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [newChatModal, setNewChatModal] = useState(false)
    const navigate = useNavigate()
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 576);


    useEffect(() => {
        if (sessionStorage.getItem("is_logged_in") === null) {
            sessionStorage.setItem("is_logged_in", "true");
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 576);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            let payload;
            payload = {
                "msg": "",
                "flag": "close",
                "email_or_phone": sessionStorage.getItem("email_or_phone")
            }
            const response = await axiosInstance.post("/chatbot_widget", payload);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!loading) {
            const textarea = document.getElementById('chat-textarea-field-desktop');
            const textareaMobile = document.getElementById('chat-textarea-field-mobile');

            if (window.innerWidth > 490) {
                if (textarea) {
                    textarea.focus();
                }
            } else {
                if (textareaMobile) {
                    textareaMobile.style.pointerEvents = "all";
                    textareaMobile.readOnly = true;
                    textareaMobile.focus();
                    setTimeout(() => {
                        textareaMobile.readOnly = false;
                    }, 300);
                }
            }
        }
    }, [loading]);



    useEffect(() => {
        handleSendMessage("", "", "init")
        setNewChatModal(false)
    }, [])

    const handleSendMessage = async (text, value, flag) => {
        if (sessionStorage.getItem("is_logged_in") !== "true") return;

        try {
            const desktopTextarea = document.getElementById('chat-textarea-field-desktop');
            const mobileTextarea = document.getElementById('chat-textarea-field-mobile');
            if (flag === "init" || (flag === "step" && text !== "")) {
                if (desktopTextarea) desktopTextarea.blur();
                if (mobileTextarea) mobileTextarea.blur();
            }

            const payload = {
                msg: text.trim(),
                flag: flag,
                email_or_phone: sessionStorage.getItem("email_or_phone"),
                session_token: sessionStorage.getItem("session_token")
            };

            timeouts.current.forEach(clearTimeout);
            timeouts.current = [];

            const isPollingStepEmpty = flag === "step" && text === "";

            if (flag === "init") {
                setMessages([{ text: "Loading...", user: false, time: currentTime(new Date()), isLoading: true }]);
            } else if (!isPollingStepEmpty) {
                if (text !== "") {
                    setMessages(prev => [...prev, { text: text, user: true, time: currentTime(new Date()) }]);
                }
                setMessages(prev => [...prev, { text: null, user: false, time: currentTime(new Date()), isLoading: true }]);
            }

            await new Promise(resolve => setTimeout(resolve, 50));  // 50ms delay


            if (text !== "" || flag === "init") {
                setLoading(true);
                setUserInputMessage("");
            }

            const response = await axiosInstance.post("/chatbot_widget", payload);

            const data = response?.data;
            const responseMessage = data?.data?.message;
            const isEmptyData = data?.error_code === 200 && Object.keys(data?.data || {}).length === 0;

            setLoading(false);
            const updateBotMessage = (botMessage) => {
                setMessages(prev => {
                    if (flag === "init") {
                        return [botMessage];
                    }
                    if (prev.length && prev[prev.length - 1]?.isLoading) {
                        return [...prev.slice(0, -1), botMessage];
                    }
                    return [...prev, botMessage];
                });
            };

            if (data?.error_code === 200) {
                if (!isEmptyData && responseMessage) {
                    updateBotMessage({ text: responseMessage, user: false, time: currentTime(new Date()) });
                } else {
                    if (!(flag === "step" && text === "" && isEmptyData)) {
                        setMessages(prev => prev.slice(0, -1));
                    }
                }

                if (responseMessage === "Your chat has been closed.") {
                    clearTimeout(loopTimeoutRef.current);
                    loopTimeoutRef.current = null;
                    handleSessionClose("close")
                    setNewChatModal(true)
                    return;
                }

                if (flag === "init" || (flag === "step" && text === "")) {
                    resetIdleTracking("continuous");
                }
                return responseMessage;
            }
            else if (data?.error_code === 201) {
                if (responseMessage && responseMessage.trim() !== "") {
                    updateBotMessage({ text: responseMessage, user: false, time: currentTime(new Date()) });
                } else {
                    setMessages(prev => prev.slice(0, -1));
                }

                if (responseMessage === "Your chat has been closed.") {
                    handleSessionClose("close")
                    setNewChatModal(true)
                    clearTimeout(loopTimeoutRef.current);
                    loopTimeoutRef.current = null;
                    return;
                }
            }
            else if (data?.error_code === 409) {
                handleSessionClose("close")
                setIsCurrentConversationClosed(true)
                // setMessages(prev => prev.slice(0, -1));
            }
            else {
                updateBotMessage({ text: data?.data?.message || "Unexpected error occurred.", user: false, time: currentTime(new Date()) });
            }
        } catch (error) {
            setLoading(false);
            if (document.getElementById('chat-textarea-field')) {
                document.getElementById('chat-textarea-field').focus();
            }
            console.error(error);
        }
    };


    const resetIdleTracking = (mode) => {
        if (loopTimeoutRef) {
            clearTimeout(loopTimeoutRef.current);
            loopTimeoutRef.current = null;
        }

        if (mode === "close") {
            startIdleTracking("close");
        } else {
            startIdleTracking("continuous");
        }
    };

    const startIdleTracking = (mode) => {
        if (sessionStorage.getItem("is_logged_in") !== "true") return;

        if (mode === "close") {
            setUserInputMessage("");
            return;
        }

        loopTimeoutRef.current = setTimeout(async () => {
            if (sessionStorage.getItem("is_logged_in") !== "true") return;

            const response = await handleSendMessage("", "", "step");
            if (response && typeof response === "string" && response.trim() !== "") {
                resetIdleTracking("continuous");
            }
        }, 60000);
    };



    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (isMobile) {
                return;
            }
            if (e.shiftKey) {
                return
            }
            e.preventDefault()
            handleSendMessage(userInputMessage, "userInputMessage", "step")
        }
    }

    const currentTime = (date) => {
        let hours = date.getHours()
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        hours = hours < 10 ? `0${hours}` : hours
        let minutes = date.getMinutes()
        minutes = minutes < 10 ? `0${minutes}` : minutes
        const time = `${hours}:${minutes} ${ampm}`
        return time
    }


    const handleSessionClose = async (flag) => {
        try {
            let payload;
            payload = {
                "msg": "",
                "flag": flag,
                "email_or_phone": sessionStorage.getItem("email_or_phone"),
                session_token: sessionStorage.getItem("session_token")
            }

            const response = await axiosInstance.post("/chatbot_widget", payload);
            if (response.data.error_code !== 200) {
                console.log(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = async () => {
        try {
            setLogoutLoading(true);

            if (loopTimeoutRef) {
                clearTimeout(loopTimeoutRef.current);
                loopTimeoutRef.current = null;
            }

            sessionStorage.setItem("is_logged_in", "false"); // instead of ref

            const payload = {
                session_token: sessionStorage.getItem("session_token")
            };

            const response = await axiosInstance.post("/logout", payload);

            if (response.data.error_code === 200) {
                setLogoutLoading(false);
                setNewChatModal(false);
                navigate("/");
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("session_token");
                sessionStorage.removeItem("email_or_phone");
                sessionStorage.removeItem("is_logged_in");
            } else {
                setLogoutLoading(false);
                console.log(response.data.message);
            }
        } catch (error) {
            setLogoutLoading(false);
            console.log(error);
        }
    }


    return (

        <>
            {
                !isMobileScreen ?
                    <section className='chatpage-component'>

                        <Header currentPage="ChatPage" />

                        <div className="left-purple-ball">
                        </div>
                        <div className="left-dark-ball">
                        </div>
                        <div className="right-purple-ball">
                        </div>
                        <div className="right-dark-ball">
                        </div>

                        <Container className='main-section ' fluid >
                            <Container className='main-section-container d-flex flex-column justify-content-center align-items-center h-100 '>
                                <div className="chat-container ">
                                    <div className="Adra-MR-online-status-container">
                                        <div className="Adra-MR-header-online-status-container">
                                            <div className='mx-3'>
                                                <p className="ai-agent-text">AI Agent</p>
                                                <p className="online-status">
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                                                            <circle cx="3" cy="3" r="3" fill="#41A61D" />
                                                        </svg>
                                                    </span>
                                                    <span className="online-text">Online</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr style={{ color: '#fff', margin: '0 10px' }} />


                                    {/* Sending-Receiving messages-container */}
                                    <div className='sending-receiving-message-container'>
                                        {messages?.map((message, index) => (
                                            <React.Fragment key={index}>
                                                {message?.user === true ? (
                                                    <div className="sending-message-container">
                                                        <div className="mb-0 sending-message">{message.text.trim()}</div>
                                                        <p className="mb-0 sending-message-time">{message?.time}</p>
                                                    </div>
                                                ) : (
                                                    <div className="receiving-message-container" key={index}>
                                                        <div className="mb-0 receiving-message" style={{ backgroundColor: message.isLoading && "transparent", padding: message.isLoading && '0.5rem 0' }}>
                                                            {message.isLoading ? (
                                                                <div className="dots-loader">
                                                                    <span></span>
                                                                    <span></span>
                                                                    <span></span>
                                                                </div>
                                                            ) : (
                                                                <p
                                                                    className="mb-0 recommendation-text"
                                                                    dangerouslySetInnerHTML={{ __html: message.text }}
                                                                />
                                                            )}
                                                        </div>
                                                        <p className="mb-0 receiving-message-time">{message?.time}</p>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        <div id="scrollView" ref={scrollViewRef}></div>
                                    </div>

                                    {/* Text area field */}
                                    <div className="chat-textarea-section position-absolute d-flex align-items-center ">
                                        <div
                                            className='chat-textarea-container d-flex align-items-center '
                                            style={{
                                                cursor: loading ? 'not-allowed' : 'text',
                                                backgroundColor: loading ? '#ddd' : '#fff',
                                            }}
                                        >
                                            <div className='position-relative w-100  d-flex align-items-center'>
                                                <textarea
                                                    disabled={loading}
                                                    // autoFocus={!loading}
                                                    id='chat-textarea-field-desktop'
                                                    className='chat-textarea-field'
                                                    placeholder='Type here..'
                                                    value={userInputMessage}
                                                    onChange={(e) => setUserInputMessage(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    style={{
                                                        cursor: loading ? 'not-allowed' : 'text',
                                                        backgroundColor: loading ? '#ddd' : '#fff',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            title='Send'
                                            style={{
                                                cursor: loading ? 'not-allowed' : 'text',
                                                backgroundColor: loading ? '#ddd' : '#fff',
                                            }}
                                            className={`send-btn-container cup ${!userInputMessage.trim() ? 'pe-none' : ''}`} onClick={() => handleSendMessage(userInputMessage, "userInputMessage", "step")}>
                                            <svg className={`${!userInputMessage.trim() ? 'pe-none opacity-25' : 'cup'}`} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M38.8175 22.657C38.859 22.5353 38.8645 22.405 38.8315 22.2807C38.046 19.3369 23.4647 10.9691 18.8828 9.56217C17.6892 9.19552 16.8242 9.34316 16.3165 9.99969C14.8446 11.8999 17.8842 17.8087 19.6581 20.8984L28.8478 21.2211C29.3803 21.2398 29.7968 21.6878 29.7782 22.2218C29.7596 22.7559 29.3129 23.1737 28.7804 23.155L19.5026 22.8283C17.5059 25.826 14.1888 31.3635 15.5041 33.3303C15.5534 33.4041 15.6074 33.4735 15.6661 33.5367C16.152 34.0592 16.9478 34.1966 18.0329 33.9453C22.6987 32.8651 37.8272 25.5422 38.8175 22.657Z" fill="black" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </Container >

                        <Modal
                            show={newChatModal}
                            onHide={() => setNewChatModal(false)}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            backdrop="static"
                        >
                            <Modal.Body >
                                <h3 className='my-3 mb-4 text-center fw-bold' style={{ color: '#5b719b' }}>Inactive Session Notice</h3>
                                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '16px' }}>
                                    The previous session has timed out due to inactivity. Kindly initiate a new conversation to proceed.
                                </p>

                                <div className="mx-2 my-3 text-center">
                                    <CustomButton
                                        buttonName="Start New Conversation"
                                        className={`px-3 mt-4 w-50 btn logout-button mx-auto d-block mb-4 ${logoutLoading ? 'pe-none opacity-50' : ""}`}
                                        onClick={() => {
                                            handleSendMessage("", "", "init");
                                            setNewChatModal(false);
                                        }}
                                    />

                                    {/* OR Separator */}
                                    <div className="d-flex align-items-center justify-content-center my-3">
                                        <hr className="flex-grow-1" />
                                        <span className="mx-3 text-muted">OR</span>
                                        <hr className="flex-grow-1" />
                                    </div>

                                    <CustomButton
                                        buttonName={
                                            logoutLoading ? (
                                                <CustomSpinner variant="light" size="sm" />
                                            ) : (
                                                <>
                                                    <span>Logout</span>
                                                </>
                                            )
                                        }
                                        className={`px-3 py-1 btn mx-auto logout-button d-flex justify-content-center align-items-center px-4 ${logoutLoading ? "pe-none opacity-50" : ""}`}
                                        onClick={handleLogout}
                                    />
                                </div>

                            </Modal.Body>
                        </Modal>

                        <Modal
                            show={isCurrentConversationClosed}
                            onHide={() => setIsCurrentConversationClosed(false)}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            backdrop="static"
                        >
                            <Modal.Body >
                                <h3 className='my-3 mb-4 text-center fw-bold' style={{ color: '#5b719b' }}>Session closed</h3>
                                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '16px' }}>
                                    A new session has been started, so this one has been closed. Please continue in your latest chat window.
                                </p>

                            </Modal.Body>
                        </Modal>

                    </section>
                    :
                    // window.innerWidth < 576 ?
                    <section className='chatpage-component bg-dark'>
                        <div className="left-purple-ball">
                        </div>
                        <div className="left-dark-ball">
                        </div>
                        <div className="right-purple-ball">
                        </div>
                        <div className="right-dark-ball">
                        </div>
                        <div
                            style={{
                                position: 'relative',
                                height: '100dvh',
                                width: '100%',
                                margin: '0 auto',
                                paddingTop: '10vh',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'transparent'
                            }}
                        >
                            {/* Fixed Header */}
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '10vh',
                                    background: 'url(/src/assets/images/chat-container-bg.png) rgba(211, 211, 211, 0.224) 0% 0% / 100px 100px repeat',
                                    mixBlendMode: 'normal',
                                }}
                            >
                                <Header currentPage="ChatPage" />
                            </div>

                            {/* Scrollable Content */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    background: 'url(/src/assets/images/chat-container-bg.png) rgba(211, 211, 211, 0.224) 0% 0% / 100px 100px repeat',
                                    mixBlendMode: 'normal',
                                    zIndex: 1000,
                                    color: 'white',
                                    padding: '0.8rem 0',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <div className='sending-receiving-message-container' style={{ marginTop: '0' }}>
                                    {messages?.map((message, index) => (
                                        <React.Fragment key={index}>
                                            {message?.user === true ? (
                                                <div className="sending-message-container">
                                                    <div className="mb-0 sending-message">{message.text.trim()}</div>
                                                    <p className="mb-0 sending-message-time">{message?.time}</p>
                                                </div>
                                            ) : (
                                                <div className="receiving-message-container" key={index}>
                                                    <div className="mb-0 receiving-message" style={{ backgroundColor: message.isLoading && "transparent", padding: message.isLoading && '0.5rem 0' }}>
                                                        {message.isLoading ? (
                                                            <div className="dots-loader">
                                                                <span></span>
                                                                <span></span>
                                                                <span></span>
                                                            </div>
                                                        ) : (
                                                            <p
                                                                className="mb-0 recommendation-text"
                                                                dangerouslySetInnerHTML={{ __html: message.text }}
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="mb-0 receiving-message-time">{message?.time}</p>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <div id="scrollView" ref={scrollViewRef}></div>
                                </div>
                            </div>

                            {/* Footer Input */}
                            <div
                                style={{
                                    height: '10vh',
                                    background: 'url(/src/assets/images/chat-container-bg.png) rgba(211, 211, 211, 0.224) 0% 0% / 100px 100px repeat',
                                    mixBlendMode: 'normal',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0 1rem',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <div className="chat-textarea-section position-absolute d-flex align-items-center " style={{ bottom: '1rem' }}>
                                    <div
                                        className='chat-textarea-container d-flex align-items-center '
                                        style={{
                                            cursor: loading ? 'not-allowed' : 'text',
                                            backgroundColor: loading ? '#ddd' : '#fff',
                                        }}
                                    >
                                        <div className='position-relative w-100  d-flex align-items-center'>
                                            <textarea
                                                disabled={loading}
                                                // autoFocus={!loading}
                                                id='chat-textarea-field-mobile'
                                                className='chat-textarea-field'
                                                placeholder='Type here..'
                                                value={userInputMessage}
                                                onChange={(e) => setUserInputMessage(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                style={{
                                                    cursor: loading ? 'not-allowed' : 'text',
                                                    backgroundColor: loading ? '#ddd' : '#fff',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        title='Send'
                                        style={{
                                            cursor: loading ? 'not-allowed' : 'text',
                                            backgroundColor: loading ? '#ddd' : '#fff',
                                        }}
                                        className={`send-btn-container cup ${!userInputMessage.trim() ? 'pe-none' : ''}`} onClick={() => handleSendMessage(userInputMessage, "userInputMessage", "step")}>
                                        <svg className={`${!userInputMessage.trim() ? 'pe-none opacity-25' : ''}`} xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M38.8175 22.657C38.859 22.5353 38.8645 22.405 38.8315 22.2807C38.046 19.3369 23.4647 10.9691 18.8828 9.56217C17.6892 9.19552 16.8242 9.34316 16.3165 9.99969C14.8446 11.8999 17.8842 17.8087 19.6581 20.8984L28.8478 21.2211C29.3803 21.2398 29.7968 21.6878 29.7782 22.2218C29.7596 22.7559 29.3129 23.1737 28.7804 23.155L19.5026 22.8283C17.5059 25.826 14.1888 31.3635 15.5041 33.3303C15.5534 33.4041 15.6074 33.4735 15.6661 33.5367C16.152 34.0592 16.9478 34.1966 18.0329 33.9453C22.6987 32.8651 37.8272 25.5422 38.8175 22.657Z" fill="black" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal
                            show={newChatModal}
                            onHide={() => setNewChatModal(false)}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            backdrop="static"
                        >
                            <Modal.Body >
                                <h3 className='my-3 mb-4 text-center fw-bold' style={{ color: '#5b719b' }}>Inactive Session Notice</h3>
                                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '14px' }}>
                                    The previous session has timed out due to inactivity. Kindly initiate a new conversation to proceed.
                                </p>

                                <div className="mx-2 my-3 text-center">
                                    <CustomButton
                                        buttonName="Start New Conversation"
                                        className={`px-3 mt-4 btn logout-button mx-auto d-block mb-4 ${logoutLoading ? 'pe-none opacity-50' : ""}`}
                                        onClick={() => {
                                            handleSendMessage("", "", "init");
                                            setNewChatModal(false);
                                        }}
                                    />

                                    {/* OR Separator */}
                                    <div className="d-flex align-items-center justify-content-center my-3">
                                        <hr className="flex-grow-1" />
                                        <span className="mx-3 text-muted">OR</span>
                                        <hr className="flex-grow-1" />
                                    </div>

                                    <CustomButton
                                        buttonName={
                                            logoutLoading ? (
                                                <CustomSpinner variant="light" size="sm" />
                                            ) : (
                                                <>
                                                    <span>Logout</span>
                                                </>
                                            )
                                        }
                                        className={`px-3 py-1 btn mx-auto logout-button d-flex justify-content-center align-items-center px-4 ${logoutLoading ? "pe-none opacity-50" : ""}`}
                                        onClick={handleLogout}
                                    />
                                </div>

                            </Modal.Body>
                        </Modal>

                        <Modal
                            show={isCurrentConversationClosed}
                            onHide={() => setIsCurrentConversationClosed(false)}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            backdrop="static"
                        >
                            <Modal.Body >
                                <h3 className='my-3 mb-4 text-center fw-bold' style={{ color: '#5b719b' }}>Session closed</h3>
                                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '16px' }}>
                                    A new session has been started, so this one has been closed. Please continue in your latest chat window.
                                </p>

                            </Modal.Body>
                        </Modal>

                        <Modal
                            show={isCurrentConversationClosed}
                            onHide={() => setIsCurrentConversationClosed(false)}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            backdrop="static"
                        >
                            <Modal.Body >
                                <h3 className='my-3 mb-4 text-center fw-bold' style={{ color: '#5b719b' }}>Session closed</h3>
                                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '16px' }}>
                                    A new session has been started, so this one has been closed. Please continue in your latest chat window.
                                </p>

                            </Modal.Body>
                        </Modal>

                    </section >

            }
        </>
    )
}

export default ChatPage