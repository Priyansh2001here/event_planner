import React from 'react'
import './mp.css'

function ManageParticipantMenu({showPopUp,setShowPopUp}) {


    const handleAdminRights = () => {
        // setShowPopUp(false)
    }

    const removeParticipant = () => {
        // setShowPopUp(false)
    }


    return (
        <div>
            <div  className={showPopUp ? "participantPopUp show" : "participantPopUp"}>
                <button className="addOrRemoveAdmin" onClick={handleAdminRights}><p>Make Admin</p></button>
                <button className="removeParticipant" onClick={removeParticipant}><p>Remove Participant</p></button>
            </div>
        </div>
    )
}

export default ManageParticipantMenu