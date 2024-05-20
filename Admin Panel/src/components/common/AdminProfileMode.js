import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { TextField, Box, Button, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import 'react-responsive-modal/styles.css';
import { color, toastStyle } from '../../assets/css/commonStyle';
import { api } from '../../api/callAxios';
import { toast } from 'react-toastify';

const AdminProfileModel = ({ onClose }) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [adminInfo, setAdminInfo] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const validatePassword = (password) => {
        // Add your password strength validation logic here
        // For example, checking for minimum length
        return password.length >= 8;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        api.get(`/admin/profile`)
            .then((response) => {
                if (response.data.success == true) {
                    console.log('=======', response?.data?.data?.admin_details?.email)
                    setAdminInfo((prevInfo) => ({
                        ...prevInfo,
                        'email': response?.data?.data?.admin_details?.email,
                    }));
                }

            })
            .catch(function (error) {
                toast.error('Something went wrong. Please try again later.', {
                    position: toastStyle.position,
                    autoClose: toastStyle.closeDuration
                })
            })
    }

    const updateProfile = async () => {
        setLoading(true)
        api.post(`/admin/update-profile`, { password: adminInfo.password, email: adminInfo?.email })
            .then((response) => {
                if (response.data.success == true) {
                    setLoading(false)
                    toast.success('Admin Password updated successful')
                    onClose()
                }

            })
            .catch(function (error) {
                setLoading(false)
                toast.error('Something went wrong. Please try again later.', {
                    position: toastStyle.position,
                    autoClose: toastStyle.closeDuration
                })
            })
    }

    const handleSubmit = () => {
        setPasswordError('');
        setConfirmPasswordError('');

        // Password validation
        if (!validatePassword(adminInfo.password)) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        // Confirm password validation
        if (!validateConfirmPassword(adminInfo.password, adminInfo.confirmPassword)) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        }

        updateProfile()
    };

    const classes = useStyles();

    return (
        <>
            <Modal
                open={true}
                onClose={() => {
                    onClose(false);
                }}
                center
                aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description"
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'addPost',
                }}
            >
                {loading ? (
                    <>
                        <div id="loader-div">
                            <div id="loadings"></div>
                        </div>
                        <div style={{ height: '30rem' }}></div>
                    </>) : ""}
                <div style={{ padding: '1rem' }}>
                    <div direction="row" align="center" justify="space-between">
                        <Box component={'div'} fontWeight={'bold'}>
                            Admin Profile
                        </Box>
                    </div>
                    <div >
                        <Grid container lg={24}>

                            <Grid item xs={12} md={12} className={classes.control}>
                                <Typography variant="subtitle2" className={classes.label}>
                                    {' '}
                                    Email <span className={classes.danger}>*</span>{' '}
                                </Typography>
                                <TextField
                                    type="text"
                                    size="small"
                                    placeholder='Please enter email'
                                    className={classes.textField}
                                    fullWidth
                                    variant="outlined"
                                    name='email'
                                    disabled
                                    value={adminInfo.email}
                                    onChange={handleInputChange}
                                />
                                <Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
                                    {/* {errorFullName} */}
                                </Box>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', textAlign: 'center', width: '100%' }}>
                                <Typography variant="subtitle2" className={classes.label} onClick={() => setIsUpdate(!isUpdate)}>
                                    {' '}
                                    Update Passsword ?
                                </Typography>
                            </div>



                            {isUpdate ? <>
                                <Grid item xs={12} md={12} className={classes.control}>
                                    <Typography variant="subtitle2" className={classes.label}>
                                        {' '}
                                        Password <span className={classes.danger}>*</span>{' '}
                                    </Typography>
                                    <TextField
                                        type="text"
                                        size="small"
                                        name='password'
                                        placeholder='Please enter password'
                                        className={classes.textField}
                                        fullWidth
                                        variant="outlined"
                                        value={adminInfo.password}
                                        onChange={handleInputChange}
                                    />
                                    <Box id="" component="div" fontSize={12} fontWeight="bold" className={classes.errorMessage}>
                                        {passwordError}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={12} className={classes.control}>
                                    <Typography variant="subtitle2" className={classes.label}>
                                        {' '}
                                        Confirm Password <span className={classes.danger}>*</span>{' '}
                                    </Typography>
                                    <TextField
                                        type="text"
                                        size="small"
                                        name='confirmPassword'
                                        placeholder='Please enter confirm password'
                                        className={classes.textField}
                                        fullWidth
                                        variant="outlined"
                                        value={adminInfo.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    <Box id="" component="div" fontSize={12} fontWeight="bold" className={classes.errorMessage}>
                                        {confirmPasswordError}
                                    </Box>
                                </Grid>
                            </> : ''}

                        </Grid>

                        <Grid direction="row" align="center" justify="end">

                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.saveButton}
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </Grid>
                    </div>
                </div>
                <Divider />
            </Modal>
        </>
    );
};

export default AdminProfileModel;

const useStyles = makeStyles((theme) => ({
    danger: {
        color: color.red
    },
    label: {
        color: color.darkBlue
    },
    saveButton: {
        marginTop: '10px',
        backgroundColor: color.darkBlue,
        color: color.white,
        fontWeight: '400',
        fontSize: '13px',
        textTransform: 'capitalize',
        '&:hover': {
            backgroundColor: color.darkBlue
        }
    },
    textArea: {
        border: `1px solid ${color.lightGray} !important`,
        borderRadius: '5px !important',
        backgroundColor: color.lightGray,
        marginTop: '3px',
        focus: 'none',
    },
    control: {
        paddingRight: theme.spacing(2),
        marginTop: '10px'
    },
    errorMessage: {
        color: color.red,
        marginTop: '6px'
    },
    textField: {
        border: `1px solid ${color.lightGray} !important`,
        borderRadius: '5px !important',
        backgroundColor: color.lightGray,
        marginTop: '3px'
    },
}));
