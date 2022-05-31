import React from 'react';
import './SidebarOption.css'
import { useHistory } from "react-router-dom";
import axios from './axios'; 
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

const SidebarOption = ({ Icon, id, addChannelOption, title, type }) => {
    const history = useHistory();

    const selectChannel = () => {
        if (id) {
            history.push(`/room/${type}/${title}/${id}`)
        } else {
            history.push(`/${title}`);
        }
    };

    const addChannel = () => {
        const chatName = prompt("Please enter the channel name");

        if (chatName) {
            axios.post(`/new/chat?id=${id}`, {
                name: chatName,
            })
        }
    };
    return (
        <div onClick={addChannelOption ? addChannel : selectChannel}>
            {Icon ? (
                <ListItem button key= {title}>
                    <ListItemIcon><Icon /></ListItemIcon>
                    <ListItemText primary= {title} />
                </ListItem>
            ) : (
                     <ListItem button key={title}>
                        <ListItemIcon>#</ListItemIcon>
                        <ListItemText primary= {title} />
                    </ListItem>
                )}
        </div>
    )
}

export default SidebarOption
