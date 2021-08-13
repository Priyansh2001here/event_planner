import React, {useState} from "react";
import CircularProgress from "./CircularProgress";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CallReceivedIcon from "@material-ui/icons/CallReceived";

import "./EventInfo.css";
import EventInfoPerson from "./EventInfoPerson";
import InviteModal from "../InviteModal/InviteModal";
import TransferMoney from "../TransferMoney/TransferMoney";
import AddMoney from "../AddMoney/AddMoney";

function EventInfo({people, Loader}) {
    const [open, setOpen] = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [openLimit, setOpenLimit] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenTransfer = () => {
        setOpenTransfer(true);
    };

    const handleCloseTransfer = () => {
        setOpenTransfer(false);
    };

    const handleOpenLimit = () => {
        setOpenLimit(true);
    };

    const handleCloseLimit = () => {
        setOpenLimit(false);
    };

    return (
        <div
            style={
                Loader
                    ? {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }
                    : {}
            }
        >
            {Loader ? (
                <img
                    src="/static/loaderWifi.gif"
                    style={{width: "80px", height: "80px"}}
                />
            ) : (
                <div className="eventInfo">
                    <div className="eventInfo__budget">
                        <div className="eventInfo__budget__main">
                            <div className="eventInfo__budget__details">
                                <p>Total Budget</p>
                                <h3> ₹{people.amount_allocated} </h3>
                                <br/>
                                <p>Budget remaining</p>
                                <h4> ₹{people.available_balance} </h4>
                            </div>
                            <div className="evenInfo__budget__circular">
                                <CircularProgress valueStart={people.available_balance}
                                                  valueEnd={people.amount_allocated}/>
                            </div>
                        </div>
                        <div className="eventInfo_budget_buttons">
                            <button onClick={handleOpenLimit}>
                                <p>SetLimit</p>
                                <CallReceivedIcon/>
                            </button>
                            {openTransfer && (
                                <TransferMoney
                                    open={openTransfer}
                                    handleClose={handleCloseTransfer}
                                />
                            )}

                            {openLimit && (
                                <AddMoney open={openLimit} handleClose={handleCloseLimit}/>
                            )}

                            <button onClick={handleOpenTransfer}>
                                <p>Transfer</p> <CallMadeIcon/>
                            </button>
                        </div>
                    </div>
                    <div className="participantsDetails">
                        <p>{people.participants_data.length} Participants</p>

                        {open && <InviteModal open={open} handleClose={handleClose}/>}

                        <p>
                            {people.is_host && <i className="fa fa-user-plus" onClick={handleOpen}></i>}
                        </p>
                    </div>
                    <div className="eventInfo__people">

                        {people.participants_data.map((person) => {
                            return (
                                <EventInfoPerson
                                    key={person.id}
                                    id={person.id}
                                    name={person.full_name}
                                    money={person.available_amount}
                                    isAdmin={person.is_host}
                                />
                            );
                        })}
                    </div>
                </div>)}
        </div>
    );
}

export default EventInfo;
