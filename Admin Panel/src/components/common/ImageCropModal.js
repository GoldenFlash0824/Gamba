import React, { useState, useRef, useEffect } from 'react'
import { Button, makeStyles, Modal, Card, CardHeader, CardContent, CardActions, IconButton, TextField } from '@material-ui/core'
import { Cancel } from '@material-ui/icons'
import { color } from '../../assets/css/commonStyle'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import { canvasPreview } from '../../cropImgAssets/canvasPreview'
import { useDebounceEffect } from '../../cropImgAssets/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 100
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    )
}

const ImageCropModal = ({ showImage, setResult, onClose }) => {
    const classes = useStyles()
    const [imgSrc, setImgSrc] = useState(showImage)
    const previewCanvasRef = useRef(null)
    const imgRef = useRef(null)
    const hiddenAnchorRef = useRef(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(16 / 7.6)
    const [getCropBase64, setGetCropBase64] = useState()

    function onImageLoad(e) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    function onDownloadCropClick() {
        setResult(getCropBase64)
        onClose()
    }

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate, setGetCropBase64)
            }
        },
        100,
        [completedCrop, scale, rotate]
    )

    return (
        <div className={classes.modal}>
            <Modal open={true} onClose={() => {
                onClose(false)
            }}
                aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <div className={classes.paper}>
                    <Card>
                        <CardHeader
                            title={'Crop Image'}
                            className={classes.cardHead}
                            action={
                                <IconButton aria-label="settings" style={{ color: 'white' }}>
                                    <Cancel onClick={() => onClose(false)} />
                                </IconButton>
                            }
                        />
                        <CardContent>
                            <div className={classes.flexed}>
                                <div className={classes.col}>
                                    <label htmlFor="scale-input">Zoom</label>
                                    <Slider
                                        min={1}
                                        max={100}
                                        onChange={(e) => {
                                            setScale(Number(e))
                                        }}
                                    />
                                    <div className={classes.spacerHeight1}></div>
                                </div>

                                <div className={classes.col}>
                                    <label htmlFor="scale-input">Rotate</label>
                                    <Slider min={0} max={180} onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e))))} />
                                    <div className={classes.spacerHeight1}></div>
                                </div>
                            </div>
                            {!!imgSrc && (
                                <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={aspect}>
                                    <img ref={imgRef} alt="Crop me" src={imgSrc} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }} onLoad={onImageLoad} />
                                </ReactCrop>
                            )}
                            {!!completedCrop && (
                                <>
                                    <div style={{ display: 'none' }}>
                                        <canvas
                                            ref={previewCanvasRef}
                                            style={{
                                                border: '1px solid black',
                                                objectFit: 'contain',
                                                width: completedCrop.width,
                                                height: completedCrop.height
                                            }}
                                        />
                                    </div>
                                    <div className={classes.spacerHeight2}></div>
                                </>
                            )}
                        </CardContent>

                        {!!completedCrop && <CardActions className={classes.cardActions}>
                            <Button variant="contained" className={classes.addButton} size="small" onClick={() => onDownloadCropClick()}>
                                Crop
                            </Button>
                        </CardActions>
                        }
                    </Card>
                </div>
            </Modal>
        </div>
    )
}

export default ImageCropModal

const useStyles = makeStyles((theme) => ({
    paper: {
        textAlign: 'center',
        color: color.black,
        width: '40%',
        position: 'absolute',
        left: '0',
        right: '0',
        margin: 'auto',
        borderRadius: '5px',
        marginTop: '10px',
        minHeight: '40rem',
        maxHeight: '47rem',
        overflow: 'auto',
        [theme.breakpoints.down('sm')]: {
            width: '95%'
        }
    },
    modal: {},
    textField: {
        marginTop: '15px',
        border: `1px solid ${color.lightGray} !important`,
        borderRadius: '5px !important',
        backgroundColor: color.lightGray
    },
    flexed: {
        display: 'flex',
        textAlign: 'center',
        gap: '1rem'
    },
    col: {
        width: '8rem'
    },
    cardHead: {
        backgroundColor: color.darkBlue,
        color: color.white
    },
    cardActions: {
        display: 'flex',
        padding: '11px 10px 15px 10px',
        justifyContent: 'center'
    },
    cancelButton: {
        color: color.darkBlue,
        outline: color.darkBlue,
        fontWeight: '300',
        fontSize: '13px',
        textTransform: 'capitalize',
        '&:hover': {
            backgroundColor: color.darkBlue,
            color: color.white
        }
    },
    spacerHeight1: {
        height: '1rem',
    },
    spacerHeight2: {
        height: '2rem',
    },
    addButton: {
        color: color.white,
        backgroundColor: color.darkBlue,
        fontWeight: '300',
        fontSize: '13px',
        textTransform: 'capitalize',
        '&:hover': {
            backgroundColor: color.darkBlue
        }
    }
}))
