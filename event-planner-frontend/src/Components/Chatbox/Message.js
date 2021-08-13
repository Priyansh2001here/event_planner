import {Avatar} from "@material-ui/core";
import React from "react";

import "./Message.css";

function Message({messageObj}) {
    const {timestamp, message, from_user, by_you} = messageObj;
    return (
        <>
            {!by_you ? (
                <div className="message">
                    <div className="message__chat">
                        <p className="message__name">{from_user}</p>
                        <p>{message}</p>
                    </div>
                    <div className="message__time">{new Date(timestamp).toLocaleString()}</div>
                </div>
            ) : (
                <div className="message__send">
                    <div className="message__chat__send">
                        {/*<p className="message__name__send">Lorem</p>*/}
                        <p>{message}</p>
                    </div>
                    <div className="message__time__send">{new Date(timestamp).toLocaleString()}</div>
                </div>
            )}
        </>
    );
}

export default Message;
