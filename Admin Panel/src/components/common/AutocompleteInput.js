import React from 'react';
import TextField from '@material-ui/core/TextField';
import { color } from '../../assets/css/commonStyle';
import { makeStyles } from '@material-ui/core';

const AutocompleteInput = ({ label, placeholder, value, onChange, onClick }) => {
    const classes = useStyles()
    return (
        <TextField
            type="text"
            size="small"
            className={classes.textField}
            fullWidth
            variant="outlined"
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onClick={onClick}
        />
    );
};

const useStyles = makeStyles((theme) => ({

    textField: {
        border: `1px solid ${color.lightGray} !important`,
        borderRadius: '5px !important',
        backgroundColor: color.lightGray,
        marginTop: '3px'
    },
    control: {
        paddingRight: theme.spacing(2),
        marginTop: '10px'
    },

}))
export default AutocompleteInput;
