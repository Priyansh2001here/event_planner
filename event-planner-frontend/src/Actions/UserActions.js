import axios from "axios";
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_REQUEST
} from "../Constants/UserConstants";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const config = {
            headers: {
                "Content-type": "application/json",
                'X-CSRFToken': csrftoken
            },
        };

        const {data} = await axios.post(
            "/accounts/login",
            {
                email,
                password
            },
            config
        );

        localStorage.setItem('userInfo', JSON.stringify(data));

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.message,
        });
    }
};

export const registerUser = (name, whatsappNo, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });

        const config = {
            headers: {
                "Content-type": "application/json",
                'X-CSRFToken': csrftoken
            },
        };

        const {data} = await axios.post(
            "/accounts/register",
            {
                full_name: name,
                email,
                password,
                whatsappNo: whatsappNo
            },
            config
        );
        localStorage.setItem('userInfo', JSON.stringify(data));


        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.message,
        });
    }
};
