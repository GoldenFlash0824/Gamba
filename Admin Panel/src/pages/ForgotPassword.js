// ForgotPassword.js
import React, { useState } from 'react';
import {
    Container,
    Button,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core';
import Logo from '../assets/images/01. GAMBA Final logo.png';
import { color, toastStyle } from '../assets/css/commonStyle';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { api } from '../api/callAxios';
import { NavLink } from 'react-router-dom'

const ForgotPassword = () => {
    const classes = useStyles();
    const _history = useHistory();
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        if (email === '') {
            toast.error('Please enter your email', {
                position: toastStyle.position,
                autoClose: toastStyle.closeDuration,
            });
        } else {
            sendResetEmail();
        }
    };

    const sendResetEmail = () => {
        api
            .post(`/admin/forgot-password`, {
                email: email,
            })
            .then((response) => {
                if (response.data.success) {
                    toast.success(
                        'Password reset email sent successfully!',
                        {
                            position: toastStyle.position,
                            autoClose: toastStyle.closeDuration,
                        }
                    );
                    _history.push('/login'); // Redirect to login after sending reset email
                } else {
                    toast.error(response.data.message, {
                        position: toastStyle.position,
                        autoClose: toastStyle.closeDuration,
                    });
                }
            })
            .catch(function (error) {
                toast.error('Something went wrong. Please try again later.', {
                    position: toastStyle.position,
                    autoClose: toastStyle.closeDuration,
                });
            });
    };

    return (
        <Container maxWidth="xs" className={classes.container}>
            <div className={classes.center}>
                <img src={Logo} className={classes.logo} alt="" />
                <Typography variant="h4" className={classes.heading}>
                    Forgot Password
                </Typography>
                <TextField
                    type="email"
                    size="small"
                    className={classes.textField}
                    variant="outlined"
                    placeholder="Enter your email"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    fullWidth
                    size="large"
                    className={classes.loginButton}
                    onClick={handleForgotPassword}
                >
                    Reset Password
                </Button>
                <div
                    style={{ display: 'flex', justifyContent: 'start' }}
                >
                    <NavLink to="/login">
                        <Typography
                            variant="div"
                            className={classes.goBack}
                        >
                            Go back to Login
                        </Typography>
                    </NavLink>
                </div>
            </div>
        </Container>
    );
};

export default ForgotPassword;

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    center: {
        textAlign: 'center',
        marginTop: '-20px',
    },
    logo: {
        width: '100%',
    },
    heading: {
        fontWeight: '600',
        fontSize: '36px',
        color: color.black,
        padding: '10px 0px 0px 0px',
        textAlign: 'center',
    },
    textField: {
        marginTop: '15px',
        border: `1px solid ${color.lightGray} !important`,
        borderRadius: '5px !important',
        backgroundColor: color.lightGray,
    },
    goBack: {
        fontWeight: '400',
        fontSize: '1rem',
        color: color.black,
        padding: '10px 0px 0px 0px',
        textAlign: 'start',
        cursor: 'pointer',
    },
    loginButton: {
        marginTop: '15px',
        backgroundColor: color.success,
        color: color.white,
        '&:hover': {
            backgroundColor: color.success,
        },
    },
}));
