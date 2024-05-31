import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, IconButton } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AdminProfileModel from './AdminProfileMode';

const useStyles = makeStyles((theme) => ({
    avatar: {
        cursor: 'pointer',
    },
}));

const UserProfileMenu = ({ doLogout }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openModel, setOpenModel] = useState(false)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <div style={{ cursor: 'pointer' }} onClick={handleMenuOpen}>
                Profile
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-controls="user-profile-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    className={classes.avatar}
                >
                    <AccountCircle />
                </IconButton>
            </div>

            <Menu
                id="user-profile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className='menu-options'
            >
                <MenuItem style={{ width: '8rem' }} onClick={() => { handleMenuClose(); setOpenModel(true) }}>
                <svg width="14" height="16" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" fill="#5B626A"/></svg>Profile</MenuItem>
                <MenuItem style={{ width: '8rem' }} onClick={() => { doLogout(); handleMenuClose(); }}>
                <svg  width="16" height="16" viewBox="0 0 512 512"><path d="M352 146.2L462 256 352 365.8l0-53.8c0-13.3-10.7-24-24-24l-120 0 0-64 120 0c13.3 0 24-10.7 24-24l0-53.8zM512 256c0-11.5-4.6-22.5-12.7-30.6L383.2 109.6c-8.7-8.7-20.5-13.6-32.8-13.6c-25.6 0-46.4 20.8-46.4 46.4l0 33.6-96 0c-26.5 0-48 21.5-48 48l0 64c0 26.5 21.5 48 48 48l96 0 0 33.6c0 25.6 20.8 46.4 46.4 46.4c12.3 0 24.1-4.9 32.8-13.6L499.3 286.6c8.1-8.1 12.7-19.1 12.7-30.6zM168 80c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 32C39.4 32 0 71.4 0 120L0 392c0 48.6 39.4 88 88 88l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l80 0z" fill="#5B626A"/></svg>Logout</MenuItem>
            </Menu>
            {openModel && <AdminProfileModel onClose={() => setOpenModel(false)} />}
        </div>
    );
};

export default UserProfileMenu;
