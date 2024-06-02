import React, { useState } from 'react'
import { Col } from 'styled-bootstrap-grid'
import DropDown from '../DropDown'
import { Flexed, Spacer, Text } from '../../styled/shared'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import DateTimePicker from 'react-datetime-picker'
import Checkbox from '../common/CheckBox'
import CustomInputField from '../common/CustomInputField'
import Toggle from '../common/Toggle'
import ChemicalsErrorModal from '../modals/ChemicalsErrorModal'
import AllowToOrderModal from '../modals/AllowToOrderModal'
import { BiCalendarAlt } from 'react-icons/bi'
import { media } from 'styled-bootstrap-grid'
import { CustomDivTitle } from '../productStepper/ProductStepperTwo'
import { toastSuccess } from '../../styled/toastStyle'
import { toast } from 'react-toastify'
import AutoComplete from '../common/AutoComplete'

const EditProductStepperTwo = ({
	isOrganicError,
	setIsOrganicError,
	chemicalCheckBoxNone,
	setChemicalCheckBoxNone,
	isDelivery,
	isPickUp,
	setIsDelivery,
	setIsPickUp,
	distanceError,
	setDistanceError,
	setDistance,
	isTrade,
	distance,
	setAllowToOrder,
	allowToOrder,
	hoursOptions,
	setHoursOptions,
	setInventoryPriceError,
	inventoryPrice,
	inventoryPriceError,
	setInventoryPrice,
	startDateError,
	setDays,
	daysError,
	handleStartDateChange,
	startDate,
	setDaysOption,
	daysOption,
	days,
	setDaysError,
	setHoursError,
	hoursError,
	setHours,
	hours,
	endDateError,
	handleEndDateChange,
	endDate,
	setCaptionError,
	setCaption,
	captionError,
	caption,
	setQuantityError,
	quantityError,
	quantity,
	allowToOrderError,
	setAllowToOrderError,
	chemicalsError,
	setChemicalsError,
	setQuantity,
	allowToOrderOptions,
	setToggle,
	setIsAddChemicalsModalOpen,
	toggle,
	chemicals,
	chemicalsUsed,
	setChemicalsUsed,
	setUnlimited,
	unLimitted
}) => {
	const [isAllowToOrderModalOpen, setIsAllowToOrderModalOpen] = useState(false)
	const [isChemicalsErrorModalOpen, setIsChemicalsErrorModalOpen] = useState(false)
	return (
		<>
			{isTrade === 'Sell' && (
				<>
					<Col lg={6}>
						<CustomInputField
							modal={true}
							bgTransparent
							setIsAllowToOrderModalOpen={setIsAllowToOrderModalOpen}
							label="Allow to order in advance "
							placeholder="Enter"
							handleChange={(value: any) => {
								let reg: any = ''
								if (value === '') {
									setDaysError('Days is required')
								}
								setDaysError('')
								if (allowToOrder === 'Hour(s)') {
									reg = /^(?:[0-9]|1[0-9]|2[0-3])?$/

									if (reg.test(value.toString())) {
										setDays(value.toString())
									}
								} else if (allowToOrder === 'Day(s)') {
									reg = /^(?:[1-9]|10)?$/
									if (reg.test(value.toString())) {
										setDays(value.toString())
									}
								}
							}}
							required
							error={daysError}
							errorMsg={daysError}
							allowOnlyNumbers={true}
							value={days}
						/>
						<Spacer height={1.5} />
					</Col>

					<Col lg={6}>
						<CustomSpacer />
						<DropDown
							// disabled={!allowToOrder}
							firstSelected={allowToOrder}
							required
							// name="unit"
							hasChanged={(value: any) => {
								setAllowToOrderError('')
								if (value === '') {
									setAllowToOrderError('Allow To Order is required')
								}
								setAllowToOrder(value)
								if (value === 'Day(s)') {
									setDays(1)
								} else if (value === 'Hour(s)') {
									setDays(0)
								}
							}}
							error={allowToOrderError}
							errorMsg={allowToOrderError}
							options={allowToOrderOptions}
						/>
						<Spacer height={1.5} />
					</Col>
				</>
			)}

			<Col lg={6}>
				<InputWrapper>
					<Text type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700}>
						Product available from
					</Text>
					<CalenderDiv calendarIcon={<CalendarIconCustom />} clearIcon={null} minDate={new Date()} disableClock={true} format="d-M-y" onChange={handleStartDateChange} value={startDate} />
					<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
						{startDateError}
					</Text>
				</InputWrapper>
				<Spacer height={1.5} />
			</Col>

			<Col lg={6}>
				<InputWrapper>
					{/* <Text type="normal"  margin="0rem 0rem 0.25rem 0rem" color='black' fontWeight={700}>Ends on</Text> */}
					<CustomDivTitle>
						<Text type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700}>
							Ends on
						</Text>
						<Checkbox fontSize="1rem" type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700} label="Unlimitted" isChecked={unLimitted} setIsChecked={setUnlimited} />
					</CustomDivTitle>
					<CalenderDiv disabled={unLimitted} calendarIcon={<CalendarIconCustom />} clearIcon={null} minDate={startDate} disableClock={true} format="d-M-y" onChange={handleEndDateChange} value={endDate} />
					<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
						{endDateError}
					</Text>
				</InputWrapper>
				<Spacer height={1.5} />
			</Col>

			{/* <Col lg={6}>
				<StyledFlex>
					<Flexed direction="row" align="center" justify="space-between">
						<Checkbox fontSize="1rem" label="Allow To Order" isChecked={allowToOrder} setIsChecked={setAllowToOrder} />
					</Flexed>
				</StyledFlex>
				<Spacer height={2} />
			</Col> */}

			<Col lg={6} sm={6}>
				<StyledFlex>
					<Flexed direction="row" align="center" justify="space-between">
						<Checkbox fontSize="1rem" type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700} label="Pick-Up" isChecked={isPickUp} setIsChecked={setIsPickUp} />
						<Checkbox fontSize="1rem" type="normal" margin="0rem 0rem 0.25rem 0rem" color="black" fontWeight={700} label="Delivery" isChecked={isDelivery} setIsChecked={setIsDelivery} />
					</Flexed>
				</StyledFlex>
				<Spacer height={2} />
			</Col>

			{isDelivery && (
				<Col lg={10.5} md={10.5} sm={10.3} xs={9.8}>
					<>
						<CustomInputField
							type="text"
							bgTransparent
							disabled={!isDelivery}
							label="Delivery distance in Radius"
							placeholder="Enter the mile radius you deliver"
							handleChange={(e: any) => {
								setDistanceError('')
								if (e === '') {
									setDistanceError('delivery distance is required')
								}
								setDistance(e)
							}}
							value={distance}
							error={distanceError}
							errorMsg={distanceError}
							required
							allowOnlyNumbers={true}
						/>
						<Spacer height={1.5} />
					</>
				</Col>
			)}
			{isDelivery && (
				<div style={{ position: 'relative' }}>
					<RadiusText align="center" direction="row">
						<Text type="small" color="gray">
							Radius
						</Text>
						<Spacer height={1.5} />
					</RadiusText>
				</div>
			)}

			{!isDelivery && <Col lg={6} />}

			<Col lg={6}>
				<AutoComplete tags={chemicalsUsed}
					setTags={setChemicalsUsed}
					bgTransparent={true}
					disabled={toggle === true}
					label="Chemical Used"
					suggestions={chemicals}
					error={chemicalsError}
					errorMsg={chemicalsError}
					setError={setChemicalsError}></AutoComplete>
				<Spacer height={1.5} />
			</Col>

			<Col lg={6}>
				<OrganicFlexed direction="row" gap={0.5} align="flex-end" justify="flex-end">
					<Flexed direction="row" gap="0.5" onClick={() => { }}>
						<Text type="small" color="gray">
							Organic
						</Text>
						<div
							onClick={() => {
								if (toggle === false) {
									if (chemicals?.length > 0) {
										setIsChemicalsErrorModalOpen(true)
									} else {
										toast.success('If you choose organic, it means that no chemicals were used on your crops. But if you use other natural products to treat your crops, please list it in the product description', {
											autoClose: 10000
										})
										setIsAddChemicalsModalOpen(toggle)
									}
								} else {
									setIsAddChemicalsModalOpen(toggle)
								}
							}}>
							<Toggle setToggle={setToggle} toggle={toggle} />
						</div>
					</Flexed>
				</OrganicFlexed>
			</Col>

			<Col>
				<Spacer height={1.5} />
				<CustomInputField
					bgTransparent
					type="textarea"
					label="Caption (Upto 150 words)"
					placeholder="Info that will make your product stand out
							(up to 150 words)"
					handleChange={(e: any) => {
						setCaptionError('')
						if (e === '') {
							setCaptionError('Description is required')
						}
						setCaption(e)
					}}
					value={caption}
					error={captionError}
					errorMsg={captionError}
					required
					textAreaRows={6}
				/>
				<Spacer height={1.5} />
			</Col>
			{isChemicalsErrorModalOpen && (
				<ChemicalsErrorModal
					onClose={() => {
						setIsChemicalsErrorModalOpen(false)
					}}
				/>
			)}
			{isAllowToOrderModalOpen && (
				<AllowToOrderModal
					onClose={() => {
						setIsAllowToOrderModalOpen(false)
					}}
				/>
			)}
		</>
	)
}

