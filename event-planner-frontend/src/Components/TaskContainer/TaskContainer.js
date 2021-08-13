import React, {useEffect, useState} from "react";
import "./TaskContainer.css";
import TaskCard from "../TaskCard/TaskCard";
import axios from "axios";
import CallMadeIcon from "@material-ui/icons/CallMade";
import AddTaks from "../AddTask/AddTaks";
import CircularProgress from "../EventInfo/CircularProgress";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import TransferMoney from "../TransferMoney/TransferMoney";
import AddMoney from "../AddMoney/AddMoney";

function TaskContainer() {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const [tasks, setTasks] = useState([]);
    const [Loader, setLoader] = useState(false);


    const [completedTasks, setCompletedTasks] = useState([])

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function fetchTasks() {
            setLoader(true);
            const eventID = document.location.pathname.split("/")[3];
            const {data} = await axios.get(`/events/tasks/${eventID}`);
            setTasks(data);
            setCompletedTasks(() => data.filter(task => task.is_completed === false))
            setLoader(false);
        }

        fetchTasks();
        return () => {
            source.cancel();
        };
    }, []);
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
                <div style={{backgroundColor: "white"}}>

                    <div className="eventInfo">

                        <div className="eventInfo__budget">
                            <div className="eventInfo__budget__main">
                                <div className="eventInfo__budget__details">
                                    <p>Total Tasks</p>
                                    <h3>{tasks.length}</h3>
                                    <br/>
                                    <p>Remaining Tasks</p>
                                    <h4>{tasks.length - completedTasks.length}</h4>
                                </div>
                                <div className="evenInfo__budget__circular">
                                    <CircularProgress valueStart={completedTasks.length}
                                                      valueEnd={tasks.length}/>
                                </div>
                            </div>
                            <div className="eventInfo_budget_buttons" style={{justifyContent:"center"}}>
                                <button onClick={handleOpen} style={{width: "200px"}}>
                                    <p>Add Task</p> <CallMadeIcon/>
                                </button>
                                {open && <AddTaks open={open} handleClose={handleClose}/>}
                            </div>
                        </div>


                    </div>


                    <div className="participantsDetails">
                        <p>{tasks.length} Tasks</p>
                    </div>
                    <div className="tasksList">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskContainer;
