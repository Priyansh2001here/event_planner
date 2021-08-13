import axios from 'axios';
import React from 'react'
import {Link} from 'react-router-dom'
import csrftoken from "../../csrftoken";
import './Invite.css'
import {convertNoIntoCategory} from "../ConvertNoIntoCategory";

function Invite({type, event}) {

    const acceptInviteReqeuest = async (e) => {
        const clickedBtn = e.target;
        console.log(clickedBtn.id)
        const inviteBox = clickedBtn.closest('.inviteBox');
        clickedBtn.classList.add('fa-spinner', 'fa-spin');
        try {
            const response = await axios.post('/events/accept_invite', {
                id: clickedBtn.id
            }, {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });
            console.log(response)
            clickedBtn.classList.remove('fa-spinner', 'fa-spin');
            if (response.status === 201 || response.status === 200) {
                inviteBox.innerHTML = `<p style="font-size:20px; width:100%; text-align:center; padding:10px;">Accepted!</p>`;
                inviteBox.style.animation = 'acceptAndDecline forwards ease 0.5s'
                setTimeout(() => inviteBox.remove(), 500);
            } else {
                alert('Could not Accept Request, please try again later');
            }
        } catch (e) {
            clickedBtn.classList.remove('fa-spinner', 'fa-spin');
            alert(e.message);
        }
    }

    const declineInviteRequest = async (e) => {
        const clickedBtn = e.target;
        const inviteBox = clickedBtn.closest('.inviteBox');
        clickedBtn.classList.toggle('fa-times');
        clickedBtn.classList.add('fa-spinner', 'fa-spin');
        try {
            const response = await axios.post('/events/decline_invite', {
                id: clickedBtn.id
            }, {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });
            console.log(response)
            clickedBtn.classList.remove('fa-spinner', 'fa-spin');
            if (response.status === 200) {
                inviteBox.innerHTML = `<p style="font-size:20px; width:100%; text-align:center; padding:10px;">Declined!</p>`;
                inviteBox.style.animation = 'acceptAndDecline forwards ease 0.5s'
                setTimeout(() => inviteBox.remove(), 500);
            } else {
                alert('Could not Decline Request, please try again later');
            }
        } catch (e) {
            clickedBtn.classList.toggle('fa-times');
            clickedBtn.classList.remove('fa-spinner', 'fa-spin');
            alert(e.message);
        }
    }

    if (type == "invite") {
        return (
            <div className="inviteBox" tabIndex={0}>
                <div className="inviteInfo">
                    <div className="inviteEventProfilePhoto">
                        <img src={event.event_detail.image} alt=""/>
                    </div>
                    <div className="inviteEventNameAndOwner">
                        <p className="inviteEventName">{event.event_detail.title}</p>
                        <p className="inviteEventOwner">{event.sender}</p>
                    </div>
                </div>
                <div className="inviteOptions">
                    <div id={event.id} className="inviteOption" onClick={acceptInviteReqeuest}><i id={event.id} className=" fa fa-check"/></div>
                    <div id={event.id} className="inviteOption" onClick={declineInviteRequest}><i id={event.id} className=" fa fa-times"/></div>
                </div>
            </div>
        )
    } else if (type == "notif") {
        return (
            <div className="inviteBox" tabIndex={0}>
                <div className="inviteInfo">
                    <div className="inviteEventProfilePhoto">
                        <img src={event.eventPhoto} alt=""/>
                    </div>
                    <div className="inviteEventNameAndOwner">
                        <p className="notifText">Only 1 day left for your assigned task </p>
                        <p className="inviteEventOwner">Get Decorating Materials</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="inviteBox" tabIndex={0}>
                <div className="inviteInfo">
                    <div className="inviteEventProfilePhoto">
                        <img src={event.image} alt=""/>
                    </div>
                    <div className="inviteEventNameAndOwner">
                        <p className="inviteEventName" style={{width: '320px'}}>{event.title}</p>
                        <p className="inviteEventOwner">{event.owner_name} &middot; {convertNoIntoCategory(parseInt(event.type_of_event))}</p>
                    </div>
                </div>
            </div>
        )
    }

}

export default Invite
