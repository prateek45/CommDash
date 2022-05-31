import axios from './axios';
import React, { useState } from 'react'
import "./ChatInput.css";
import { useStateValue } from "./StateProvider";

global.URLSearchParams = URLSearchParams;
function ChatInput({ type, channelName, channelId }) {
    const [input, setInput] = useState("");
    const [{ user }] = useStateValue();

    const sendMessage = (e) => {
        e.preventDefault();
        var parameters = {
            type: type,
            title: channelName,
            id : channelId
        }; 
    
        const params = new URLSearchParams(parameters);
        if (channelId) {
            if (type == "group") {
                axios.post(`/new/groupmessage?${params}`, {
                    message: input,
                    timestamp: Date.now(),
                    user: user.Fname ,
                    userImage: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                })
            } else {
                axios.post(`/new/message?${params}`, {
                    message: input,
                    timestamp: Date.now(),
                    user: user.Fname ,
                    userImage: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                })
            }
           
        }
        setInput("");
    };
    return (
        <div className="chatInput">
            <form>
                
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message #${channelName?.toLowerCase()}`}
                />
                <button type="sumbit" onClick={sendMessage}>SEND</button>
            
                
            </form>
        </div>
    )
}

export default ChatInput
