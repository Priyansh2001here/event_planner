import React, {useState} from "react";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {
    Button,
    Container,
    Grid,
    TextareaAutosize,
    TextField,
    Typography,
} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import csrftoken from "../../csrftoken";
import axios from "axios";

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        borderRadius: "10px",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: "30%",
        textAlign: "center",
    },
    formControl: {
        minWidth: 120,
        width: "100%",
        margin: "auto",
        textAlign: "left",
        marginTop: "20px",
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    input: {
        marginTop: "20px",
    },
    btn: {
        marginTop: "30px",
        border: "1px solid blue",
    },
    heading: {
        marginTop: "15px",
    },
    textArea: {
        width: "100%",
        padding: "10px",
        marginTop: "30px",
        fontSize: "1.1rem",
    },
}));

// function getStyles(name, personName, theme) {
//     return {
//         fontWeight:
//             personName.indexOf(name) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }

function AddTaks({open, handleClose}) {
    const classes = useStyles();
    const theme = useTheme();
    // const [open, setOpen] = React.useState(false);
    const [names, setNames] = useState(JSON.parse(localStorage.getItem('participants_data')));
    const [formData, setFormData] = useState({
        title: "",
        dueDate: "",
        person: "",
        desc: "",
    });

    const [personName, setPersonName] = React.useState([]);

    const handlePerson = (event) => {
        setPersonName(event.target.value);
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const addTask = async (e) => {
        e.preventDefault();

        const data = {
            title: formData.title,
            due_date: formData.dueDate,
            participant: personName
        }
        const config = {
            headers: {
                'X-CSRFToken': csrftoken
            }
        }
        await axios.post('/events/assign_task', data, config);
    }


    const Close = () => {
        handleClose()
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={Close}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        {/* main code */}
                        <div className="addTask">
                            <Container
                                component="main"
                                maxWidth="xs"
                                className={classes.container}
                            >
                                <Typography variant="h4" className={classes.heading}>
                                    Add a Task
                                </Typography>
                                <form>
                                    <Grid>
                                        <TextField
                                            name="title"
                                            label="Title"
                                            type="text"
                                            onChange={handleChange}
                                            xs={6}
                                            varient="outlined"
                                            fullWidth
                                            required
                                            className={classes.input}
                                            value={formData.title}
                                        />
                                        <TextField
                                            name="dueDate"
                                            type="date"
                                            onChange={handleChange}
                                            xs={6}
                                            varient="outlined"
                                            fullWidth
                                            required
                                            className={classes.input}
                                            value={formData.dueDate}
                                        />
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
                                            <Select
                                                labelId="demo-mutiple-name-label"
                                                id="demo-mutiple-name"
                                                value={personName}
                                                onChange={handlePerson}
                                                input={<Input/>}
                                                MenuProps={MenuProps}
                                            >
                                                {names.map((name) => (
                                                    <MenuItem
                                                        key={name.id}
                                                        id={name.id}
                                                        value={name.id}
                                                        // style={getStyles(name.full_name, personName, theme)}
                                                    >
                                                        {name.full_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            placeholder="Additional Instructions"
                                            className={classes.textArea}
                                        />
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        varient="contained"
                                        color="primary"
                                        className={classes.btn}
                                        onClick={addTask}
                                    >

                                        Add Task
                                    </Button>
                                </form>
                            </Container>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default AddTaks;
