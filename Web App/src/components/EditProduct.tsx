import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { Container, Row, Col } from 'styled-bootstrap-grid'
import Button from '../components/common/Button'
import AddChemicalsModal from './modals/AddChemicalsModal'
import { doGetChemicals, getCategory, updateProduct } from '../apis/apis'
import { useDispatch } from 'react-redux'
import EditProductStepperOne from './editProduct/EditProductStepperOne'
import EditProductStepperTwo from './editProduct/EditProductStepperTwo'
import EditProductStepperThree from './editProduct/EditProductStepperThree'
import { saveRoute, saveSearchAddress, saveSearchLat, saveSearchLog, saveSearchText, setIsLoading } from '../actions/authActions'
import { toastError } from '../styled/toastStyle'
import moment from 'moment-timezone'

const EditProduct = ({ productContent, onClose, setSellGoodsCategory }) => {
	const _dispatch = useDispatch()
	const [chemicalCheckBoxNone, setChemicalCheckBoxNone] = useState(productContent?.none)

	const [price, setPrice] = useState(productContent?.price)
	const [productName, setProductName] = useState(productContent?.name)
	const [productCategory, setProductCategory] = useState(productContent?.category?.title)
	const [productUnit, setProductUnit] = useState(productContent?.unit)
	const [showImage, setShowImage]: any = useState(null)
	const [toggle, setToggle] = useState(productContent?.is_organic)
	const [imageData, setImageData] = useState(productContent?.images)
	const [quantity, setQuantity] = useState(productContent?.quantity)
	const [allowToOrder, setAllowToOrder] = useState(productContent?.allow_to_0rder)
	const [showImageTrade1, setShowImageTrade1]: any = useState(null)
	const [days, setDays] = useState(productContent?.allow_to_0rder_advance)
	const [endDate, setEndDate] = useState(productContent?.available_to ? new Date(productContent?.available_to) : new Date())
	const [isDelivery, setIsDelivery] = useState(productContent?.is_delivery)
	const [isPickUp, setIsPickUp] = useState(productContent?.is_pickUp)
	const [allowCustomersToGetUpTo, setAllowCustomersToGetUpTo] = useState(productContent?.allow_per_person)
	const [distance, setDistance] = useState(productContent?.distance)
	const [caption, setCaption] = useState(productContent?.caption)
	const [startDate, setStartDate] = useState(productContent?.available_from ? new Date(productContent?.available_from) : new Date())
	const [hours, setHours] = useState(productContent?.advance_order_day)
	const [unLimitted, setUnlimited] = useState(false)

	const [tradeWithProduct, setTradeWithProduct] = useState([
		{
			trade_quantity: '',
			trade_title: '',
			trade_unit: ''
			// trade_image: ''
		}
	])

	const [stepper, setStepper] = useState(1)
	// const [chemicals, setChemicals] = useState([])
	const [inventoryPriceError, setInventoryPriceError] = useState('')
	const [priceError, setPriceError] = useState('')
	const [inventoryPrice, setInventoryPrice] = useState('')
	const [allowToOrderError, setAllowToOrderError] = useState('')
	const [allowToOrderOptions, setAllowToOrderOptions] = useState([
		{ value: 'Hour(s)', label: 'Hour(s)' },
		{ value: 'Day(s)', label: 'Day(s)' }
	])

	const [isOrganicError, setIsOrganicError] = useState('')

	const [isAddChemicalsModalOpen, setIsAddChemicalsModalOpen] = useState(false)
	const [discount, setDiscount] = useState(productContent?.discount)
	const [category, setCategory] = useState('')
	// const [allowToOrder, setAllowToOrder] = useState(productContent?.allow_to_0rder)
	const [imageError, setImageError] = useState('')

	const [chemicalCheckBox, setChemicalCheckBox] = useState(false)
	const [dummyChemicalsArray, setDummyChemicalsArray]: any = useState([])
	const [chemicals, setChemicals]: any = useState()

	// const [priceError, setPriceError] = useState('')
	const [productNameError, setProductNameError] = useState('')
	const [productCategoryError, setProductCategoryError] = useState('')
	const [productUnitError, setProductUnitError] = useState('')
	const [quantityError, setQuantityError] = useState('')
	const [captionError, setCaptionError] = useState('')
	const [distanceError, setDistanceError] = useState('')
	const [hoursError, setHoursError] = useState('')
	const [daysError, setDaysError] = useState('')
	const [startDateError, setStartDateError] = useState('')
	const [endDateError, setEndDateError] = useState('')
	const [allowCustomersToGetUpToError, setAllowCustomersToGetUpToError] = useState('')

	const [tradeWithProduct_trade_quantityError, setTradeWithProduct_trade_quantityError] = useState('')
	const [tradeWithProduct_trade_titleError, setTradeWithProduct_trade_titleError] = useState('')

	const getAllCategory = async () => {
		const response = await getCategory()
		const getChemicals = await doGetChemicals()
		let res: any = []
		let chemicals: any = []
		getChemicals?.data?.chemical?.length &&
			getChemicals?.data?.chemical?.map((e) => {
				chemicals.push({
					label: e?.title,
					isChecked: productContent?.chemical_data?.some((c: any) => {
						if (c?.chemical_id === e?.id) return true
						else return false
					}),
					id: e?.id
				})
			})

		let trades: any = []

		productContent?.trade[0]?.title?.map((d) =>
			trades?.push({
				trade_quantity: d?.trade_quantity,
				trade_title: d?.trade_title,
				trade_unit: d?.trade_unit
			})
		)

		setTradeWithProduct(trades)
		response.data.category.map((d) => res.push({ id: d.id, value: d.title, label: d.title }))
		setProductCategoryOptions(res)
		setCategory(response.data)
		setDummyChemicalsArray(chemicals)

		setChemicals(chemicals?.filter((data: any) => data?.isChecked === true))
	}

	useEffect(() => {
		const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
		if (token !== null) {
			getAllCategory()
		}
		setUnlimited(productContent?.isUnlimitted)
		_dispatch(saveSearchText(''))
		_dispatch(saveSearchLat(null))
		_dispatch(saveSearchLog(null))
		_dispatch(saveSearchAddress(''))
	}, [])

	const handleStartDateChange = (date: any) => {
		setStartDateError('')
		setStartDate(date)
	}

	const handleEndDateChange = (date: any) => {
		setEndDateError('')
		setEndDate(date)
	}

	const handleCapture = ({ target }: any) => {
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
	}

	const deleteSelectImage = (index: any) => {
		const deleteImage = imageData.filter((value, ind) => {
			return ind !== index
		})
		setImageData(deleteImage)
	}

	const [optionType, setOptionType] = useState([
		{ value: 'Sell', label: 'Sell' },
		{ value: 'Giveaway', label: 'Giveaway' },
		{ value: 'Trade', label: 'Trade' }
	])
	const [isTrade, setIsTrade] = useState(productContent?.is_trade ? 'Trade' : productContent?.is_donation ? 'Giveaway' : 'Sell')

	useEffect(() => {
		if (isTrade === 'Sell') {
			setSellGoodsCategory('Products')
		} else if (isTrade === 'Giveaway') {
			setSellGoodsCategory('Giveaway')
		} else {
			setSellGoodsCategory('Trade')
		}
	}, [isTrade])

	const [unitOption, setUnitOption] = useState([
		{ value: 'Unit', label: 'Unit' },
		{ value: 'Kilo', label: 'Kilo' },
		{ value: 'pound', label: 'pound' },
		{ value: 'Dozen', label: 'Dozen' },
		{ value: 'Tray', label: 'Tray' }
	])

	const [productCategoryOptions, setProductCategoryOptions] = useState([
		// {value: 'Fruit', label: 'Fruit'},
		// {value: 'Veggies', label: 'Veggies'},
		// {value: 'Herbs', label: 'Herbs'},
		// {value: 'Dairy', label: 'Dairy'},
		// {value: 'eggs', label: 'eggs'},
		// {value: 'Wine', label: 'Wine'},
		// {value: 'Cooking Herbs', label: 'Cooking Herbs'},
		// {value: 'Medicinal Herbs', label: 'Medicinal Herbs'}
	])
	const [hoursOptions, setHoursOptions] = useState([
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: '3', label: '3' },
		{ value: '4', label: '4' },
		{ value: '5', label: '5' },
		{ value: '6', label: '6' },
		{ value: '7', label: '7' },
		{ value: '8', label: '8' },
		{ value: '9', label: '9' },
		{ value: '10', label: '10' },
		{ value: '11', label: '11' },
		{ value: '12', label: '12' },
		{ value: '13', label: '13' },
		{ value: '14', label: '14' },
		{ value: '15', label: '15' },
		{ value: '16', label: '16' },
		{ value: '17', label: '17' },
		{ value: '18', label: '18' },
		{ value: '19', label: '19' },
		{ value: '20', label: '20' },
		{ value: '21', label: '21' },
		{ value: '22', label: '22' },
		{ value: '23', label: '23' }
	])
	const [daysOption, setDaysOption] = useState([
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: '3', label: '3' },
		{ value: '4', label: '4' },
		{ value: '5', label: '5' },
		{ value: '6', label: '6' },
		{ value: '7', label: '7' }
	])

	const [weightOption, setWeightOption] = useState([
		{ value: 'Kg', label: 'Kg' },
		{ value: 'Unit', label: 'Unit' },
		{ value: 'Kilo', label: 'Kilo' },
		{ value: 'pound', label: 'pound' },
		{ value: 'Dozen', label: 'Dozen' },
		{ value: 'Tray', label: 'Tray' }
	])

	const showFile = () => { }

	const doEditProduct = async () => {
		const trade = isTrade === 'Trade' ? true : false
		const donation = isTrade === 'Giveaway' ? true : false

		const chemicalsUsed = chemicals?.map((data) => data?.id)

		const category: any = productCategoryOptions?.filter((d: any) => d?.label === productCategory)
		_dispatch(setIsLoading(true))
		const response = await updateProduct(
			productContent?.id,
			productName,
			price,
			donation,
			trade,
			imageData,
			0,
			toggle,
			category[0]?.id,
			discount,
			productUnit,
			tradeWithProduct,
			chemicalsUsed,
			// moment.tz(startDate, 'America/New_York').format(),
			moment(startDate).format('MM/DD/YY'),
			moment(endDate).format('MM/DD/YY'),
			isTrade === 'Sell' ? allowToOrder : null,
			isDelivery,
			isPickUp,
			isTrade === 'Sell' ? days : null,
			distance,
			caption,
			// chemicalCheckBoxNone,
			allowCustomersToGetUpTo,
			unLimitted
		)
		_dispatch(setIsLoading(false))
		if (response.success === true) {
			// toastSuccess(response?.message)
			setPrice('')
			setProductName('')
			setShowImage([])
			_dispatch(saveRoute('/myproducts'))
			onClose()
		} else {
			toastError(response?.message)
		}
	}

	const validationStepperOne = () => {
		let isValid = true
		if (imageData?.length <= 0) {
			setImageError('Images is required')
			isValid = false
		}

		return isValid
	}

	const validationStepperTwo = () => {
		let isValid = true

		if (productCategory === '') {
			setProductCategoryError('Product Category is required')
			isValid = false
		}

		if (productName === '') {
			setProductNameError('Product Name is required')
			isValid = false
		}

		if (isTrade === 'Sell' && price === '') {
			setPriceError('Price is required')
			isValid = false
		}
		if (isTrade === 'Trade') {
			if (tradeWithProduct[0]?.trade_quantity === '') {
				setTradeWithProduct_trade_quantityError('Quantity is required')
				isValid = false
			}
			if (tradeWithProduct[0]?.trade_title === '') {
				setTradeWithProduct_trade_titleError('Title is required')
				isValid = false
			}
		}

		return isValid
	}
	const validationStepperThree = () => {
		let isValid = true

		if (caption === '') {
			setCaptionError('Caption is required')
			isValid = false
		}
		// }
		if (isTrade !== 'Giveaway' && days === '') {
			setDaysError('required')
			isValid = false
		}
		if (isDelivery) {
			if (distance === '') {
				setDistanceError('delivery distance is required')
				isValid = false
			}
		}
		if (startDate === null) {
			setStartDateError('Start Date is required')
			isValid = false
		}

		const _dS = moment(startDate).format('MM/DD/YYYY, hh:mm A')
		const _dE = moment(endDate).format('MM/DD/YYYY, hh:mm A')

		if (!unLimitted && _dE < _dS) {
			setEndDateError('End Date should be greater')
			isValid = false
		}

		if (!unLimitted && endDate === null) {
			setEndDateError('End Date is required')
			isValid = false
		}

		return isValid
	}

	return (
		<Wrapper>
			<>
				<Row>
					<Col>
						<Section>
							<Stapper>
								<Circle active={stepper === 1 || stepper > 1}>
									<Img src="/icons/basic1.png" />
								</Circle>
								<Text type="small" isCentered>
									Basic
								</Text>
							</Stapper>
							<Stapper>
								<Progress active={stepper === 2 || stepper > 2}></Progress>
								<Circle active={stepper === 2 || stepper > 2}>
									<Img src="/images/icons/product.svg" />
								</Circle>
								<Text type="small" isCentered>
									Product Info
								</Text>
							</Stapper>
							<Stapper>
								<Progress active={stepper === 3 || stepper > 3}></Progress>
								<Circle active={stepper === 3 || stepper > 3}>
									<Img src="/icons/complete.png" />
								</Circle>
								<Text type="small" isCentered>
									Complete
								</Text>
							</Stapper>
						</Section>
						<Spacer height={2} />
					</Col>
				</Row>

				<Row>
					{stepper === 1 ? (
						<EditProductStepperThree
							setProductUnitError={setProductUnitError}
							setProductUnit={setProductUnit}
							productUnitError={productUnitError}
							unitOption={unitOption}
							productUnit={productUnit}
							tradeWithProduct_trade_titleError={tradeWithProduct_trade_titleError}
							tradeWithProduct_trade_quantityError={tradeWithProduct_trade_quantityError}
							showFile={showFile}
							setPriceError={setPriceError}
							priceError={priceError}
							price={price}
							setPrice={setPrice}
							setAllowCustomersToGetUpToError={setAllowCustomersToGetUpToError}
							setAllowCustomersToGetUpTo={setAllowCustomersToGetUpTo}
							allowCustomersToGetUpTo={allowCustomersToGetUpTo}
							allowCustomersToGetUpToError={allowCustomersToGetUpToError}
							setShowImageTrade1={setShowImageTrade1}
							weightOption={weightOption}
							isTrade={isTrade}
							discount={discount}
							setDiscount={setDiscount}
							setToggle={setToggle}
							chemicals={chemicals}
							toggle={toggle}
							setIsAddChemicalsModalOpen={setIsAddChemicalsModalOpen}
							optionType={optionType}
							setIsTrade={setIsTrade}
							tradeWithProduct={tradeWithProduct}
							setTradeWithProduct={setTradeWithProduct}
							imageData={imageData}
							imageError={imageError}
							setImageError={setImageError}
							handleCapture={handleCapture}
							deleteSelectImage={deleteSelectImage}
						/>
					) : stepper === 2 ? (
						<>
							<EditProductStepperOne
								setProductCategoryError={setProductCategoryError}
								setProductCategory={setProductCategory}
								productCategoryError={productCategoryError}
								productCategoryOptions={productCategoryOptions}
								setProductNameError={setProductNameError}
								setProductName={setProductName}
								productNameError={productNameError}
								productName={productName}
								setProductUnitError={setProductUnitError}
								setProductUnit={setProductUnit}
								productUnitError={productUnitError}
								unitOption={unitOption}
								isTrade={isTrade}
								setPriceError={setPriceError}
								priceError={priceError}
								price={price}
								setPrice={setPrice}
								setQuantityError={setQuantityError}
								quantityError={quantityError}
								quantity={quantity}
								setQuantity={setQuantity}
								imageData={imageData}
								handleCapture={handleCapture}
								deleteSelectImage={deleteSelectImage}
								showFile={showFile}
								setToggle={setToggle}
								chemicals={chemicals}
								discount={discount}
								setDiscount={setDiscount}
								toggle={toggle}
								setIsAddChemicalsModalOpen={setIsAddChemicalsModalOpen}
								productCategory={productCategory}
								productUnit={productUnit}
								setShowImageTrade1={setShowImageTrade1}
								weightOption={weightOption}
								tradeWithProduct={tradeWithProduct}
								setTradeWithProduct={setTradeWithProduct}
								tradeWithProduct_trade_titleError={tradeWithProduct_trade_titleError}
								tradeWithProduct_trade_quantityError={tradeWithProduct_trade_quantityError}
							/>
						</>
					) : (
						<EditProductStepperTwo
							setIsOrganicError={setIsOrganicError}
							isOrganicError={isOrganicError}
							setChemicalCheckBoxNone={setChemicalCheckBoxNone}
							chemicalCheckBoxNone={chemicalCheckBoxNone}
							isTrade={isTrade}
							allowToOrderOptions={allowToOrderOptions}
							allowToOrderError={allowToOrderError}
							setAllowToOrderError={setAllowToOrderError}
							setInventoryPriceError={setInventoryPriceError}
							inventoryPrice={inventoryPrice}
							inventoryPriceError={inventoryPriceError}
							setInventoryPrice={setInventoryPrice}
							captionError={captionError}
							setCaption={setCaption}
							setHoursOptions={setHoursOptions}
							hoursOptions={hoursOptions}
							setCaptionError={setCaptionError}
							caption={caption}
							setHours={setHours}
							hours={hours}
							setHoursError={setHoursError}
							hoursError={hoursError}
							setIsPickUp={setIsPickUp}
							setIsDelivery={setIsDelivery}
							isPickUp={isPickUp}
							endDate={endDate}
							handleEndDateChange={handleEndDateChange}
							endDateError={endDateError}
							startDate={startDate}
							handleStartDateChange={handleStartDateChange}
							startDateError={startDateError}
							setAllowToOrder={setAllowToOrder}
							allowToOrder={allowToOrder}
							isDelivery={isDelivery}
							distanceError={distanceError}
							setDistanceError={setDistanceError}
							setDistance={setDistance}
							distance={distance}
							setDaysOption={setDaysOption}
							daysOption={daysOption}
							setDays={setDays}
							days={days}
							setDaysError={setDaysError}
							daysError={daysError}
							setToggle={setToggle}
							chemicals={chemicals}
							toggle={toggle}
							setIsAddChemicalsModalOpen={setIsAddChemicalsModalOpen}
							setQuantityError={setQuantityError}
							quantityError={quantityError}
							quantity={quantity}
							setQuantity={setQuantity}
							unLimitted={unLimitted}
							setUnlimited={setUnlimited}
						/>
					)}
					<Col>
						<Spacer height={1.5} />

						<ActionContent align="center" justify="center">
							{stepper !== 1 ? (
								<Button
									hasBorder
									label="Back"
									width="50%"
									type="clear"
									ifClicked={() => {
										setStepper(stepper - 1)
									}}
								/>
							) : null}
							{stepper !== 3 ? (
								<Button
									label={`Next`}
									type="blue_primary"
									width={stepper === 1 ? '100%' : '50%'}
									ifClicked={(e: any) => {
										if (stepper === 1) {
											if (validationStepperOne()) setStepper(stepper + 1)
										}
										if (stepper === 2) {
											if (validationStepperTwo()) setStepper(stepper + 1)
										}
									}}
								/>
							) : (
								<Button
									label={`Update Product`}
									width="50%"
									type="blue_primary"
									ifClicked={() => {
										if (validationStepperThree()) {
											doEditProduct()
										}
									}}
								/>
							)}
						</ActionContent>
						{/* // OLD BUTTON */}
						{/* <Button
					label="Add a Product"
					width="100%"
					ifClicked={() => {
						if (checkValidationOnClick()) {
							addProduct()
						}
					}}
				/> */}
					</Col>
				</Row>

				{isAddChemicalsModalOpen && (
					<AddChemicalsModal
						setIsOrganicError={setIsOrganicError}
						setChemicals={setChemicals}
						chemicalCheckBox={chemicalCheckBox}
						setChemicalCheckBox={setChemicalCheckBox}
						setDummyChemicalsArray={setDummyChemicalsArray}
						dummyChemicalsArray={dummyChemicalsArray}
						onClose={() => {
							setIsAddChemicalsModalOpen(false)
						}}
					/>
				)}
			</>
		</Wrapper>
	)
}