const CalendarIconCustom = styled(BiCalendarAlt)`
	color: ${palette.gray};
	font-size: 1.5rem;
`
const InputWrapper = styled.div`
	position: relative;
`
const StyledFlex = styled(Flexed)`
	align-self: center;
	justify-content: center;
`
const StyledWrapper = styled.div`
	position: absolute;
	top: -0.8rem;
	left: 0.5rem;
	font-weight: 500;
	background-color: ${palette.white};
	padding: 0 0.2rem;
	z-index: 1;
`

const CalenderDiv = styled(DateTimePicker) <any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 0.875rem;
	border-radius: .5rem;
	padding: 0.6rem 1.25rem;
	border: 1px solid ${({ error, disabled, isDarkTheme }) => (disabled ? `${palette.green}` : error ? `${palette.danger}` : isDarkTheme ? `${palette.stroke}` : `${palette.stroke}`)};
	color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.text_black}` : `${palette.text_black}`)};
	width: 100%;
	// cursor: ${({ disabled }) => (disabled ? `no-drop` : `pointer`)};
	background: ${({ disabled, bgTransparent, isDarkTheme }) => (bgTransparent ? 'transparent' : disabled ? `${palette.silver}` : isDarkTheme ? `${palette.black}` : `${palette.white}`)};

	// &:hover {
	// 	box-shadow: 0 0 0.31rem ${({ error, disabled }) => (disabled ? 'none' : error ? `${palette.danger}` : 'rgba(0, 0, 0, 0.25)')};
	// }
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? `${palette.danger}` : `${palette.Btn_dark_green}`)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`
const TextLabel = styled(Text)`
	font-weight: 500;
	text-transform: normal;
`

const RadiusText = styled(Flexed)`
	position: absolute;
	top: 2.5rem;
`
const CustomSpacer = styled.div`
	${media.lg`height: 1.688rem`};
`
const OrganicFlexed = styled(Flexed)`
	${media.lg`margin:1.5rem 0rem 0rem 0rem;`};
`

export default EditProductStepperTwo
