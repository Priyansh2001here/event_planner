import {
  Avatar,
  createTheme,
  Fade,
  IconButton,
  makeStyles,
  Modal,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import React, { useState } from "react";
import TransferMoney from "../TransferMoney/TransferMoney";
import "./TaskCard.css";
import TransferMoney2 from "../transferMoney2/transferMoney2";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 550,
      md: 750,
      lg: 1280,
      xl: 1920,
    },
  },
});

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 1),
    width: "30%",
    borderRadius: "20px",
    [theme.breakpoints.down("lg")]: {
      width: "30%",
    },
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  moreVert: {
    marginLeft: "10px",
  },
  personIcon: {
    color: "#707070",
    marginLeft: "7px",
    height: "20px",
  },
  modalAvatar: {
    width: "70px",
    height: "70px",
    margin: "auto",
  },
}));

function TaskCard({ task }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={task.is_completed ? "taskCard disabled" : "taskCard"}>
      <div className="transaction__details">
        <Avatar alt={task.assigned_to.full_name} src={task.assigned_to.prof_img} />
        <div className="transaction__task">
          <h3>{task.title}</h3>
          <p>
            Assigned to <strong>{task.assigned_to.full_name}</strong>{" "}
          </p>
          <br/>
          <p>
            Due By {new Date(task.due_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {open && <TransferMoney2 open={open} handleClose={handleClose} task_id={task.id} />}

      <div onClick={handleOpen} id={task.id}>
        <div className="payTask" title="Complete the task" id={task.id}>
          <i className="fa fa-credit-card" id={task.id}/>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;