const Wrapper = styled(Container)`
	padding: 0;
`
const Stapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Progress = styled.div<any>`
	width: 3px;
	border-radius: 0.125rem;
	transform: rotate(90deg);
	height: 11.3rem;

	background-color: ${({ active }) => (active ? `${palette.Btn_dark_green}` : palette.stroke)};
	position: absolute;
	right: 8.8rem;
	bottom: 24px;
	top: 0;
	margin: auto;
	@media screen and (min-width: 0px) and (max-width: 520px) {
		height: 6.5rem;
		right: 6.2rem;
	}
`
const Circle = styled.button<any>`
	height: 50px;
	width: 50px;
	padding: 10px;
	border: 0.063rem solid ${({ active }) => (active ? `${palette.Btn_dark_green}` : palette.stroke)};
	background-color: ${({ active }) => (active ? `${palette.Btn_dark_green}` : palette.stroke)};
	color: ${({ active }) => (active ? `${palette.white}` : `${palette.text_description}`)};
	border-radius: 5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	outline: none;
	z-index: 1;
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 500;
	font-size: 1.5rem;
	line-height: 2rem;
	text-transform: capitalize;
	margin-bottom: 0.5rem;
`

const Section = styled.div`
	display: flex;
	/* gap: 3.5rem; */
	/* gap: 9.5rem; */
	justify-content: space-between;
	align-items: center;
	@media screen and (min-width: 0px) and (max-width: 430px) {
		/* gap: 2rem; */
	}
`

const Img = styled.img`
	width: 100%;
`

const ActionContent = styled(Flexed)`
	gap: 1rem;
	flex-direction: row;
	@media screen and (min-width: 0px) and (max-width: 621px) {
		// flex-direction: column-reverse;
		justify-content: center;
		gap: 0.5rem;
		& button {
			width: 100% !important;
		}
	}
`
export default EditProduct
