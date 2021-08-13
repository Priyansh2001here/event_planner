import React, {useEffect, useState} from "react";
import EventInfo from "../../Components/EventInfo/EventInfo";
import "./TestPage.css";
import "./newChatbox.css";

import {Button, IconButton, Modal} from "@material-ui/core";
import Message from "../../Components/Chatbox/Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import Picker, {SKIN_TONE_MEDIUM_DARK} from "emoji-picker-react";
import {makeStyles} from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {useHistory} from "react-router-dom";
import LogFile from "../../Components/LogFile/LogFile";
import TaskContainer from "../../Components/TaskContainer/TaskContainer";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import axios from "axios";
import csrftoken from "../../csrftoken";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: "10px",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
    },
    button: {
        border: "1px solid #244ed8",
        fontSize: "0.9rem",
        marginTop: "20px",
    },
    heading: {
        marginBottom: "20px",
    },
}));

function TestPage() {
    const classes = useStyles();
    const [showChatBox, setShowChatBox] = useState(false);
    const [input, setInput] = useState("");
    const [isEmoji, setIsEmoji] = useState(false);
    const [open, setOpen] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [fileSelected, setFileSelected] = useState(null);
    const [showEventInfo, setShowEventInfo] = useState(true);
    const [showLogFile, setShowLogFile] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [messages, setMessages] = useState([]);


    const [Loader, setLoader] = useState(false);
    const [people, setPeople] = useState({
        participants_data: []
    });
    const history = useHistory();

    const fetchMessages = async () => {
        const eventID = document.location.pathname.split("/")[3];
        const res2 = await axios.get(`/chats/all/${eventID}`);
        setMessages(res2.data)
    }

    useEffect(() => {

        if (!localStorage.getItem('userInfo')) history.push("/login");

        const eventID = document.location.pathname.split("/")[3];

        const source = axios.CancelToken.source();

        async function fetchTasks() {
            setLoader(true)
            try {
                const res = await axios.get(`/events/${eventID}`);
                setPeople(res.data);
                setLoader(false);
                localStorage.setItem('participants_data', JSON.stringify(res.data.participants_data))

                setInterval(() => fetchMessages().catch((e) => alert('failed to fetch messages')), 1000);


            } catch (e) {
                if (e.response.status === 403) {
                    alert("Event doesn't exist")
                    history.push('/')

                }
            }
        }

        fetchTasks();
        return () => {
            source.cancel();
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        const eventID = document.location.pathname.split("/")[3];
        const data = {
            message: input,
            event: eventID
        }
        const url = "/chats/message"
        const config = {
            headers: {
                'X-CSRFToken': csrftoken
            }
        }
        axios.post(url, data, config);
        setInput('')
    }

    const handleInfoClick = () => {
        setShowEventInfo(true);
        setShowLogFile(false);
        setShowTasks(false);
    };
    const handleLogClick = () => {
        setShowLogFile(true);
        setShowEventInfo(false);
        setShowTasks(false);
    };
    const handleTaskClick = () => {
        setShowTasks(true);
        setShowEventInfo(false);
        setShowLogFile(false);
    };

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen((prev) => !prev);
        if (isFileSelected) {
            setIsFileSelected((prev) => !prev);
        }
    };

    const handleMessage = (e) => {
        console.log(e.target.value);
        setInput(() => e.target.value);
    };

    const handleEmoji = (e, o) => {
        if (o) {
            setInput((input) => input + o.emoji);
        }
    };

    const handleFile = (e) => {
        setIsFileSelected((prev) => !prev);
        setFileSelected(() => e.target.files[0]);
        console.log(isFileSelected, fileSelected);
    };

    return (
        <div className="testPageContainer">
            <div className="testLeftSide">
                <div className="testInfoContainer">
                    <div className="testMenuBar topHeader">
                        <div style={{display: "flex", alignItems: "center"}}>
                            {/* <Link
                to="/"
                style={{
                  marginLeft: "10px",
                  // marginRight: "10px",
                  color: "black",
                }}
              >
                <i className="fa fa-arrow-left fa-lg"></i> */}
                            {/* </Link> */}
                            {showEventInfo ? (
                                <h2>Event Info</h2>
                            ) : showLogFile ? (
                                <h2 style={{paddingLeft: ""}}>Transactions Log</h2>
                            ) : (
                                <h2>Tasks Assigned</h2>
                            )}
                        </div>
                        <div className="iconsSet">
                            <i
                                className={
                                    showEventInfo
                                        ? "fa fa-info-circle active"
                                        : "fa fa-info-circle"
                                }
                                title="View Event Info"
                                onClick={handleInfoClick}
                            />
                            <i
                                className={showLogFile ? "fa fa-file active" : "fa fa-file"}
                                title="View Log File"
                                onClick={handleLogClick}
                            />
                            <i
                                className={showTasks ? "fa fa-tasks active" : "fa fa-tasks"}
                                title="View Tasks"
                                onClick={handleTaskClick}
                            />
                        </div>
                    </div>
                    <div className="testInfo">
                        {showEventInfo ? <EventInfo people={people} Loader={Loader}/> : showLogFile ? <LogFile/> :
                            <TaskContainer/>}
                    </div>
                </div>
            </div>
            <div className={showChatBox ? "testRightSide show" : "testRightSide"}>
                <div className="chatBoxContainer">
                    <div className="testPageHeader">
                        <div className="chat__header">
                            <img src={people.image} style={{borderRadius: "50%"}} width="45"
                                 height="45" alt="Event Profile Image"/>
                            <div className="chat__headerInfo">
                                <h3>{people.title}</h3>
                                <p><i className="fa fa-map-marker"/> {people.venue} </p>

                            </div>
                            <div className="chat__headerRight">
                                <IconButton onClick={() => setShowChatBox(!showChatBox)}>
                                    <ArrowBackIosIcon/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div
                        className="testPageBody"
                        style={{backgroundImage: "url('/static/chatBackground6.jpeg')"}}
                    >
                        {messages.length === 0 && (<Message messageObj={{
                            message: 'Fetching Event Messages...',
                            timestamp: new Date().toLocaleString(),
                            from_user: '',
                            by_you: true
                        }}/> )}
                        {messages.map(message => (
                            <Message messageObj={message} key={message.id}/>
                        ))}
                    </div>
                    {isEmoji && (
                        <div className="chat__emoji">
                            <Picker
                                onEmojiClick={handleEmoji}
                                skinTone={SKIN_TONE_MEDIUM_DARK}
                            />
                        </div>
                    )}
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <div className={classes.paper}>
                                <h3 className={classes.heading}>Select the File</h3>
                                <input type="File" name="file" onChange={handleFile}/>
                                {isFileSelected && (
                                    <Button color="primary" className={classes.button}>
                                        Send
                                    </Button>
                                )}
                            </div>
                        </Fade>
                    </Modal>
                    <div className="testPageFooter">
                        <IconButton>
                            <InsertEmoticonIcon
                                onClick={() => setIsEmoji((isEmoji) => !isEmoji)}
                            />
                        </IconButton>
                        <IconButton>
                            <AttachFileIcon onClick={handleOpen}/>
                        </IconButton>
                        <form onSubmit={(e) =>
                            sendMessage(e)
                        }>
                            <input
                                value={input}
                                onInput={handleMessage}
                                type="text"
                                placeholder="Type a message"
                            />
                            <IconButton onClick={sendMessage}>
                                <SendIcon/>
                            </IconButton>
                        </form>
                    </div>
                </div>
            </div>
            <div className="openChat" onClick={() => setShowChatBox(!showChatBox)}>
                <i
                    className={showChatBox ? "fa fa-times" : "fa fa-comment"}
                    style={{color: "white", fontSize: "25px"}}
                ></i>
            </div>
        </div>
    );
}

export default TestPage;
