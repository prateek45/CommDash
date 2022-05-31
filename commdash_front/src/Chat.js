import React, { useState, useEffect, useCallback } from 'react'
import "./Chat.css"
import { useParams } from "react-router-dom"
import { InfoOutlined, StarBorderOutlined } from '@material-ui/icons';
import Message from './Message'
import ChatInput from './ChatInput';
import axios from './axios'; 
import Pusher from 'pusher-js';

const pusher = new Pusher('d2e40102bb65c4ab886c', {
    cluster: 'ap4'
});

global.URLSearchParams = URLSearchParams;
const Chat = () => {
    const { type,title,roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [roomMessages, setRoomMessages] = useState([]);

    const getConversation = useCallback(() => {
        var parameters = {type:type,
                        title: title,
                        id : roomId
                    }; 
        const params = new URLSearchParams(parameters);
        
        if (type == "group") {
            axios.get(`/get/groupconversation?${params}`).then((res) =>{
                setRoomDetails(title)
                setRoomMessages(res.data)
            })
        }  else {
            axios.get(`/get/conversation?${params}`).then((res) =>{
                setRoomDetails(title)
                setRoomMessages(res.data)
            })
        }
        
    },[type,title,roomId]);

    useEffect(() => {
                
        getConversation()

        //realtime processing
        const channel = pusher.subscribe('conversation');
        const grpChannel = pusher.subscribe('grps');

        channel.bind('newMessage', function(data) {
            getConversation()
        });

        grpChannel.bind('newgrps', function(data){
            getConversation()
          });
    },[getConversation])

    return (
        <div className="chat">
            <div className="chat__header">
                <div className="chat__headerLeft">
                    <h4 className="chat__channelName">
                    <strong> # General </strong>
                        {/* <strong> # {roomId} </strong> */}
                        {/* <strong>#general</strong> */}
                        <StarBorderOutlined />
                    </h4>
                </div>

                <div className="chat__headerRight">
                    <p><InfoOutlined /> Details</p>

                </div>
            </div>

            <div className="chat__messages">
                {roomMessages.map(({ message, timestamp, user, userImage }) => (
                    <Message
                        message={message}
                        timestamp={timestamp}
                        user={user}
                        userImage={userImage}
                    />
                ))}
            </div>
            <ChatInput type = {type} channelName={roomDetails} channelId={roomId} />
        </div>
    )
}

export default Chat
