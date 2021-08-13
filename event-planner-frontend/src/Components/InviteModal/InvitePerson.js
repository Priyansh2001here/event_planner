import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";

import "./InvitePerson.css";
import axios from "axios";
import csrftoken from "../../csrftoken";

function InvitePerson({name, email, id}) {
    const [isInvited, setIsInvited] = React.useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const handleAdd = async (e) => {
        const targetUserID = e.target.id;
        const eventID = localStorage.getItem('eventID');
        const config = {
            headers: {
                "Content-type": "application/json",
                'X-CSRFToken': csrftoken
            },
        };
        setIsBtnDisabled(true);
        try {
            const response = await axios.post(
                "/events/invites",
                {
                    event: eventID,
                    target_user: targetUserID
                },
                config
            );
            if (response.status === 201) {
                setIsInvited(true);
            } else {
                alert('Network Error')
            }
        } catch (e) {
            alert(e.message)
        }
        setIsBtnDisabled(false);
    };


    return (
        <div className="search__person">
            <div className="sp__details">
                <div className="sp__details__avatar">
                    <Avatar
                        alt={name}
                        src="/static/images/avatar/1.jpg"
                        className="invite__avatar"
                    />
                </div>
                <div className="sp__details__cred">
                    <h3>{name}</h3>
                    <p>{email}</p>
                </div>
            </div>

            <div className="sp__add">
                <button
                    id={id}
                    style={isBtnDisabled ? {pointerEvents: "none", borderColor: "gray", color: "gray"} : {}}
                    type="submit"
                    onClick={handleAdd}
                    className={!isInvited ? "addButton" : "addedButton"}
                >
                    {isInvited ? "Invited" : isBtnDisabled ? "Inviting..." : "Invite"}
                </button>
            </div>
        </div>
    );
}

export default InvitePerson;
