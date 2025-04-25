(function (window, document) {
    document.addEventListener("DOMContentLoaded", () => {
        ChatWidget.init({
            client_id: "f195eef7-fd2f-4d54-9da2-69a757366093",
            client_secret: "tavQqJfg5BoTADWhw30jbm_PDFZB7FQ-QzAKHHvD6yM",
            domain: "modelrocket.ai",
        });

    });
    const ChatWidget = {
        init: function (config) {

            const {
                client_id,
                client_secret,
                domain,
                containerId = "Adra-MR-chatbot-section",
            } = config;


            if (client_id && client_secret && domain) {
                this.injectStyles();
                this.injectGoogleFonts();
                this.renderChatWidget(client_id, client_secret, domain, containerId);
            } else {
                alert('Chatbot not rendered')
            }

        },


        injectGoogleFonts: function () {
            const metaViewport = document.createElement("meta");
            metaViewport.name = "viewport";
            metaViewport.content = "width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no";
            document.head.appendChild(metaViewport);

            const link1 = document.createElement("link");
            link1.rel = "stylesheet";
            link1.href = "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
            document.head.appendChild(link1);

            const link2 = document.createElement("link");
            link2.rel = "stylesheet";
            link2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap";
            document.head.appendChild(link2);
        },

        injectStyles: function (style) {
            const styleTag = document.createElement("style");
            styleTag.innerHTML = `

                             :root {
                                --lightblue: #e3f2fd;
                                --overall-theme: #fff;
                            }

                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                                 
                            }
                            body{
                                background-color: #000;
                            }
                            
                            .Adra-MR-chatbot *{
                                font-family: "Plus Jakarta Sans";
                            }

                            .Adra-MR-chatbot .Adra-MR-chatbox::-webkit-scrollbar {
                            display: none;
                            }
                            .Adra-MR-chat-input textarea::-webkit-scrollbar {
                            display: none;
                            }

                            .Adra-MR-chatbot .Adra-MR-chatbox {
                            -ms-overflow-style: none;  /* IE and Edge */
                            scrollbar-width: none;  /* Firefox */
                            }

                            .Adra-MR-chatbot {
                                position: fixed;
                                bottom: 20px;
                                right: 20px;
                                left:20px;
                                background-color: #fff;
                                // width: 100%;
                                border-radius: 15px;
                                overflow: hidden;
                                transform: scale(0.5);
                                opacity: 0;
                                transition: all 0.2s linear;
                                border: 1px solid #000;
                                z-index: 99999999999999999 !important;
                            }

                            .Adra-MR-chatbot .feedback-modal {
                                width: 100%;
                                height: 100%;
                                background-color: #000;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 99996 !important;
                                padding: 15px;
                                font-size: 14.5px;
                                border-radius: 7px;
                                display: none;
                            }

                            .Adra-MR-chatbot .feedback-modal.show {
                                width: 100%;
                                height: 100%;
                                background-color: #0000005e;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 99997 !important;
                                padding: 15px;
                                font-size: 14.5px;
                                border-radius: 7px;
                                display: flex;
                                justify-content: center;
                                align-items: center
                            }

                            .Adra-MR-chatbot .feedback-modal.show .feedback-container {
                                width: 80%;
                                background-color: #fff;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 99998 !important;
                                padding: 15px;
                                font-size: 14.5px;
                                border-radius: 7px;
                                display: block;
                            }

                            .Adra-MR-chatbot .loading-container {
                                width: 100%;
                                height: 100%;
                                background-color: #0000005e;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 99999 !important;
                                padding: 15px;
                                font-size: 14.5px;
                                border-radius: 7px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                display: none;
                            }

                            .Adra-MR-chatbot .loading-container.show {
                                display: flex;
                            }


                            .Adra-MR-chatbot .spinner {
                                width: 50px;
                                height: 50px;
                                border: 5px solid rgba(0, 0, 0, 0.1);
                                border-left-color: #fff;
                                border-radius: 50%;
                                animation: spin 1s linear infinite;
                            }

                            @keyframes spin {
                                0% {
                                    transform: rotate(0deg);
                                }

                                100% {
                                    transform: rotate(360deg);
                                }
                            }


                            .Adra-MR-chatbot .feedback-modal.show .feedback-container #feedback-question {
                                margin-bottom: 0 !important;
                                line-height: 20px;
                            }

                            .Adra-MR-chatbot .stars {
                                display: flex;
                                flex-direction: row-reverse;
                                justify-content: flex-end;
                                margin-top: 8px;
                            }

                            .Adra-MR-chatbot .stars input {
                                display: none;
                            }

                            .Adra-MR-chatbot .stars label {
                                font-size: 25px;
                                color: gray;
                                cursor: pointer;
                                transition: color 0.2s;
                            }

                            .Adra-MR-chatbot .stars input:checked~label,
                            .Adra-MR-chatbot .stars label:hover,
                            .Adra-MR-chatbot .stars label:hover~label {
                                color: gold;
                            }

                            .Adra-MR-chatbot .feedback-input-field {
                                display: none;
                                margin-bottom: 15px;
                            }

                            .Adra-MR-chatbot .feedback-input-field.show {
                                display: block;
                                padding: 5px 10px;
                                border-radius: 5px;
                                width: 100%;
                                resize: none;
                                height: 60px;
                                margin-top: 10px;
                            }

                            .Adra-MR-chatbot .feedback-input-field.show:focus {
                                display: block;
                                padding: 5px 10px;
                                border-radius: 5px;
                                width: 100%;
                                outline: none;
                                border: 1px solid #000;
                                box-shadow: 0 0 0 rgba(0, 0, 0, .2);
                            }

                            .Adra-MR-chatbot .feedback-button-container {
                                display: flex;
                                display: none;
                                justify-content: space-between;
                                gap: 15px;

                            }

                            .Adra-MR-chatbot .feedback-button-container.hide {
                                display: none;
                            }

                            .Adra-MR-chatbot .feedback-submit-button-container {
                                display: none;
                            }

                            .Adra-MR-chatbot .feedback-submit-button-container.show {
                                display: flex;
                                justify-content: space-between;
                                gap: 15px;
                            }

                            .Adra-MR-show-chatbot .Adra-MR-chatbot {
                                transform: scale(1);
                                opacity: 1;
                                transition: all 0.2s linear;
                            }

                            .Adra-MR-chatbot header {
                                background-color: var(--overall-theme);
                                position: relative;
                            }

                            .Adra-MR-chatbot header img {
                               width:60px;
                            }

                            .Adra-MR-chatbot header .close-icon {
                                position: absolute;
                                top: 50%;
                                right: 20px;
                                transform: translateY(-50%);
                                color: #fff;
                                display: none;

                            }

                            .Adra-MR-chatbot header h2 {
                                color: #FFF;
                                font-size: 18px;
                                font-style: normal;
                                font-weight: 600;
                                line-height: normal;
                                margin-bottom:0px !important
                            }

                            .Adra-MR-chatbot .Adra-MR-chatbox {
                                height: 88vh;
                                overflow-y: scroll;
                                padding: 15px 20px 50px;
                                background-color: #040404 !important;
                                
                            }

                            .Adra-MR-chatbot .chat {
                                display: flex;
                            }


                            .Adra-MR-chatbox .incoming {
                                margin-top: 7px;

                            }

                            .Adra-MR-chatbox .smart-toy {
                                height: 32px;
                                width: 32px;
                                align-self: flex-end;
                                background-color: var(--overall-theme);
                                color: #fff;
                                text-align: center;
                                margin: 0 10px 7px 0;
                                line-height: 32px;
                                border-radius: 4px;
                            }

                            .Adra-MR-chatbox .outgoing {
                                margin: 20px 0;
                                justify-content: flex-end;
                            }

                            .Adra-MR-chatbot .Adra-MR-chat-input {
                                position: absolute;
                                bottom: 0;
                                width: 100%;
                                padding: 14.5px;
                                display: flex;
                                gap: 5px;
                                background-color: #040404 !important;
                            }

                            .Adra-MR-chat-input textarea {
                                outline: none;
                                font-size: 0.95rem;
                                resize: none;
                                padding: 8px 14.5px;
                                width: 100%;
                                height: 40px;
                                border-radius: 10px;
                                border: 1px solid #2d2d2d;
                                background: #000;
                                color:#fff;
                            }

                           #Adra-MR-send-btn {
                                color: #fff;
                                font-size: 1.5rem;
                                cursor: pointer;
                                align-self: center;
                                opacity: 0.25;
                                transition: opacity 0.2s ease;
                                background: var(--overall-theme);

                                color: #fff;
                                font-size: 1.5rem;
                                cursor: pointer;
                                align-self: center;
                                transition: opacity 0.2s ease;
                                background: var(--overall-theme);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 50%;
                                height: 36px;
                                width: 36px;
                            }
                                
                            .Adra-MR-chatbot-toggler {
                                position: fixed;
                                bottom: 40px;
                                right: 35px;
                                background-color:var(--overall-theme) ;
                                color: #fff;
                                border-radius: 50%;
                                width: 60px;
                                height: 60px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                z-index: 999;
                                color: #fff;
                                display:none
                            }

                            .Adra-MR-chatbot-toggler p {
                                position: absolute;
                            }

                            .Adra-MR-chatbot-toggler .message-icon {
                                opacity: 1;
                               margin-bottom: -5px;
                            }

                            .Adra-MR-chatbot-toggler .close-icon {
                                opacity: 0;
                                margin-bottom: 0;
                            }

                            .Adra-MR-show-chatbot .Adra-MR-chatbot-toggler .message-icon {
                                opacity: 0;
                                margin-bottom: -5px;
                            }

                            .Adra-MR-show-chatbot .Adra-MR-chatbot-toggler .close-icon {
                                opacity: 1;
                                margin-bottom: -3px;
                            }

                            .Adra-MR-chatbot .person-img {
                                width: 30px !important;
                                height: 30px !important;
                                margin: inherit;
                            }
                           
                            .Adra-MR-chatbot .essence-img {
                                width: 30px !important;
                                height: 22px !important;
                                margin: inherit;
                            }

                            .Adra-MR-chatbot .placeholder-msg {
                                display: flex;
                                width: 85%;
                                margin-bottom: 1rem;
                            }

                            .Adra-MR-chatbot .incoming-msg {
                                display: flex;
                                width: 85%;
                                margin-bottom: 1rem;
                            }

                            .Adra-MR-chatbot .botText {
                                color: #000;
                                font-weight: normal;
                                font-size: 14.5px;
                                text-align: left;
                                margin-bottom: 1rem;
                            }

                            .Adra-MR-chatbot .botText span {
                                line-height: 1.5em;
                                display: inline-block;
                                background-color: var(--overall-theme);
                                color: #fff;
                                padding: 10px;
                                border-radius: 8px;
                                border-bottom-left-radius: 2px;
                                max-width: 100%;
                                margin-left: 10px;
                                animation: floatup .5s forwards;
                                overflow-wrap: break-word;
                                word-wrap: break-word;
                                word-break: break-word;
                                hyphens: auto;
                            }

                            // .Adra-MR-chatbot .placeholder-msg-text {
                            //     line-height: 1.5em;
                            //     display: inline-block;
                            //       background-color: #fff;
                            //     color: #000;
                            //     font-size: 14.5px;
                            //     padding: 10px;
                            //     border-radius: 8px;
                            //     border-top-left-radius: 0px;
                            //     max-width: 100%;
                            //     margin-left: 15px; 
                            //     animation: floatup .5s forwards;
                            //     overflow-wrap: break-word;
                            //     word-wrap: break-word;
                            //     word-break: break-word;
                            //     hyphens: auto;
                            // }

                            .Adra-MR-chatbot .incoming-msg-text {
                                line-height: 1.5em;
                                display: inline-block;
                                background-color: #d3d3d3;
                                color: #000;
                                font-size: 14.5px;
                                padding: 10px;
                                border-radius: 8px;
                                border-top-left-radius: 0px;
                                max-width: 100%;
                                margin-left: 15px;
                                animation: floatup .5s forwards;
                                overflow-wrap: break-word;
                                word-wrap: break-word;
                                word-break: break-word;
                                hyphens: auto;
                            }

                            .Adra-MR-chatbot .incoming-msg-text a {
                                color: #000 !important;
                                font-weight: 600 !important;
                                text-decoration: underline !important;
                            }

                            .Adra-MR-chatbot .incoming-msg-text ol,
                            .Adra-MR-chatbot .incoming-msg-text ul {
                                margin-left: 15px
                            }

                            .Adra-MR-chatbot .triangle-left {
                                margin-left: 10px;
                                width: 0;
                                height: 0;
                                border-top: 10px solid var(--overall-theme);
                                border-left: 12px solid transparent;
                                display:none
                            }

                            .Adra-MR-chatbot .outgoing-msg {
                                display: flex;
                                float: right;
                                width: 85%;
                                justify-content: end;
                                margin-bottom: 1rem;
                            }

                            .Adra-MR-chatbot .incoming-timeFontSize {
                                float: right;
                                margin-top: 30px;
                            }

                            .Adra-MR-chatbot .placeholder-msg-time {
                                float: right;
                                margin-top: 30px;
                                font-size: 10.5px;
                                display:none
                            }

                            .Adra-MR-chatbot .incoming-msg-time {
                                float: right;
                                margin-top: 25px;
                                font-size: 10.5px;
                            }

                            .Adra-MR-chatbot .outgoing-msg-time {
                                float: right;
                                margin-top: 25px;
                                font-size: 10.5px;
                            }

                            .Adra-MR-chatbot .triangle-right {
                                margin-right: 10px;
                                width: 0;
                                height: 0;
                                border-top: 10px solid var(--overall-theme);;
                                border-right: 12px solid transparent;
                                display:none
                            }

                            .Adra-MR-chatbot .outgoing-msg-text {
                                margin-right: 15px;
                                background:rgb(90, 90, 90); !important;
                                color: #fff;
                                font-size: 30px;
                                padding: 10px;
                                border-radius: 8px;
                                border-top-right-radius: 0px;
                                font-size: 14.5px;
                                word-wrap: break-word;
                                word-break: break-word;
                                max-width: 100%;
                            }

                            .d-none {
                                display: none;
                            }

                            .Adra-MR-chatbot .dots-loader {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                gap: 8px;
                                margin-left:15px;
                                margin-top:15px
                            }

                            .Adra-MR-chatbot .dots-loader span {
                                width: 8px;
                                height: 8px;
                                background-color: #fff;
                                border-radius: 50%;
                                animation: bounce 1s infinite ease-in-out;
                            }

                            .Adra-MR-chatbot .dots-loader span:nth-child(2) {
                                animation-delay: 0.3s;
                            }

                            .Adra-MR-chatbot .dots-loader span:nth-child(3) {
                                animation-delay: 0.6s;
                            }

                            @keyframes bounce {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-20px);
                            }
                            }


                            /* media-queries */
                            @media (max-width:490px) {
                                .Adra-MR-chatbot {
                                    width: 100%;
                                    height: 100%;
                                    bottom: 0px;
                                    right: 0px;
                                    left:0px;
                                    z-index: 1;
                                }

                            .Adra-MR-chatbot header {
                                    background-color: var(--overall-theme);
                                    position: relative;
                                }

                            .Adra-MR-chatbot .Adra-MR-chatbox {
                                height: 510px;
                                overflow-y: scroll;
                                padding: 15px 20px 10px;
                                height: 76vh; 
                                background-color:#040404 !important;
                            }

                            .Adra-MR-chatbot .incoming-msg {
                                display: flex;
                                width: 75%;
                                margin-bottom: 1rem;
                            }
                            .Adra-MR-chatbot .outgoing-msg {
                                display: flex;
                                float: right;
                                width: 65%;
                                justify-content: end;
                                margin-bottom: 1rem;
                            }

                            .Adra-MR-chatbot header .close-icon {
                                    display: block;
                            }

                            .Adra-MR-chatbot {
                                    opacity: 0 !important;
                             }

                            .Adra-MR-show-chatbot .Adra-MR-chatbot {
                                    opacity: 1 !important;
                                }

                            .Adra-MR-chatbot .dots-loader span {
                                width: 5px;
                                height: 5px;
                                background-color: #fff;
                                border-radius: 50%;
                                animation: bounce 1s infinite ease-in-out;
                            }

                            @keyframes bounce {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-10px);
                            }
                            }

                            }
                                `

                ;
            document.head.appendChild(styleTag);
        },

        renderChatWidget: function (client_id, client_secret, domain, containerId) {
            let container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement("div");
                container.id = containerId;
                document.body.appendChild(container);
            }

            container.innerHTML = ``;

            this.initializeChatLogic(client_id, client_secret, domain, container);
        },

        initializeChatLogic: function (client_id, client_secret, domain, container) {

            // window.addEventListener("beforeunload", (event) => {
            //     event.preventDefault();
            //     event.returnValue = "";
            //     hideWidget()
            // });

            var feedbackInput;
            var feedbackValue;
            var starRating = 0;
            var stars;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);



            function getStarValue(event) {
                if (event.target.tagName === "INPUT") {
                    const rating = event.target.value;
                    starRating = rating;
                    if (rating <= 3) {
                        handleGiveFeedback()
                    } else {
                        hideWidget()
                    }
                }
            }


            function clearStarValue() {
                document.querySelectorAll('.stars input').forEach(input => {
                    input.checked = false;
                });

                starRating = 0;
            }


            const handleGiveFeedback = () => {
                const feedbackInputField = document.getElementById("feedback-input-field");
                feedbackInputField.classList.add("show");
                feedbackInputField.focus();

                const feedbackButtonContainer = document.getElementById("feedback-button-container");
                feedbackButtonContainer.classList.add("hide");

                const feedbackSubmitButtonContainer = document.getElementById("feedback-submit-button-container");
                feedbackSubmitButtonContainer.classList.add("show");

                const feedbackQuestion = document.getElementById("feedback-question");
                feedbackQuestion.innerText = "Please specify the query intent and your feedback below";

                const updateSubmitButtonState = () => {
                    if (feedbackInputField.value.trim().length === 0) {
                        feedbackSubmitButtonContainer.style.opacity = "0.3";
                        feedbackSubmitButtonContainer.style.pointerEvents = "none";
                    } else {
                        feedbackSubmitButtonContainer.style.opacity = "1";
                        feedbackSubmitButtonContainer.style.pointerEvents = "all";
                    }
                };
                updateSubmitButtonState();

                feedbackInputField.addEventListener("input", updateSubmitButtonState);

                feedbackSubmitButtonContainer.addEventListener("click", hideWidget)
                feedbackInputField.addEventListener("keydown", (e) => {
                    if (isMobile) {
                        return;
                    }
                    if (e.key === "Enter" && e.shiftKey) {
                        return
                    };

                    if (e.key === "Enter") {
                        if (feedbackInputField.value.trim() === "") {
                            e.preventDefault();
                            return;
                        } else {
                            e.preventDefault();
                            hideWidget();
                        }
                    }
                });
            };


            const MRChatbotSection = document.getElementById('Adra-MR-chatbot-section')
            MRChatbotSection.className = "Adra-MR-chatbot-section"

            const loadingContainer = document.createElement("div")
            loadingContainer.className = "loading-container"
            loadingContainer.innerHTML = `<div class="spinner"></div>`;

            const feedbackModal = document.createElement("div");
            feedbackModal.className = "feedback-modal";
            feedbackModal.innerHTML = `<div id="feedback-container" class="feedback-container">
                                     <p id="feedback-question">Please rate your experience with us</p>
                                     <div class="stars" id="stars">
                                         <input type="radio" id="star5" name="rating" value="5">
                                         <label for="star5">★</label>
 
                                         <input type="radio" id="star4" name="rating" value="4">
                                         <label for="star4">★</label>
 
                                         <input type="radio" id="star3" name="rating" value="3">
                                         <label for="star3">★</label>
 
                                         <input type="radio" id="star2" name="rating" value="2">
                                         <label for="star2">★</label>
 
                                         <input type="radio" id="star1" name="rating" value="1">
                                         <label for="star1">★</label>
                                     </div>
                                     <textarea type="text" placeholder="Enter your feedback here" id="feedback-input-field" class="feedback-input-field" ></textarea>
                                     <div id="feedback-button-container" class="feedback-button-container" >
                                         <button style="background-color: var(--overall-theme); color: #fff; border: none; width: 50%; border-radius: 5px; padding: 3px;" onclick="handleGiveFeedback()">Yes</button>
                                         <button style="background-color: lightgrey; color: #000; border: none; width: 50%; border-radius: 5px; padding: 3px;" onclick="hideWidget()">No</button>
                                     </div>
                                     <div id="feedback-submit-button-container" class="feedback-submit-button-container" >
                                         <button id="feedback-submit-button" style="background-color: var(--overall-theme); color: #fff; border: none; width: 100%; border-radius: 5px; padding: 8px;cursor:pointer">Submit</button>
                                     </div>
                                  </div>`;

            const MRChatbot = document.createElement("div")
            MRChatbot.className = "Adra-MR-chatbot"

            const MRheader = document.createElement("header")
            MRheader.className = "Adra-MR-header"
            const MROnlineStatusContainer = document.createElement('div')
            MROnlineStatusContainer.className = "Adra-MR-header-online-status-container"
            MROnlineStatusContainer.innerHTML = `
                                            <div class="Adra-MR-online-status-container" style="display: flex;justify-content: space-between;align-items: center;">
                                                <div class="Adra-MR-header-online-status-container"  style="display: flex;gap: 11px;margin:18px 0 16px 28px">
                                                 <img src="https://d1olhs2thomfrd.cloudfront.net/adra_black_logo.png" alt="adra-logo" />   
                                                <div>
                                                    <p style="font-family: Inter;font-size:16px;color: #000;margin-bottom: 0px">AI Agent</p>
                                                    <p>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                                                        <circle cx="3" cy="3" r="3" fill="#41A61D" />
                                                        </svg>
                                                    </span>
                                                    <span style="font-size:10px;font-family: Inter;color: #000;">Online</span>
                                                    </p>
                                                </div>
                                                </div>
                                                <div class="Adra-MR-header-brand-image" style="align-self:self-end;margin-bottom: -6px;">
                                                
                                                </div>
                                            </div>`
            const minimizedScreenCloseIcon = document.createElement("p")
            minimizedScreenCloseIcon.className = "MR material-symbols-outlined close-icon chatbot-close-icon"
            minimizedScreenCloseIcon.innerText = "close"
            MRheader.append(MROnlineStatusContainer)

            const MRChatContainer = document.createElement("div")
            MRChatContainer.setAttribute("class", "Adra-MR-chat-container")
            MRChatContainer.setAttribute("id", "Adra-MR-chat-container")

            const MRChatboxUl = document.createElement("ul")
            MRChatboxUl.setAttribute("class", "Adra-MR-chatbox")
            MRChatboxUl.setAttribute("id", "Adra-MR-chatbox")
            const MRBotStarterMessage = document.createElement("div")
            MRBotStarterMessage.setAttribute("class", "Adra-MR-botText")
            MRBotStarterMessage.setAttribute("id", "Adra-MR-botStarterMessage")
            const MRIncomingMsg = document.createElement("div")
            MRIncomingMsg.className = "d-flex incoming-msg"
            const MRBottomChat = document.createElement("div")
            MRBottomChat.setAttribute("id", "Adra-MR-bottom-chat")
            MRBotStarterMessage.append(MRIncomingMsg)
            MRChatboxUl.append(MRBotStarterMessage, MRBottomChat)
            MRChatContainer.append(MRChatboxUl)

            const MRChatInput = document.createElement("div")
            MRChatInput.className = "Adra-MR-chat-input"

            const MRUserInputText = document.createElement("textarea")
            MRUserInputText.setAttribute("autofocus", "")
            MRUserInputText.setAttribute("class", "Adra-MR-userInputText")
            MRUserInputText.setAttribute("id", "Adra-MR-userInputText")
            MRUserInputText.setAttribute("placeholder", "Enter a message...")
            MRUserInputText.setAttribute("required", "")
            MRUserInputText.style.fontSize = "14.5px";
            // MRSendbtnSpan.innerText = "send"
            const MRSendbtnSpan = document.createElement("p")
            MRSendbtnSpan.className = ""
            MRSendbtnSpan.setAttribute("id", "Adra-MR-send-btn")
            MRSendbtnSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="#000">
                                        <path d="M15.8011 24.3671C14.49 24.3671 12.6344 23.4449 11.1678 19.0338L10.3677 16.6338L7.96773 15.8338C3.56773 14.3671 2.64551 12.5116 2.64551 11.2004C2.64551 9.90041 3.56773 8.03374 7.96773 6.55596L17.4011 3.41152C19.7567 2.62263 21.7233 2.85596 22.9344 4.05596C24.1456 5.25596 24.3789 7.23374 23.59 9.58929L20.4456 19.0227C18.9678 23.4449 17.1122 24.3671 15.8011 24.3671ZM8.48995 8.14485C5.40106 9.17818 4.30106 10.4004 4.30106 11.2004C4.30106 12.0004 5.40106 13.2227 8.48995 14.2449L11.29 15.1782C11.5344 15.256 11.7344 15.456 11.8122 15.7004L12.7456 18.5004C13.7678 21.5893 15.0011 22.6893 15.8011 22.6893C16.6011 22.6893 17.8233 21.5893 18.8567 18.5004L22.0011 9.06707C22.5678 7.35596 22.4678 5.95596 21.7456 5.23374C21.0233 4.51152 19.6233 4.42263 17.9233 4.98929L8.48995 8.14485Z" fill="#000"/>
                                        <path d="M11.2344 16.3334C11.0233 16.3334 10.8121 16.2557 10.6455 16.089C10.3233 15.7668 10.3233 15.2334 10.6455 14.9112L14.6233 10.9223C14.9455 10.6001 15.4788 10.6001 15.8011 10.9223C16.1233 11.2446 16.1233 11.7779 15.8011 12.1001L11.8233 16.089C11.6677 16.2557 11.4455 16.3334 11.2344 16.3334Z" fill="#000"/>
                                       </svg>`
            const updateSendButtonState = () => {
                if (MRUserInputText.value.trim().length === 0) {
                    MRSendbtnSpan.style.pointerEvents = "none";
                    MRSendbtnSpan.style.opacity = "0.50";
                } else {
                    MRSendbtnSpan.style.pointerEvents = "all";
                    MRSendbtnSpan.style.opacity = "1";
                }
            };
            updateSendButtonState();

            MRUserInputText.addEventListener("input", updateSendButtonState);

            MRChatInput.append(MRUserInputText, MRSendbtnSpan)
            MRChatbot.append(loadingContainer, feedbackModal, MRheader, MRChatContainer, MRChatInput)

            const MRChatbotToggler = document.createElement("div")
            MRChatbotToggler.className = "Adra-MR-chatbot-toggler"
            const MRMessageIcon = document.createElement("p");
            MRMessageIcon.className = "message-icon";
            MRMessageIcon.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                    <path d="M9.20703 11.375H16.7904" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M7.58464 19.9658H11.918L16.7388 23.1725C17.4538 23.6491 18.418 23.14 18.418 22.2733V19.9658C21.668 19.9658 23.8346 17.7991 23.8346 14.5491V8.04911C23.8346 4.79911 21.668 2.63245 18.418 2.63245H7.58464C4.33464 2.63245 2.16797 4.79911 2.16797 8.04911V14.5491C2.16797 17.7991 4.33464 19.9658 7.58464 19.9658Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                `;

            const MRCloseIcon = document.createElement("p");
            MRCloseIcon.className = "close-icon";
            MRCloseIcon.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.4988 0.500016C15.2644 0.265678 14.9465 0.134033 14.615 0.134033C14.2836 0.134033 13.9657 0.265678 13.7313 0.500016L7.9988 6.23252L2.2663 0.500016C2.03189 0.265678 1.714 0.134033 1.38255 0.134033C1.05109 0.134033 0.733205 0.265678 0.498796 0.500016C0.264457 0.734426 0.132812 1.05231 0.132812 1.38377C0.132812 1.71522 0.264457 2.03311 0.498796 2.26752L6.2313 8.00002L0.498796 13.7325C0.264457 13.9669 0.132813 14.2848 0.132812 14.6163C0.132813 14.9477 0.264457 15.2656 0.498796 15.5C0.733205 15.7344 1.05109 15.866 1.38255 15.866C1.714 15.866 2.03189 15.7344 2.2663 15.5L7.9988 9.76752L13.7313 15.5C13.9657 15.7344 14.2836 15.866 14.615 15.866C14.9465 15.866 15.2644 15.7344 15.4988 15.5C15.7331 15.2656 15.8648 14.9477 15.8648 14.6163C15.8648 14.2848 15.7331 13.9669 15.4988 13.7325L9.7663 8.00002L15.4988 2.26752C15.7331 2.03311 15.8648 1.71522 15.8648 1.38377C15.8648 1.05231 15.7331 0.734426 15.4988 0.500016V0.500016Z" fill="white"/>
                                    </svg>
                                `;
            MRChatbotToggler.append(MRMessageIcon, MRCloseIcon)
            MRChatbotSection.append(MRChatbot, MRChatbotToggler)
            document.body.append(MRChatbotSection)

            let timerRef = null;
            let randomNumber = null;

            const randomNumberGenerate = () => {
                return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
            }

            const triangleLeft = document.createElement("div");
            triangleLeft.className = "triangle-left";
            const incomingMsgBox1 = document.createElement("div");
            incomingMsgBox1.className = "d-flex placeholder-msg";
            const essenceImg = document.createElement("img");
            essenceImg.className = "essence-img";
            essenceImg.setAttribute(
                "src",
                "https://d1olhs2thomfrd.cloudfront.net/adra-white-logo.png"
            );




            const incomingMsgText = document.createElement("p");
            incomingMsgText.className = "placeholder-msg-text";

            incomingMsgText.innerHTML = `<div class="dots-loader">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>`;
            const incomingMsgTime = document.createElement("span");
            incomingMsgTime.className = "placeholder-msg-time";
            incomingMsgTime.innerText = formatAMPM(new Date());
            incomingMsgText.append(incomingMsgTime);
            const bottomChat1 = document.createElement("div");
            incomingMsgBox1.append(essenceImg, triangleLeft, incomingMsgText, bottomChat1);

            MRChatboxUl.append(incomingMsgBox1);

            const welcomeMessage = async () => {
                (async () => {
                    await generateToken();
                })();
            };

            const generateToken = async () => {
                // const url = "https://consumerapi.modelrocket.ai/gettoken";
                const url = "http://10.10.1.165:5000/gettoken";
                const username = client_id;
                const password = client_secret;
                const base64Credentials = btoa(`${username}:${password}`);

                fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Basic ${base64Credentials}`,
                        domain: domain
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.error_code === 200) {
                            apiToken = data.data.token;
                            (async () => {
                                await getData("init", "");
                            })();
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            };


            const handleToggler = async (value) => {
                if (value === "openWidget") {
                    MRChatboxUl.innerHTML = "";
                    MRUserInputText.value = ""
                    const feedbackInputField = document.getElementById("feedback-input-field");
                    feedbackInputField.classList.remove("show")
                    feedbackInput = document.getElementById("feedback-input-field");
                    feedbackInput.value = "";
                    feedbackModal.classList.remove("show")
                    const feedbackButtonContainer = document.getElementById("feedback-button-container")
                    feedbackButtonContainer.classList.remove("hide")

                    const feedbackSubmitButtonContainer = document.getElementById("feedback-submit-button-container")
                    feedbackSubmitButtonContainer.classList.remove("show")

                    incomingMsgBox1.className = "d-flex placeholder-msg";
                    MRChatboxUl.append(incomingMsgBox1);
                    MRChatbotSection.classList.add("Adra-MR-show-chatbot");
                    (async () => {
                        await welcomeMessage();
                    })();
                    randomNumber = randomNumberGenerate()
                }

                else {
                    feedbackModal.classList.add("show")
                    MRChatbotToggler.style.pointerEvents = "none"
                    MRChatbotToggler.style.opacity = "0.3"

                    stars = document.getElementById("stars");
                    if (stars !== undefined) {
                        stars.addEventListener("click", getStarValue);
                    }
                }
            };



            window.addEventListener('DOMContentLoaded', handleToggler("openWidget"))




            const hideWidget = () => {
                feedbackInput = document.getElementById("feedback-input-field");
                feedbackValue = feedbackInput.value;
                resetIdleTracking("close")
            }


            MRChatbotToggler.addEventListener("click", () => {
                if (MRChatbotSection.className.includes("Adra-MR-show-chatbot")) {
                    handleToggler("closeWidget")
                } else {
                    handleToggler("openWidget")
                }

            });

            minimizedScreenCloseIcon.addEventListener("click", function () {
                handleToggler("closeWidget")
                // MRChatbotSection.classList.remove("Adra-MR-show-chatbot");
            });



            function formatAMPM(date) {
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? "pm" : "am";
                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                var strTime = hours + ":" + minutes + " " + ampm;
                return strTime;
            }

            let apiToken;





            const getData = async (flag, userInputTextValue) => {
                if (userInputTextValue) {
                    MRUserInputText.blur();
                    MRUserInputText.style.pointerEvents = "none"

                    const triangleLeft = document.createElement("div");
                    triangleLeft.className = "triangle-left";
                    var incomingMsgBox2 = document.createElement("div");
                    incomingMsgBox2.className = "d-flex placeholder-msg";
                    var essenceImg2 = document.createElement("img");
                    essenceImg2.className = "essence-img";
                    essenceImg2.setAttribute(
                        "src",
                        "https://d1olhs2thomfrd.cloudfront.net/adra-white-logo.png"
                    );
                    var incomingMsgText2 = document.createElement("p");
                    incomingMsgText2.className = "placeholder-msg-text";
                    incomingMsgText2.innerHTML = `<div class="dots-loader">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>`;
                    var incomingMsgTime2 = document.createElement("span");
                    incomingMsgTime2.className = "placeholder-msg-time";
                    incomingMsgTime2.innerText = formatAMPM(new Date());
                    incomingMsgText2.append(incomingMsgTime2);
                    var bottomChat2 = document.createElement("div");
                    incomingMsgBox2.append(essenceImg2, triangleLeft, incomingMsgText2, bottomChat2);

                    MRChatboxUl.append(incomingMsgBox2);
                }

                var requiredParams;
                var dataObject;

                if (flag === "close") {
                    loadingContainer.classList.add("show")
                    requiredParams = {
                        // client_name: "ModelRocket",
                        // service_name: "Sales Knowledge Worker MR-H",
                        // language: "english",
                        // msg: userInputTextValue.trim(),
                        // flag: flag,
                        // feedback: feedbackValue === "" ? "" : feedbackValue.trim(),
                        // rating: starRating
                        session_id: "+918870048394",
                        msg: userInputTextValue.trim(),
                        flag: flag
                    };

                } else {
                    requiredParams = {
                        // client_name: "ModelRocket",
                        // service_name: "Sales Knowledge Worker MR-H",
                        // language: "english",
                        // msg: userInputTextValue.trim(),
                        // flag: flag,
                        session_id: "+918870048394",
                        msg: userInputTextValue.trim(),
                        flag: flag
                    };
                }

                // const url = "https://consumerapi.modelrocket.ai/chatbot_widget";
                const url = "http://10.10.1.165:5000/chatbot_widget";

                await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiToken}`,
                        domain: domain
                    },
                    body: JSON.stringify(requiredParams),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {

                        dataObject = data.data
                        incomingMsgBox1.className = "d-none"
                        if (incomingMsgBox2) {
                            incomingMsgBox2.className = "d-none"
                        }
                        if (data.error_code === 201) {
                            apiData = data.data.message;
                            clearTimeout(timerRef);
                            randomNumber = randomNumberGenerate()
                            setTimeout(() => {
                                closeChat()
                            }, 1500);

                        } else {
                            if (data.error_code === 200 && data.data.message === "Your chat has been closed.") {
                                closeChat()
                                return
                            } else {
                                apiData = data.data.message;
                                if (feedbackModal.classList.contains("show")) {
                                    MRUserInputText.blur();
                                } else {
                                    if (window.screen.width > 490) {
                                        MRUserInputText.style.pointerEvents = "all"
                                        MRUserInputText.focus();
                                    } else {
                                        MRUserInputText.style.pointerEvents = "all"
                                        MRUserInputText.setAttribute("readonly", "readonly");
                                        MRUserInputText.focus();
                                        MRUserInputText.removeAttribute("readonly");
                                    }
                                }
                                // resetIdleTracking("continous");
                            }
                        }
                    })
                    .catch((error) => {
                        incomingMsgBox1.className = "d-none"

                        const incomingMsgBox = document.createElement("div");
                        incomingMsgBox.className = "d-flex incoming-msg";
                        const essenceImg = document.createElement("img");
                        essenceImg.className = "essence-img";
                        essenceImg.setAttribute(
                            "src",
                            "https://d1olhs2thomfrd.cloudfront.net/adra-white-logo.png"
                        );

                        const incomingMsgText = document.createElement("p");
                        incomingMsgText.className = "incoming-msg-text";
                        incomingMsgText.innerHTML = `Something went wrong.Please try again later`;
                        const incomingMsgTime = document.createElement("span");
                        incomingMsgTime.className = "incoming-msg-time";
                        incomingMsgTime.innerText = formatAMPM(new Date());
                        incomingMsgText.append(incomingMsgTime);
                        const bottomChat1 = document.createElement("div");
                        incomingMsgBox.append(essenceImg, incomingMsgText, bottomChat1);
                        MRChatboxUl.append(incomingMsgBox);
                        bottomChat1.scrollIntoView({ behavior: "smooth" });
                        console.error("Error:", error);
                    });


                if (Object.keys(dataObject).length === 0) {

                } else if (Object.keys(dataObject).length) {
                    const incomingMsgBox = document.createElement("div");
                    incomingMsgBox.className = "d-flex incoming-msg";
                    const essenceImg = document.createElement("img");
                    essenceImg.className = "essence-img";
                    essenceImg.setAttribute(
                        "src",
                        "https://d1olhs2thomfrd.cloudfront.net/adra-white-logo.png"
                    );


                    const triangleLeft = document.createElement("div");
                    triangleLeft.className = "triangle-left";
                    const incomingMsgText = document.createElement("p");
                    incomingMsgText.className = "incoming-msg-text";
                    incomingMsgText.innerHTML = `${apiData}`;
                    const links = incomingMsgText.querySelectorAll("a");
                    links.forEach(link => {
                        link.setAttribute("target", "_blank");
                        link.setAttribute("rel", "noopener noreferrer");
                    });
                    const incomingMsgTime = document.createElement("span");
                    incomingMsgTime.className = "incoming-msg-time";
                    incomingMsgTime.innerText = formatAMPM(new Date());
                    incomingMsgText.append(incomingMsgTime);
                    const bottomChat1 = document.createElement("div");
                    incomingMsgBox.append(essenceImg, triangleLeft, incomingMsgText, bottomChat1);

                    if (apiData !== undefined) {
                        MRChatboxUl.append(incomingMsgBox);
                    }
                    bottomChat1.scrollIntoView({ behavior: "smooth" });
                } else {
                    const incomingMsgBox = document.createElement("div");
                    incomingMsgBox.className = "d-flex incoming-msg";
                    const essenceImg = document.createElement("img");
                    essenceImg.className = "essence-img";
                    essenceImg.setAttribute(
                        "src",
                        "https://d1olhs2thomfrd.cloudfront.net/adra-white-logo.png"
                    );


                    const incomingMsgText = document.createElement("p");
                    incomingMsgText.className = "incoming-msg-text";
                    incomingMsgText.innerHTML = `Something went wrong.Please try again later!`;
                    const incomingMsgTime = document.createElement("span");
                    incomingMsgTime.className = "incoming-msg-time";
                    incomingMsgTime.innerText = formatAMPM(new Date());
                    incomingMsgText.append(incomingMsgTime);
                    const bottomChat1 = document.createElement("div");
                    incomingMsgBox.append(essenceImg, incomingMsgText, bottomChat1);
                    MRChatboxUl.append(incomingMsgBox);
                    bottomChat1.scrollIntoView({ behavior: "smooth" });
                }
            };

            const generateResponse = async (flag, value) => {
                (async () => {
                    await getData(flag, value);
                })();
            };

            function handleSendClick() {
                const triangleRight = document.createElement("div");
                triangleRight.className = "triangle-right";
                const outgoingMsgBox = document.createElement("div");
                outgoingMsgBox.className = "d-flex outgoing-msg";
                const outgoingMsgText = document.createElement("p");
                outgoingMsgText.className = "outgoing-msg-text";
                outgoingMsgText.innerText = MRUserInputText.value.trim();
                const outgoingMsgTime = document.createElement("span");
                outgoingMsgTime.className = "outgoing-msg-time";
                outgoingMsgTime.innerText = formatAMPM(new Date());
                outgoingMsgText.append(outgoingMsgTime);


                const personImg = document.createElement("img");
                personImg.className = "person-img";
                personImg.setAttribute(
                    "src",
                    "https://d2jcmbeljpidf8.cloudfront.net/user-image.png"
                );

                outgoingMsgBox.append(outgoingMsgText, triangleRight, personImg);

                const bottomChat1 = document.createElement("div");
                MRChatboxUl.append(outgoingMsgBox, bottomChat1);

                bottomChat1.scrollIntoView({ behavior: "smooth" });

                setTimeout(() => {
                    generateResponse("step", MRUserInputText.value);
                    MRUserInputText.value = "";
                    updateSendButtonState()
                    bottomChat1.scrollIntoView({ behavior: "smooth" });
                }, 0);
            }


            MRUserInputText.addEventListener("keydown", (e) => {
                if (isMobile) {
                    return;
                }
                if (e.key === "Enter" && e.shiftKey) {
                    return;
                }
                if (e.key === "Enter") {
                    if (MRUserInputText.value.trim() === "") {
                        e.preventDefault();
                        return;
                    } else {
                        e.preventDefault();
                        handleSendClick();
                    }
                }
            });


            MRSendbtnSpan.addEventListener("click", (e) => {
                handleSendClick();
            });


            const resetIdleTracking = (value) => {
                if (timerRef) {
                    clearTimeout(timerRef);
                }
                if (value === "close") {
                    startIdleTracking("close");
                } else {
                    startIdleTracking("continous")
                }

            };

            const startIdleTracking = async (value) => {
                if (value === "close") {
                    await getData("close", "");
                } else {
                    timerRef = setTimeout(async () => {
                        const response = await generateResponse("step", "");
                        if (response) {
                            resetIdleTracking("continous");
                        }
                    }, 5000);
                }
            };

            const closeChat = () => {
                loadingContainer.classList.remove("show")
                MRChatbotSection.classList.remove("Adra-MR-show-chatbot");
                const feedbackQuestion = document.getElementById("feedback-question")
                feedbackQuestion.innerText = "Please rate your experience with us";
                MRUserInputText.value = ""
                feedbackModal.classList.remove("show")
                MRChatboxUl.innerHTML = "";
                clearStarValue()
                MRChatbotToggler.style.pointerEvents = "all"
                MRChatbotToggler.style.opacity = "1"
                return
            }
        }
    }

    window.ChatWidget = ChatWidget;
})(window, document);
