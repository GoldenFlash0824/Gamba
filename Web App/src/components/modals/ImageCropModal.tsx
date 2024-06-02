import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import { Text, Spacer, Flexed } from '../../styled/shared'
import { palette } from '../../styled/colors'
import { Row, Col, media } from 'styled-bootstrap-grid'
import Button from '../common/Button'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import { canvasPreview } from '../../cropImgAssets/canvasPreview'
import { useDebounceEffect } from '../../cropImgAssets/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const closeIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
			fill="#75788D"
		/>
	</svg>
)

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
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

const ImageCropModal = ({ showImage, setResult, onClose }: any) => {
	const [imgSrc, setImgSrc] = useState(showImage)
	const previewCanvasRef = useRef<HTMLCanvasElement>(null)
	const imgRef = useRef<HTMLImageElement>(null)
	const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
	const blobUrlRef = useRef('')
	const [crop, setCrop] = useState<Crop>()
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
	const [scale, setScale] = useState(1)
	const [rotate, setRotate] = useState(0)
	const [aspect, setAspect] = useState<number | undefined>(16 / 7.6)
	const [getCropBase64, setGetCropBase64] = useState()

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
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

	function handleToggleAspectClick() {
		if (aspect) {
			setAspect(undefined)
		} else if (imgRef.current) {
			const { width, height } = imgRef.current
			setAspect(2.1)
			const newCrop = centerAspectCrop(width, height, 2.1)
			setCrop(newCrop)
			// Updates the preview
			setCompletedCrop(convertToPixelCrop(newCrop, width, height))
		}
	}
	return (
		<>
			<Modal
				open={true}
				onClose={() => {
					onClose(false)
				}}
				center
				closeIcon={closeIcon}
				classNames={{
					modal: 'imageCropModal'
				}}>
				<ModalWrapper>
					<Head direction="row" align="center" justify="space-between">
						<Text fontSize={1.5} lineHeight="1.438" fontWeight={700} color="black_300">
							Crop Image
						</Text>
					</Head>
					<Body>
						<div className="App">
							<Row>
								<Col sm={4}>
									<label htmlFor="scale-input">Zoom</label>
									<Slider
										min={1}
										max={100}
										onChange={(e) => {
											setScale(Number(e))
										}}
									/>
									<Spacer height="1" />
								</Col>
								<Col sm={4}>
									<label htmlFor="scale-input">Rotate</label>
									<Slider min={0} max={180} onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e))))} />
									<Spacer height="1" />
								</Col>

								{/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
								<div>
									{/* <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          /> */}
								</div>
								{/* <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div> */}
								{/* <div>
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? 'off' : 'on'}
          </button>
        </div> */}
							</Row>
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
									<Spacer height="1.25" />
									<div>
										{/* <button onClick={onDownloadCropClick}>Download Crop</button> */}
										<Flexed direction="row" align="center" justify="center">
											<Button
												label={`Crop`}

												ifClicked={(e: any) => {
													onDownloadCropClick()
												}}
											/>
										</Flexed>
										{/* <a
              ref={hiddenAnchorRef}
              download
              style={{
                position: 'absolute',
                top: '-200vh',
                visibility: 'hidden',
              }}
            >
              Hidden download
            </a> */}
									</div>
								</>
							)}
						</div>
					</Body>
				</ModalWrapper>

			</Modal>
		</>
	)
}

const ModalWrapper = styled.div``

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	// padding: 2rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
	padding-bottom: 1rem;
`

const Body = styled.div`
	background: ${palette.white};
	// padding: 1rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`

const Cover = styled.div<any>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 3rem;
	height: 3rem;
	border-radius: 5rem;
	background: ${({ background }) => `${palette[background]}`};
	border: 1px solid ${({ hasBorder }) => (hasBorder ? palette.silver : palette.white)};
	cursor: pointer;
	font-size: 1.5rem;
`

const Flex = styled(Flexed)`
	flex-wrap: wrap;
	gap: 1.2rem;
`

const Size = styled.div`
	width: 100%;
	height: 18rem;
	& div.reactEasyCrop_Container {
		position: relative;
		width: 100%;
		height: 18rem;
		overflow: hidden;
		border-radius: 1.25rem;
	}
`

export default ImageCropModal
