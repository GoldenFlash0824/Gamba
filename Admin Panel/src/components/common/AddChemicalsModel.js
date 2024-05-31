import { Box, Checkbox, FormControlLabel, Switch, TextField, Typography, createTheme, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { color } from '../../assets/css/commonStyle';
import { CheckBox } from '@material-ui/icons';
const closeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* ... (Your SVG path here) */}
    </svg>
);

const theme = createTheme({
    palette: {
        primary: {
            main: '#007bff', // Example primary color
        },
        secondary: {
            main: '#ff6f61', // Example secondary color
        },
        opacity: {
            sky_navy_0_5: 'rgba(0, 0, 128, 0.5)', // Custom color definition
        },
        // Define other custom colors as needed
    },
    // Other theme configurations
});
const useStyles = makeStyles(() => ({
    customOverlay: {
        /* Your overlay styles */
    },
    addPost: {
        /* Your modal styles */
    },
    head: {
        background: theme.palette.opacity.sky_navy_0_5,
        padding: '2rem 2.5rem',
        [theme.breakpoints.down('xs')]: {
            padding: '1.5rem 1.5rem',
        },
    },
    body: {
        background: theme.palette.white,
        padding: '1rem 2.5rem',
        [theme.breakpoints.down('xs')]: {
            padding: '1.5rem 1.5rem',
        },
    },
    wrapper: {
        height: '60vh',
        overflowY: 'auto',
        border: `1px solid ${theme.palette.stroke}`,
        borderRadius: '0.5rem',
        padding: '1rem'
    },
    modalWrapper:{
        padding:'1rem'
    },
    textField: {
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		marginTop: '3px'
	},
}));

const AddChemicalsModal = ({ onClose, setIsOrganicError, dummyChemicalsArray, setDummyChemicalsArray, setChemicals }) => {
    const classes = useStyles();
    const [searchProduct, setSearchProduct] = useState('');

    const searchProducts = async (value) => {
        setSearchProduct(value);
    };

    return (
        <>
            <Modal
                open={true}
                onClose={() => {
                    onClose(false);
                    setIsOrganicError(dummyChemicalsArray?.some((data) => data?.isChecked === true) ? '' : 'chemicals is required');
                    setChemicals(
                        dummyChemicalsArray?.filter((data) => {
                            return data?.isChecked === true;
                        })
                    );
                }}
                closeIcon={closeIcon}
                center
                // className={classes.addPost}
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'addPost',
                }}
            >
                <div className={classes.modalWrapper}>
                    <Typography variant="h6" color="textSecondary">
                        Chemicals
                    </Typography>
                    <div className={classes.body}>
                        <>
                            <TextField
                            className={classes.textField}
                                type="search"
                                placeholder="Search Products"
                                fullWidth
                                variant="outlined"
                                value={searchProduct}
                                onChange={(e) => searchProducts(e.target.value)}
                            />
                        </>
                        <div className={classes.wrapper}>
                            {dummyChemicalsArray
                                ?.filter((data) => {
                                    if (searchProduct.length > 0) {
                                        if (data?.label?.toLowerCase().startsWith(searchProduct?.toLowerCase())) return data;
                                    } else {
                                        return data;
                                    }
                                })
                                ?.map((data, index) => {
                                    console.log('======data.isChecked', data.isChecked)
                                    return (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={data.isChecked == true ? true: false}
                                                    onChange={() => {
                                                        setDummyChemicalsArray((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index].isChecked = !newState[index].isChecked;
                                                            return newState;
                                                        });
                                                    }}
                                                    name={`chemicalSwitch-${index}`}
                                                />
                                            }
                                            label={data.label}
                                            key={index}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </Modal>
            <Box mt={2} />
        </>
    );
};

export default AddChemicalsModal;
