import React, { useEffect, useState, useCallback, useRef } from 'react'
import '../../stylesheets/ChatPage.css'
import { Link, useLocation } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import Header from '../components/Header'
import { Container } from 'react-bootstrap';
import Footer from '../components/Footer';
import axiosInstance from '../../services/axiosInstance';
import Cookies from 'js-cookie';


const ChatPage = () => {

    const [messages, setMessages] = useState([])
    const [userInputMessage, setUserInputMessage] = useState("");
    const timeouts = useRef([]);

    useEffect(() => {
        handleSendMessage("", "", "init")
    }, [])

    const handleSendMessage = async (text, value, flag) => {
        try {
            let payload;

            payload = {
                "msg": text,
                "flag": flag,
                "phone_number": Cookies.get("phone_number")
            }

            if (flag !== "init") {
                const userMessage = { text: text, user: true, time: currentTime(new Date()) };
                setMessages((prevMessages) => [...prevMessages, userMessage]);
                setUserInputMessage("");

                const loadingText = { text: "Loading...", user: false, time: currentTime(new Date()) };
                setMessages((prevMessages) => [...prevMessages, loadingText]);

                setTimeout(() => {
                    const scrollView = document.querySelector("#scrollView");
                    if (scrollView) {
                        scrollView.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1);
            }

            const response = await axiosInstance.post("/chatbot_widget", payload);

            timeouts.current.forEach(clearTimeout);
            timeouts.current = [];

            console.log("response.data", response.data)
            if (response.data.error_code === 200) {
                const responseMessage = response.data.data.message;
                const botMessage = { text: responseMessage, user: false, time: currentTime(new Date()) };
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1),
                    botMessage,
                ]);
                setTimeout(() => {
                    const scrollView = document.querySelector("#scrollView");
                    if (scrollView) {
                        scrollView.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1);

            } else if (response.data.status_code === 201) {
                const responseMessage = response.data.data.response;
                const formattedHTML = responseMessage
                    .split("\n\n")
                    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`) // Replace single \n with <br>
                    .join("");

                const botMessage = { text: formattedHTML, user: false, time: currentTime(new Date()) };
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1),
                    botMessage,
                ]);
                setTimeout(() => {
                    const scrollView = document.querySelector("#scrollView");
                    if (scrollView) {
                        scrollView.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1);
            } else {
                const responseMessage = response.data.message;
                const botMessage = { text: responseMessage, user: false, time: currentTime(new Date()) };
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1),
                    botMessage,
                ]);
                setTimeout(() => {
                    const scrollView = document.querySelector("#scrollView");
                    if (scrollView) {
                        scrollView.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 1);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
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

    return (
        <section className='chatpage-component'>
            <Header currentPage="ChatPage" />

            <Container className='main-section' fluid >
                <Container className='d-flex flex-column justify-content-center align-items-center h-100' >
                    <div className="chat-container ">
                        <div className="Adra-MR-online-status-container">
                            <div className="Adra-MR-header-online-status-container">
                                <img
                                    src="https://d1olhs2thomfrd.cloudfront.net/adra_black_logo.png"
                                    alt="adra-black-logo"
                                    className="adra-black-logo"
                                    width={50}
                                />
                                <div>
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
                            <div className="Adra-MR-header-brand-image">
                                {/* Optional brand image or content here */}
                            </div>
                        </div>

                        {/* Sending-Receiving messages-container */}
                        <div className='sending-receiving-message-container'>
                            {
                                messages?.map((message, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {message?.user === true ? (
                                                <>
                                                    <div className="sending-message-container">
                                                        <div className="mb-0 sending-message">
                                                            {Array.isArray(message.url) ? (
                                                                message.url.map((url, idx) => (
                                                                    <img
                                                                        key={idx}
                                                                        src={url}
                                                                        alt={`selected-media-file-${idx}`}
                                                                        width="100%"
                                                                        height="150"
                                                                    />
                                                                ))
                                                            ) : message.url ? (
                                                                <img
                                                                    src={message.url}
                                                                    alt="selected-media-file"
                                                                    width="100%"
                                                                    height="150"
                                                                />
                                                            ) : (
                                                                message.text
                                                            )}
                                                        </div>
                                                        <p className="mb-0 sending-message-time">{message?.time}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="receiving-message-container" key={index}>
                                                    {Array.isArray(message.text) ? (
                                                        message.text.map((item, idx) => (
                                                            <div className="default-receiving-suggestions-container" key={idx}>
                                                                <p
                                                                    className="mb-0 cup default-receiving-suggestion"
                                                                    onClick={() => handleSendMessage(item, "suggestionResponseText")}
                                                                >
                                                                    {item}
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <div className="mb-0 receiving-message">
                                                                {Array.isArray(message.url) ? (
                                                                    message.url.map((url, idx) => (
                                                                        <img
                                                                            key={idx}
                                                                            src={url}
                                                                            alt={`received-media-file-${idx}`}
                                                                            width="150"
                                                                            height="150"
                                                                        />
                                                                    ))
                                                                ) : message.url ? (
                                                                    <img
                                                                        src={message.url}
                                                                        alt="received-media-file"
                                                                        width="150"
                                                                        height="150"
                                                                    />
                                                                ) : (
                                                                    <p
                                                                        className="mb-0 recommendation-text"
                                                                        dangerouslySetInnerHTML={{ __html: message.text }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                    <p className="mb-0 receiving-message-time">{message?.time}</p>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            }
                            <div id="scrollView"></div>
                        </div>

                        {/* Text area field */}
                        <div className="chat-textarea-section position-absolute d-flex align-items-center ">
                            <div className='chat-textarea-container d-flex align-items-center '>
                                <div className='position-relative w-100  d-flex align-items-center'>
                                    <textarea
                                        autoFocus
                                        className='chat-textarea-field '
                                        type="text"
                                        placeholder='Type here..'
                                        value={userInputMessage}
                                        onChange={(e) => setUserInputMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                            <div title='Send' className={`send-btn-container cup ${!userInputMessage.trim() ? 'pe-none' : ''}`} onClick={() => handleSendMessage(userInputMessage, "userInputMessage", "step")}>
                                <svg className={`${!userInputMessage.trim() ? 'pe-none opacity-25' : ''}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <g clipPath="url(#clip0_230_1404)">
                                        <path d="M17.3392 0.661053C17.0703 0.388898 16.7358 0.190694 16.3679 0.08559C16 -0.0195141 15.6113 -0.0279654 15.2392 0.0610527L3.2392 2.58855C2.54813 2.68333 1.89725 2.96916 1.35985 3.41386C0.82245 3.85856 0.419881 4.44447 0.197478 5.1056C-0.0249258 5.76673 -0.0583304 6.47683 0.101026 7.15592C0.260382 7.835 0.606169 8.45612 1.09945 8.9493L2.38795 10.2371C2.45768 10.3068 2.51299 10.3896 2.5507 10.4807C2.5884 10.5718 2.60777 10.6694 2.6077 10.7681V13.1441C2.60935 13.4781 2.68626 13.8075 2.8327 14.1078L2.8267 14.1131L2.8462 14.1326C3.06596 14.5744 3.42488 14.9317 3.8677 15.1496L3.8872 15.1691L3.89245 15.1631C4.19272 15.3095 4.52212 15.3864 4.8562 15.3881H7.2322C7.43098 15.3879 7.62171 15.4667 7.76245 15.6071L9.0502 16.8948C9.39559 17.244 9.80668 17.5214 10.2598 17.711C10.7129 17.9006 11.199 17.9987 11.6902 17.9996C12.0995 17.999 12.506 17.9322 12.8939 17.8016C13.549 17.5864 14.131 17.1926 14.5741 16.6643C15.0173 16.1361 15.304 15.4946 15.4019 14.8121L17.9332 2.7858C18.0268 2.41053 18.0213 2.01737 17.9172 1.64488C17.813 1.27238 17.6139 0.933355 17.3392 0.661053ZM3.44995 9.17805L2.1607 7.8903C1.86049 7.59732 1.65008 7.22479 1.55416 6.81642C1.45825 6.40805 1.48081 5.9808 1.6192 5.5848C1.75337 5.17855 2.0014 4.81937 2.33379 4.55C2.66619 4.28063 3.06896 4.11239 3.4942 4.0653L15.3749 1.56405L4.1062 12.8343V10.7681C4.10733 10.4728 4.04992 10.1803 3.93728 9.90734C3.82463 9.63443 3.659 9.38655 3.44995 9.17805ZM13.9282 14.5556C13.8706 14.9698 13.6987 15.3598 13.4318 15.6818C13.1648 16.0038 12.8134 16.245 12.417 16.3783C12.0206 16.5117 11.5949 16.5319 11.1876 16.4367C10.7804 16.3416 10.4077 16.1348 10.1114 15.8396L8.82145 14.5496C8.61322 14.3402 8.36555 14.1742 8.09276 14.0612C7.81997 13.9481 7.52748 13.8903 7.2322 13.8911H5.16595L16.4362 2.62455L13.9282 14.5556Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_230_1404">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </Container>
            </Container >

            <Footer isFooterText={true} />

        </section>
    )
}

export default ChatPage