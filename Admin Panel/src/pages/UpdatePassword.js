// UpdatePassword.js
import React, { useState } from 'react';
import {
    Container,
    Button,
    makeStyles,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { color, toastStyle } from '../assets/css/commonStyle';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { api } from '../api/callAxios';
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'

const UpdatePassword = () => {
    const classes = useStyles();
    const _history = useHistory();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleUpdatePassword = () => {
        if (newPassword === '' || confirmPassword === '') {
            toast.error('Please enter both passwords', {
                position: toastStyle.position,
                autoClose: toastStyle.closeDuration,
            });
        } else if (newPassword !== confirmPassword) {
            toast.error('Password not matched', {
                position: toastStyle.position,
                autoClose: toastStyle.closeDuration,
            });
        } else {
            // Call the API to update the password
            if (_history?.location?.pathname?.replace('/reset-password/', '')) {
                api
                    .post(`/admin/reset-password/${_history?.location?.pathname?.replace('/reset-password/', '')}`, {
                        newPassword: newPassword,
                    })
                    .then((response) => {
                        if (response.data.success) {
                            toast.success('Password updated successfully!', {
                                position: toastStyle.position,
                                autoClose: toastStyle.closeDuration,
                            });
                            _history.push('/login'); // Redirect to login after updating password
                        } else {
                            toast.error(response.data.message, {
                                position: toastStyle.position,
                                autoClose: toastStyle.closeDuration,
                            });
                        }
                    })
                    .catch((error) => {
                        toast.error('Something went wrong. Please try again later.', {
                            position: toastStyle.position,
                            autoClose: toastStyle.closeDuration,
                        });
                    });
            } else {
                toast.error('Password reset token not found', {
                    position: toastStyle.position,
                    autoClose: toastStyle.closeDuration,
                });
            }


        }
    };

    return (
        <Container maxWidth="xs" className={classes.container}>
            <div className={classes.center}>
                <Typography variant="h4" className={classes.heading}>
                    Update Password
                </Typography>
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    size="small"
                    className={classes.textField}
                    variant="outlined"
                    placeholder="Enter new password"
                    fullWidth
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    type={showConfirmPassword ? 'text' : 'password'}
                    size="small"
                    className={classes.textField}
                    variant="outlined"
                    placeholder="Confirm new password"
                    fullWidth
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    fullWidth
                    size="large"
                    className={classes.loginButton}
                    onClick={handleUpdatePassword}
                >
                    Update Password
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
    loginButton: {
        marginTop: '15px',
        backgroundColor: color.success,
        color: color.white,
        '&:hover': {
            backgroundColor: color.success,
        },
    },
    goBack: {
        fontWeight: '400',
        fontSize: '1rem',
        color: color.black,
        padding: '10px 0px 0px 0px',
        textAlign: 'start',
        cursor: 'pointer',
    },
}));

export default UpdatePassword;
