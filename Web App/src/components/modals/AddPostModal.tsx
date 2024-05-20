import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Text, Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import InputField from '../common/InputField'
import Button from '../common/Button'
import {useSelector} from 'react-redux'
import CreateEvent from '../CreateEvents'
import CreateProducts from '../CreateProducts'
import {createPost} from '../../apis/apis'
import {RxCalendar} from 'react-icons/rx'
import moment from 'moment-timezone'
import {RxCrossCircled} from 'react-icons/rx'
import {Container, Row, Col, media} from 'styled-bootstrap-grid'
import {savePostMessage, saveRoute, setIsLoading} from '../../actions/authActions'
import {useDispatch} from 'react-redux'
import Loader from '../common/Loader'
import {toastError, toastSuccess} from '../../styled/toastStyle'
import {BsPlusLg} from 'react-icons/bs'
import DateTimePicker from 'react-datetime-picker'
import CustomInputField from '../common/CustomInputField'
import DropDown from '../DropDown'
import {useLocation, useNavigate} from 'react-router-dom'
import {BiCalendarAlt} from 'react-icons/bi'
import {IoIosArrowForward} from 'react-icons/io'
import ImageCropModal from './ImageCropModal'

const closeIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
			fill="#75788D"
		/>
	</svg>
)

const AddPostModal = ({onClose, select, setSelect, isModalFooterOpen, setIsModalFooterOpen, onCreateProductCB}: any) => {
	const {pathname} = useLocation()
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const isLoading = useSelector<any>((state: any) => state.auth.isLoading)
	const auth_token = useSelector<any>((state: any) => state.auth.auth_token)
	const postMessage: any = useSelector<any>((state: any) => state.auth.postTitle)

	const _dispatch = useDispatch()
	const [startDate, setStartDate] = useState(new Date())
	const [privacyOptionsError, setPrivacyOptionsError] = useState('')
	const [description, setDescription] = useState('')
	const [descriptionError, setDescriptionError] = useState('')
	const [topicError, setTopicError] = useState('')
	const [postTopic, setPostTopic] = useState(postMessage)
	const [showImage, setShowImage]: any = useState(null)
	const [imageData, setImageData] = useState([])
	const _navigate = useNavigate()
	const [imageError, setImageError] = useState('')
	const [openCropModal, setOpenCropModal] = useState(true)
	const [isCalenderOpen, setIsCalenderOpen] = useState(false)
	const [sellGoodsCategory, setSellGoodsCategory]: any = useState('Products')

	//const [images, setImages] = useState([])

	const handleStartDateChange = (date: any) => {
		// setStartDateError('')
		setIsCalenderOpen(false)
		setStartDate(date)
	}

	useEffect(() => {
		setSelect(pathname === '/calendar' ? 'Sell' : select)
	}, [])

	const [privacyOption, setPrivacyOption] = useState([
		{value: 'Public', label: 'Public'},
		{value: 'My Network', label: 'My Network'},
		{value: 'Only Me', label: 'Only Me'}
	])

	const [privacy, setPrivacy] = useState(privacyOption[0]?.value)

	const handleSelectChange = (event: any) => {
		const value = event.target.value
		setSelect(value)
	}
	const addPost = async () => {
		_dispatch(setIsLoading(true))
		let postDate: any = moment(startDate).format('MM/DD/YYYY')
		// if (moment().format("MM/DD/YYYY") !== moment(startDate).format("MM/DD/YYYY")) {
		// 	postDate = moment(startDate).format("MM/DD/YYYY")
		// }
		let response = await createPost(description, imageData, postTopic, privacy, postDate)
		if (response.success === true) {
			// toastSuccess(response.message)
			setImageData([])
			setDescription('')
			_dispatch(saveRoute('/'))
			_dispatch(savePostMessage(''))
			_navigate('/')
			onClose()
		} else {
			toastError(response.message)
		}
		_dispatch(setIsLoading(false))
	}

	const deleteSelectImage = (index: any) => {
		const deleteImage = imageData.filter((value, ind) => {
			return ind !== index
		})
		setImageData(deleteImage)
	}

	// const handleCapture = ({target}: any) => {
	// 	const reader = new FileReader()
	// 	reader.readAsDataURL(target.files[0])
	// 	reader.onload = () => {
	// 		if (reader.readyState === 2) {
	// 			setShowImage(reader.result)
	// 			setImageData((prev): any => [...prev, reader.result])
	// 		}
	// 	}
	// }

	const handleCapture = ({target}: any) => {
		// debugger
		if (target.files[0]) {
			const reader = new FileReader()
			reader.readAsDataURL(target.files[0])
			reader.onload = () => {
				if (reader.readyState === 2) {
					setShowImage(reader.result)
					setImageData((prev): any => [reader.result, ...prev])
				}
			}
		}
		if (target.files[1]) {
			const reader = new FileReader()
			reader.readAsDataURL(target.files[1])
			reader.onload = () => {
				if (reader.readyState === 2) {
					setShowImage(reader.result)
					setImageData((prev): any => [reader.result, ...prev])
				}
			}
		}
		if (target.files[2]) {
			const reader = new FileReader()
			reader.readAsDataURL(target.files[2])
			reader.onload = () => {
				if (reader.readyState === 2) {
					setShowImage(reader.result)
					setImageData((prev): any => [reader.result, ...prev])
				}
			}
		}
		if (target.files[3]) {
			const reader = new FileReader()
			reader.readAsDataURL(target.files[3])
			reader.onload = () => {
				if (reader.readyState === 2) {
					setShowImage(reader.result)
					setImageData((prev): any => [reader.result, ...prev])
				}
			}
		}
	}
	const checkValidationOnClick = () => {
		let isValid = true

		if (description === '') {
			setDescriptionError('Description is required')
			isValid = false
		}
		if (privacy === '') {
			setPrivacyOptionsError('Privacy is required')
			isValid = false
		}
		if (imageData?.length <= 0) {
			setImageError('Images is required')
			isValid = false
		}
		if (postTopic === '') {
			setTopicError('topic is required')
			isValid = false
		}
		return isValid
	}
	return (
		<>
			<Modal
				open={true}
				center
				onClose={() => {
					onClose()
					setIsModalFooterOpen(true)
				}}
				closeIcon={closeIcon}
				closeOnOverlayClick={false}
				classNames={{
					overlay: 'customOverlay',
					modal: 'addPostModal'
				}}>
				<>
					<ModalWrapper>
						{isModalFooterOpen && (
							<Footer className='gap-1'>
								<Flexed className='radio-item' direction="row" align="center" gap="0.6">
									<RadioButton type="radio" name="radio" value="Photo" checked={select === 'Photo'} onChange={(event) => handleSelectChange(event)} />
									<Text color="white" isDarkTheme={_isDarkTheme}>Share your post</Text>
								</Flexed>
								<Spacer height="0.5" />
								<Flexed className='radio-item' direction="row" align="center" gap="0.6">
									<RadioButton type="radio" name="radio" value="Goods" checked={select === 'Goods'} onChange={(event) => handleSelectChange(event)} />
									<Text isDarkTheme={_isDarkTheme}>Sell your goods</Text>
								</Flexed>
								<Spacer height="0.5" />
								<Flexed className='radio-item' direction="row" align="center" gap="0.6">
									<RadioButton type="radio" name="radio" value="Sell" checked={select === 'Sell'} onChange={(event) => handleSelectChange(event)} />
									<Text isDarkTheme={_isDarkTheme}>Create an event</Text>
								</Flexed>
							</Footer>
						)}
						<Head direction="row" align="center" gap={0.5}>
							<Text fontSize={1.125} type="large" lineHeight="1.438" color="heading_color" fontWeight={700}>
								{select === 'Photo' && 'Start Posting'}
								{select === 'Sell' && 'Create Event'}
								{select === 'Goods' && 'Sell Your Goods'}
							</Text>
							{select === 'Goods' && <IoIosArrowForward />}
							{select === 'Goods' && <span>{sellGoodsCategory}</span>}
						</Head>
						<Body>
							{select === 'Photo' && (
								<>
									<Wrapper>
										<Row>
											{imageData.map((value: any, index: any) => {
												return (
													<Col xs={6} sm={6} md={4} lg={4}>
														<ImgWrapper key={index}>
															<ShowImage src={value} />
															<IconWrapper
																onClick={() => {
																	deleteSelectImage(index)
																}}>
																<CrossIcon src="/images/icons/delete_post.svg" alt="delete_post" />
															</IconWrapper>
														</ImgWrapper>
													</Col>
												)
											})}

											<Col xs={8} sm={6} md={4} lg={4}>
												{imageData.length !== 4 && (
													<InputWrapper>
														<Upload>
															<UploadIcon src="/images/icons/upload_img.svg" />
															<FileInput
																// multiple
																multiple
																id="faceImage"
																accept="image/jpeg/png"
																type="file"
																onChange={(e) => {
																	handleCapture(e)
																	setShowImage('')
																}}
															/>
															{/* <NewText font="1.125rem" color="light_black" weight="300">
																Upload Photo
															</NewText> */}
														</Upload>
													</InputWrapper>
												)}
											</Col>
											<Col>
												<TextLabel type="small" color="gray">
													{imageData.length} / 4
												</TextLabel>
											</Col>

											<Col>
												{/* {imageData.length >= 4 && (
													<>
														<Text fontSize={0.625} type="small" color="danger" texTransform="normal">
															you can add maximum 4 images
														</Text>
													</>
												)} */}
												{imageData?.length ? (
													''
												) : (
													<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
														{imageError}
													</Text>
												)}
												<Spacer height={1} />
											</Col>

											<CustomFlex direction="row" align="flex-end">
												<Col lg={11} md={11} sm={11} xs={11}>
													<CustomInputField
														type="text"
														maxLength={40}
														label="Title"
														bgTransparent
														placeholder="Enter title"
														handleChange={(e: any) => {
															setTopicError('')
															if (e === '') {
																setTopicError('topic is required')
															}
															setPostTopic(e)
														}}
														value={postTopic}
														error={topicError}
														errorMsg={topicError}
														required
													/>
												</Col>
												<div id="customCalendar">
													{isCalenderOpen && (
														<StyledCalender clearIcon={null} isCalendarOpen={true} minDate={new Date()} calendarIcon={null} disableClock={true} format="d-M-yyyy" onChange={handleStartDateChange} value={startDate} />
													)}
												</div>

												{/* <RxCalendar
													onClick={() => {
														setIsCalenderOpen(true)
													}}
													fontSize="1.5rem"
													color={palette.text}
												/> */}

												<CalendarIconCustom
													onClick={() => {
														setIsCalenderOpen(!isCalenderOpen)
													}}
												/>
											</CustomFlex>
											<Col>
												<Spacer height={1.5} />
												<DropDown
													label="Privacy"
													firstSelected={privacyOption[0]?.value}
													name="ProductCategory"
													hasChanged={(value: any) => {
														setPrivacyOptionsError('')
														if (value == '') {
															setPrivacyOptionsError('Privacy Field is empty')
														}
														setPrivacy(value)
													}}
													required
													error={privacyOptionsError}
													errorMsg={privacyOptionsError}
													options={privacyOption}
												/>
												<Spacer height={1.5} />
											</Col>

											<Col>
												<InputField
													type="textarea"
													label="Share"
													bgTransparent
													placeholder="Write..."
													handleChange={(e: any) => {
														setDescriptionError('')
														if (e === '') {
															setDescriptionError('Description is required')
														}
														const words = e.split(' ')
														if (words.length > 149) {
															const truncatedValue = words.slice(0, 149).join(' ')
															setDescription(truncatedValue)
														} else {
															setDescription(e)
														}
													}}
													value={description}
													error={descriptionError}
													errorMsg={descriptionError}
													required
												/>
												<Spacer height={2.5} />
											</Col>
											<Col>
												<Button
													width="100%"
													label="post"
													
													ifClicked={async () => {
														if (await checkValidationOnClick()) {
															addPost()
														}
													}}
												/>
											</Col>
										</Row>
									</Wrapper>
								</>
							)}
							{select === 'Sell' && <CreateEvent onClose={onClose} />}
							{select === 'Goods' && <CreateProducts onClose={onClose} onCreateCB={onCreateProductCB} setSellGoodsCategory={setSellGoodsCategory} />}
						</Body>
					</ModalWrapper>
					{isLoading && <Loader visible={isLoading} />}
				</>
			</Modal>
			{/* {showImage && <ImageCropModal showImage={showImage} onClose={()=>{setOpenCropModal(false)}}/> } */}
		</>
	)
}

