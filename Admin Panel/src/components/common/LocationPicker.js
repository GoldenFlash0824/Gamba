import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import {
    ClickAwayListener,
    List,
    ListItem,
    ListItemText,
    Paper,
    Popper,
    TextField,
    makeStyles,
} from '@material-ui/core';
import { color } from '../../assets/css/commonStyle';

function GooglePlacesAutocomplete({ setLocation, isPrivate, setLatitude, location, setLongitude, setLocationError }) {
    const [address, setAddress] = useState('');
    const classes = useStyles();
    const [popperOpen, setPopperOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSelect = async (value) => {
        setAddress(value);
        setLocation(value)
        try {
            const results = await geocodeByAddress(value);
            const latLng = await getLatLng(results[0]);
            setLatitude(latLng?.lat)
            setLongitude(latLng?.lng)
        } catch (error) {
            console.error('Error geocoding address:', error);
        }
    };

    const handleClickAway = () => {
        setPopperOpen(false);
    };

    useEffect(() => {
        if (location) {
            setAddress(location)
        }
    }, [location])
    console.log('=======location', location)

    return (
        <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <TextField
                        className={classes.textField}
                        {...getInputProps({
                            variant: 'outlined',
                            fullWidth: true,
                            onClick: (e) => {
                                setPopperOpen(true);
                                setAnchorEl(e.currentTarget); // Set anchor element to the current input field
                            },
                        })}
                        disabled={!isPrivate}
                        value={address}
                    />
                    <div>
                        {loading && <div>Loading...</div>}
                        <Popper
                            open={popperOpen}
                            anchorEl={anchorEl} // Set anchor element here
                            placement="bottom"
                            transition
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClickAway}>
                                    <List component="nav" aria-label="Location suggestions">
                                        {suggestions.map((suggestion) => (
                                            <ListItem
                                                button
                                                key={suggestion.placeId}
                                                {...getSuggestionItemProps(suggestion)}
                                                style={{
                                                    backgroundColor: suggestion.active ? '#32CD32' : 'white',
                                                    cursor: 'pointer',

                                                }}
                                            >
                                                <ListItemText primary={suggestion.description} style={{ padding: '0 0.5rem' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </ClickAwayListener>
                            </Paper>
                        </Popper>
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );
}

export default GooglePlacesAutocomplete;

const useStyles = makeStyles((theme) => ({
    textField: {
        border: `1px solid ${color.lightGray} !important`,
        borderRadius: '5px !important',
        backgroundColor: color.lightGray,
        marginTop: '3px',
    },
}));
