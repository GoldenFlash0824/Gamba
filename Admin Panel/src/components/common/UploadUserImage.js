import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    makeStyles,
    Box,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CancelIcon from '@material-ui/icons/Cancel';
import { color } from '../../assets/css/commonStyle';

function UploadUserImage({ event, onSelect, tabActive, user, post, imageError }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const classes = useStyles()
    const handleFileSelect = (event) => {
        const files = event.target.files;
        const newSelectedFiles = Array.from(files);
        setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () => {
            if (reader.readyState === 2) {
                onSelect([...previewImages, reader.result])
                setPreviewImages([...previewImages, reader.result]);

            }
        }

    };

    const handleRemoveImage = (index) => {
        const updatedSelectedFiles = [...selectedFiles];
        const updatedPreviewImages = [...previewImages];

        updatedSelectedFiles.splice(index, 1);
        updatedPreviewImages.splice(index, 1);

        setSelectedFiles(updatedSelectedFiles);
        setPreviewImages(updatedPreviewImages);
        onSelect(updatedPreviewImages);
    };

    useEffect(() => {
        if (user?.image) {
            setPreviewImages([user?.image])
            onSelect([user?.image])
        }
    }, [user])

    // console.log('=========', previewImages, event)
    return (
        <Card style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center', backgroundColor: 'transparent', background: 'transparent' }}>
            <CardContent>
                {/* <Typography variant="h6">Upload Images</Typography> */}
                {previewImages.length == 0 ? <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    <input
                        type="file"
                        id="file-upload"
                        // accept="image/jpeg/png"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        // multiple={event ? false : post ? true : true}

                        onChange={handleFileSelect}
                    />
                    <div style={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        borderRadius: '5px',
                    }}>
                        <CloudUploadIcon fontSize="large" />
                        <Typography variant="body1">
                            Click or drag and drop to upload
                        </Typography>
                    </div>
                </label> : ''}
                {previewImages.length > 0 && <div
                    style={{
                        // border: '2px dashed #ccc',
                        display: 'flex',
                        padding: '20px',
                        borderRadius: '5px',
                        flexWrap: 'wrap'
                    }}
                >
                    {previewImages.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            {previewImages.map((preview, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        src={preview.endsWith('.png') || preview.endsWith('.jpeg') || preview.endsWith('.image') || preview.endsWith('.webp') ? process.env.REACT_APP_IMAGE_URL + '/' + preview : preview}
                                        alt={`Preview ${index}`}
                                        style={{ maxWidth: event ? '8rem' : '5rem', maxHeight: event ? '8rem' : '5rem', borderRadius: '3px' }}
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-3px',
                                            right: '-8px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'white'
                                        }}
                                    >
                                        <CancelIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        ''
                    )}
                </div>}
            </CardContent>
            {previewImages.length ? '' : <Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
                {imageError}
            </Box>}
        </Card>
    );
}

export default UploadUserImage;

const useStyles = makeStyles((theme) => ({
    posesImages: {
        width: '6rem',
        height: '6rem',
        objectFit: 'cover',
        borderRadius: '4px'
    },
    image: {
        width: '6rem',
        height: '6rem',
        objectFit: 'cover',
        borderRadius: '4px'
    },
    errorMessage: {
        color: color.red,
        marginTop: '6px'
    },
}))