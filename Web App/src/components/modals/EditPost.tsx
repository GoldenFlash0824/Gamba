import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import { Text, Flexed, Spacer } from '../../styled/shared'
import { palette } from '../../styled/colors'
import Button from '../common/Button'
import { Col, Container, Row, media } from 'styled-bootstrap-grid'
import CustomInputField from '../common/CustomInputField'
import { RxCrossCircled } from 'react-icons/rx'
import InputField from '../common/InputField'
import DropDown from '../DropDown'
import { useDispatch } from 'react-redux'
import { saveRoute, setIsLoading } from '../../actions/authActions'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import { editPost } from '../../apis/apis'
import { useNavigate } from 'react-router-dom'
import DateTimePicker from 'react-datetime-picker'
import { BiCalendarAlt } from 'react-icons/bi'
import moment from 'moment-timezone'
const closeIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
			fill="#75788D"
		/>
	</svg>
)

const EditPost = ({ onClose, postData, onEdit }: any) => {
	const [privacyOptionsError, setPrivacyOptionsError] = useState('')
	const [privacy, setPrivacy] = useState(postData?.privacy)
	const [topicError, setTopicError] = useState('')
	const [description, setDescription] = useState(postData?.description)
	const [descriptionError, setDescriptionError] = useState('')
	const [postTopic, setPostTopic] = useState(postData?.title)
	const [imageData, setImageData] = useState(postData?.images)
	const [imageError, setImageError] = useState('')
	const [startDate, setStartDate] = useState(new Date(postData?.future_post_date))
	const [isCalenderOpen, setIsCalenderOpen] = useState(false)

	const [showImage, setShowImage]: any = useState(postData?.images)
	const _dispatch = useDispatch()
	const _navigate = useNavigate()

	const [privacyOption, setPrivacyOption] = useState([
		{ value: 'Public', label: 'Public' },
		{ value: 'My Network', label: 'My Network' },
		{ value: 'Only Me', label: 'Only Me' }
	])

	const deleteSelectImage = (index: any) => {
		const deleteImage = imageData.filter((value, ind) => {
			return ind !== index
		})
		setImageData(deleteImage)
	}

	const handleCapture = ({ target }: any) => {
		const reader = new FileReader()
		reader.readAsDataURL(target.files[0])
		reader.onload = () => {
			if (reader.readyState === 2) {
				setShowImage(reader.result)
				setImageData((prev): any => [...prev, reader.result])
			}
		}
	}

	const checkValidationOnClick = () => {
		let isValid = true

		if (description === '') {
			setDescriptionError('Description is required')
			isValid = false
		}
		if (postTopic === '') {
			setTopicError('Topic is required')
			isValid = false
		}
		if (imageData?.length <= 0) {
			setImageError('Images is required')
			isValid = false
		}
		// if (imageData.length === 0) {
		// 	setTopicError('Topic is required')
		// 	isValid = false
		// }
		return isValid
	}

	const onEditPost = async () => {
		_dispatch(setIsLoading(true))
		onClose()
		let postDate: any = moment(startDate).format('MM/DD/YYYY')
		// if (moment().format("MM/DD/YYYY") !== moment(startDate).format("MM/DD/YYYY")) {
		// 	postDate = moment(startDate).format("MM/DD/YYYY")
		// }
		let response = await editPost(postData?.id, description, imageData, postTopic, privacy, postDate)

		if (response.success === true) {
			// toastSuccess(response.message)
			setImageData([])
			setDescription('')
			_dispatch(saveRoute('/'))
			// _navigate(-1)
		} else {
			toastError(response.message)
		}
		_dispatch(setIsLoading(false))
	}

	const handleStartDateChange = (date: any) => {
		// setStartDateError('')
		setIsCalenderOpen(false)
		setStartDate(date)
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
					overlay: 'customOverlay',
					modal: 'smallModal'
				}}>
				<ModalWrapper>
					<Head direction="row" align="center" justify="space-between">
						<Text type="large" lineHeight="1.438" color="heading_color">
							Edit Post
						</Text>
					</Head>
					<Body>
						<Wrapper>
							<Row>
								{imageData.map((value: any, index: any) => {
									return (
										<Col xs={6} sm={6} md={4} lg={4}>
											<ImgWrapper key={index}>
												<ShowImage src={value?.startsWith('data:') ? value : `https://imagescontent.s3.us-east-1.amazonaws.com/${value}`} />
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
													id="faceImage"
													accept="image/jpeg/png"
													type="file"
													onChange={(e) => {
														handleCapture(e)
														setShowImage('')
													}}
												/>
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
											<Spacer height={0.5} />
											<Text fontSize={0.625} type="small" color="danger">
												You can Add Maximum 4 images
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

									<Spacer height={1.5} />
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
													setTopicError('Topic is required')
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
										{isCalenderOpen && <StyledCalender clearIcon={null} minDate={new Date()} isCalendarOpen={true} calendarIcon={null} disableClock={true} format="d-M-yyyy" onChange={handleStartDateChange} value={startDate} />}
									</div>
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
										firstSelected={privacy}
										name="ProductCategory"
										hasChanged={(value: any) => {
											setPrivacyOptionsError('')
											if (value == '') {
												setPrivacyOptionsError('Privacy Field is required')
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
											setDescription(e)
										}}
										value={description}
										error={descriptionError}
										errorMsg={descriptionError}
										required
									/>


								</Col>

								<Col>
									<Button
										width="100%"
										label="Update Post"

										ifClicked={() => {
											if (checkValidationOnClick()) {
												onEditPost()
											}
										}}
									/>
								</Col>
							</Row>
						</Wrapper>
					</Body>
				</ModalWrapper>
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div`
	border-radius: 1.875rem;
`

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	padding-bottom: 1rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`

const TextLabel = styled(Text)`
	text-transform: normal;
`

const Body = styled.div`
	background: ${palette.white};

	border-radius: 1.875rem;
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

const PostTopic = styled.div<any>`
	width: 100%;
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

const NewText = styled(Text)`
	text-align: center;
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
const CustomFlex = styled(Flexed) <any>`
	width: 100%;
`

const UploadIcon = styled.img`
	width: 3rem;
	/* font-size: 2.5rem; */
	/* color: ${palette.black}; */
`
const CrossIcon = styled.img`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	cursor: pointer;
`
const StyledCalender = styled(DateTimePicker)`
	/* display: none; */
`
const CalendarIconCustom = styled(BiCalendarAlt)`
	color: ${palette.gray};
	font-size: 1.5rem;
	cursor: pointer;
	margin-bottom: 1rem;
`
export default EditPost
