import React, {useState, useEffect} from "react";
import "./Mainbody.css";
import CardScroller from "../../Components/CardScroller/CardScroller";
import axios from "axios";
import {Translate} from "@material-ui/icons";

function Mainbody() {
    const [liveEvents, setLiveEvents] = useState([]);
    const [completedEvents, setCompletedEvents] = useState([]);
    const [loader, setLoader] = useState(false);

    function setEventsInLocalstorage(liveEvents, completedEvents) {
        const allEvents = liveEvents.concat(completedEvents);
        localStorage.setItem("allEvents", JSON.stringify(allEvents));
    }


    function formatDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }


    useEffect(() => {
        const source = axios.CancelToken.source();


        async function fetchEvents() {
            setLoader(true);
            const eventsData = await axios.get("/events/user_events");
            setLoader(false);
            let curDate = formatDate();

            const completed = eventsData.data.filter(obj => {
                return obj.end_date < curDate;
            })

            const live = eventsData.data.filter(obj => {
                return obj.end_date >= curDate;
            })

            setCompletedEvents(completed)
            setLiveEvents(live)

            localStorage.setItem('allEvents', JSON.stringify(eventsData.data));

        }

        fetchEvents();

        return () => {
            source.cancel();
        }
    }, []);

    return (
        <div
            style={
                loader
                    ? {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }
                    : {}
            }
        >
            {loader ? (
                <img
                    src="/static/loaderWifi.gif"
                    style={{width: "80px", height: "80px"}}
                ></img>
            ) : (
                <div className="mainBody">
                    {liveEvents.length !== 0 || completedEvents.length !== 0 ? (<div>

                            <div className="eventCardContainer" style={{marginTop: "15px"}}>
                                <h4 className="eventsCollectionName">Live Events</h4>
                                <CardScroller events={liveEvents}/>
                            </div>
                            <div
                                className="eventCardContainer"
                                style={{marginTop: "40px", marginBottom: "60px"}}
                            >
                                <h4 className="eventsCollectionName">Completed Events</h4>
                                <CardScroller events={completedEvents}/>
                            </div>
                        </div>) : (<div
                            className="addFirstEvent"
                            title="Create a Collection"
                        >
                            <h3>Create Your First Event</h3>
                            <p>Evento is a one stop solution for mangaing all types of events. <br/> <br/> Evento Helps
                                you
                                to :
                                <br/><br/>
                                <ul>
                                    <li>Create Events</li>
                                    <li>Invite Participants into it</li>
                                    <li>Create And Assign Task</li>
                                    <li>Pay all Events related Payment from one place</li>
                                    <li>Keep Track of all the Transactions</li>
                                    <li>And so much more...</li>
                                </ul>
                            </p>
                            <p className="callToAction" style={{marginBottom: "70px"}}>
                                Event Management has never been this easy. <br/> So what are you waiting for ? <br/>
                                <br/>
                                <a href="#" style={{textDecoration: "none", color: "#244ed8"}}> Create your first event
                                    now</a>.
                            </p>

                        </div>)}

                </div>
            )}
        </div>
    );
}

export default Mainbody;
