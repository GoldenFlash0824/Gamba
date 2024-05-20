import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { Box, Button, Divider, FormControlLabel, Grid, Switch, makeStyles } from '@material-ui/core';
import { color } from '../../assets/css/commonStyle';

const ChemicalsMdel = ({ onClose }) => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggleChange = () => {
        setIsToggled((prev) => !prev);
    };
    const classes = useStyles()

    return (
        <>
            <Modal
                open={true}
                onClose={() => {
                    onClose(false);
                }}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'smallModal',
                }}
            >
                <div>
                    <div direction="row" align="center" justify="space-between">
                        <Box component={'div'}>
                            Info
                        </Box>
                    </div>
                    <div>
                        <Box component={'div'}>
                            You’ve selected organic, normally organic products are offered without chemical sprayed, if it is organic please uncheck the chemical
                        </Box>
                        <Divider />
                        <Grid direction="row" align="center" justify="center">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isToggled}
                                        onChange={handleToggleChange}
                                        name="toggleSwitch"
                                    />
                                }
                                label="Organic"
                            />

                            <Button variant="contained" color="secondary" className={classes.saveButton} onClick={onClose}>
                                Ok
                            </Button>
                        </Grid>
                    </div>
                </div>
                <Divider />
            </Modal>
        </>
    );
};

export default ChemicalsMdel;
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

}))