const ModalWrapper = styled.div`
	border-radius: 1.875rem;
	padding: 1rem 0.5rem;
`

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	padding-bottom: 1rem;
`

const Footer = styled.div`
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
	align-items: center;
	${media.xs` flex-direction: column;
	// align-items: flex-start;
	display: block;
	margin-top: 0.875rem;
	`};
	div.radio-item {
		padding: 12px;
		background-color: #CDD5DF !important;
		flex: 1;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
	  }
`
const Body = styled.div`
	background: ${palette.white};
	border-radius: 1.875rem;

	
`

const CustomFlex = styled(Flexed)<any>`
	width: 100%;
`

const RadioButton = styled.input`
	height: 1.2rem;
	width: 1.2rem;
	accent-color: ${palette.text_description};
	cursor: pointer;
`
const Upload = styled.label`
	padding: 1rem;
	height: 8.5rem;

	border: 0.063rem solid ${palette.stroke};
	border-radius: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.7rem;
	flex-direction: column;
	cursor: pointer;
`
const FileInput = styled.input`
	display: none !important;
`

const CalendarIconCustom = styled(BiCalendarAlt)`
	color: ${palette.gray};
	font-size: 1.5rem;
	cursor: pointer;
	margin-bottom: 1rem;
`
const Wrapper = styled(Container)`
	padding: 0;
`

const ShowImage = styled.img`
	width: 100%;
	height: 8.5rem;
	object-fit: cover;
	border-radius: 1rem;
`

const CrossIcon = styled.img`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	cursor: pointer;
`
const ImgWrapper = styled.div`
	position: relative;
	height: 8.5rem;
	margin-bottom: 0.5rem;
`
const IconWrapper = styled.div``

const InputWrapper = styled.div`
	position: relative;
	height: 8.5rem;
	margin-bottom: 0.5rem;
`
const LabelWrapper = styled.div`
	position: absolute;
	top: -0.8rem;
	left: 0.5rem;
	background-color: ${palette.white};
	padding: 0 0.2rem;
	// z-index: 2;
`
const TextLabel = styled(Text)`
	/* font-weight: 500; */
	text-transform: normal;
`

const StyledCalender = styled(DateTimePicker)`
	/* display: none; */
`

const UploadIcon = styled.img`
	width: 3rem;
	/* font-size: 2.5rem; */
	/* color: ${palette.black}; */
`

const NewText = styled(Text)`
	text-align: center;
`
export default AddPostModal
