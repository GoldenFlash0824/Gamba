import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { useSelector } from 'react-redux'
import Button from '../components/common/Button'
import { addNewProduct, doGetChemicals, getCategory } from '../apis/apis'
import { useDispatch } from 'react-redux'
import { saveRoute, saveSearchAddress, saveSearchLat, saveSearchLog, saveSearchText, setIsLoading } from '../actions/authActions'
import Loader from './common/Loader'
import { toastError, toastSuccess } from '../styled/toastStyle'
import AddChemicalsModal from './modals/AddChemicalsModal'
import ProductStepperOne from './productStepper/ProductStepperOne'
import ProductStepperTwo from './productStepper/ProductStepperTwo'
import ProductStepperThree from './productStepper/ProductStepperThree'
import { useNavigate } from 'react-router-dom'
import moment from 'moment-timezone'

const CreateProducts = ({ onClose, onCreateProductCB, setSellGoodsCategory }: any) => {
	const isLoading = useSelector<any>((state: any) => state.auth.isLoading)
	const _dispatch = useDispatch()

	const [price, setPrice] = useState('')
	const [productName, setProductName] = useState('')
	const [showImage, setShowImage]: any = useState(null)
	const [toggle, setToggle] = useState(false)
	const [imageData, setImageData] = useState([])
	const [showImageTrade1, setShowImageTrade1]: any = useState(null)
	const [unLimitted, setUnlimited] = useState(false)

	const [chemicalCheckBoxNone, setChemicalCheckBoxNone] = useState(false)

	const [stepper, setStepper] = useState(1)
	const [quantity, setQuantity]: any = useState('')
	const [discount, setDiscount] = useState(0)
	const [category, setCategory] = useState('')
	const [distance, setDistance] = useState('')
	const [caption, setCaption] = useState('')
	const [startDate, setStartDate] = useState(new Date())
	const [hours, setHours] = useState('Day(s)')
	const [days, setDays] = useState('0')
	const [endDate, setEndDate] = useState(new Date())
	const [isDelivery, setIsDelivery] = useState(false)
	const [isPickUp, setIsPickUp] = useState(false)
	const [isAddChemicalsModalOpen, setIsAddChemicalsModalOpen] = useState(false)
	const [allowCustomersToGetUpTo, setAllowCustomersToGetUpTo] = useState('')
	const [inventoryPrice, setInventoryPrice] = useState('')

	const [isOrganicError, setIsOrganicError] = useState('')
	const [inventoryPriceError, setInventoryPriceError] = useState('')
	const [priceError, setPriceError] = useState('')
	const [productNameError, setProductNameError] = useState('')
	const [productCategoryError, setProductCategoryError] = useState('')
	const [productUnitError, setProductUnitError] = useState('')
	const [quantityError, setQuantityError] = useState('')
	const [captionError, setCaptionError] = useState('')
	const [chemicalsError, setChemicalsError] = useState('')
	const [distanceError, setDistanceError] = useState('')
	const [hoursError, setHoursError] = useState('')
	const [daysError, setDaysError] = useState('')
	const [startDateError, setStartDateError] = useState('')
	const [endDateError, setEndDateError] = useState('')
	const [allowToOrderError, setAllowToOrderError] = useState('')
	const [allowCustomersToGetUpToError, setAllowCustomersToGetUpToError] = useState('')
	const [imageError, setImageError] = useState('')
	const [tradeWithProduct_trade_quantityError, setTradeWithProduct_trade_quantityError] = useState('')
	const [tradeWithProduct_trade_titleError, setTradeWithProduct_trade_titleError] = useState('')
	const [tradeWithProduct_trade_unitError, setTradeWithProduct_trade_unitError] = useState('')
	const [tradeWithProduct, setTradeWithProduct] = useState([
		{
			trade_quantity: '',
			trade_title: '',
			trade_unit: ''
			// trade_image: ''
		}
	])
	const [chemicalCheckBox, setChemicalCheckBox] = useState(false)
	const _navigate = useNavigate()

	const [dummyChemicalsArray, setDummyChemicalsArray]: any = useState([])

	const [chemicals, setChemicals] = useState([])
	const [chemicalsUsed, setChemicalsUsed] = useState([]);

	const getAllCategory = async () => {
		const response = await getCategory()
		const getChemicals = await doGetChemicals()
		let res: any = []
		let chemicals: any = []
		getChemicals?.data?.chemical?.length && getChemicals?.data?.chemical?.map((e) => chemicals.push({ label: e?.title, isChecked: false, id: e?.id }))
		response.data.category.map((d: any) => res.push({ id: d.id, value: d.title, label: d.title }))
		setProductCategoryOptions(res)
		setProductCategory(res[0]?.label)
		setCategory(response.data)
		setDummyChemicalsArray(chemicals)
		setChemicals(chemicals)
	}

	useEffect(() => {
		const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
		if (token !== null) {
			getAllCategory()
		}
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

	const [isTrade, setIsTrade] = useState(optionType[0].label)
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
	const [allowToOrderOptions, setAllowToOrderOptions] = useState([
		{ value: 'Hour(s)', label: 'Hour(s)' },
		{ value: 'Day(s)', label: 'Day(s)' }
		// {value: 'Week(s)', label: 'Week(s)'}
	])
	const [allowToOrder, setAllowToOrder] = useState(allowToOrderOptions[0]?.label)

	const [productUnit, setProductUnit] = useState(unitOption[0]?.label)

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

	const [productCategory, setProductCategory] = useState('')

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

	// const [chemicalsOptions, setChemicalsOptions] = useState([
	// 	{label: 'Grapes 🍇', value: 'grapes'},
	// 	{label: 'Mango 🥭', value: 'mango'},
	// 	{label: 'Strawberry 🍓', value: 'strawberry', disabled: true}
	// ])

	const [weightOption, setWeightOption] = useState([
		{ value: 'Kg', label: 'Kg' },
		{ value: 'Unit', label: 'Unit' },
		{ value: 'Kilo', label: 'Kilo' },
		{ value: 'pound', label: 'pound' },
		{ value: 'Dozen', label: 'Dozen' },
		{ value: 'Tray', label: 'Tray' }
	])

	const showFile = () => { }

	const addProduct = async () => {
		const trade = isTrade === 'Trade' ? true : false
		const donation = isTrade === 'Giveaway' ? true : false
		const category: any = productCategoryOptions?.filter((d: any) => d?.label === productCategory)
		const selectedChemicals = chemicalsUsed?.map((data: any) => data)
		_dispatch(setIsLoading(true))
		const response = await addNewProduct(
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
			selectedChemicals,
			moment.tz(startDate, 'America/New_York').format(),
			moment.tz(endDate, 'America/New_York').format(),
			isTrade === 'Sell' ? allowToOrder : null,
			isDelivery,
			isPickUp,
			isTrade === 'Sell' ? days : null,
			distance,
			caption,
			allowCustomersToGetUpTo,
			unLimitted
		)
		_dispatch(setIsLoading(false))
		if (response.success === true) {
			toastSuccess(response.message)
			setPrice('')
			setProductName('')
			setShowImage([])
			_navigate('/products')
			_dispatch(saveRoute('/products'))
			onClose()
		} else {
			toastError(response.message)
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
			if (tradeWithProduct[0].trade_quantity === '') {
				setTradeWithProduct_trade_quantityError('Quantity is required')
				isValid = false
			}
			if (tradeWithProduct[0].trade_title === '') {
				setTradeWithProduct_trade_titleError('Title is required')
				isValid = false
			}
			if (tradeWithProduct[0].trade_unit === '') {
				setTradeWithProduct_trade_unitError('Unit is required')
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

		const _dS = moment(startDate).format('MM/DD/YYYY')
		const _dE = moment(endDate).format('MM/DD/YYYY')

		if (!unLimitted && _dE < _dS) {
			setEndDateError('End Date should be greater')
			isValid = false
		}

		if (!unLimitted && endDate === null) {
			setEndDateError('End Date is required')
			isValid = false
		}

		if (!toggle && chemicalsUsed.length === 0) {
			setChemicalsError('Chemicals are required')
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
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" /></svg>
								</Circle>
								<Text type="small" isCentered>
									Basic
								</Text>
							</Stapper>
							<Stapper>
								<Progress active={stepper === 2 || stepper > 2}></Progress>
								<Circle active={stepper === 2 || stepper > 2}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M252.6 11.7C245.8 .3 231-3.4 219.7 3.4s-15.1 21.6-8.2 32.9l10.3 17.2c6.7 11.2 10.3 24 10.3 37v10.9c-17.1-6.1-36.2-7.4-55.1-2.7l-.2 0c-10.5 2.6-20.1 6.9-28.7 12.4C126.5 97.5 99.5 92.2 72.7 98.9C21.3 111.7-10 163.8 2.9 215.3l56 224c12.9 51.4 65 82.7 116.4 69.8c10.5-2.6 20.1-6.9 28.7-12.4c5.7 3.6 11.8 6.7 18.3 9.2c10.6 4 22 6.1 33.7 6.1h0l0-24 0 24h0c11.7 0 23.1-2.1 33.7-6.1c6.5-2.4 12.6-5.5 18.3-9.2c8.6 5.5 18.3 9.8 28.7 12.4c51.4 12.9 103.6-18.4 116.4-69.8l56-224c12.9-51.4-18.4-103.6-69.9-116.4c-26.8-6.7-53.8-1.4-75.3 12.4c-8.6-5.6-18.3-9.8-28.7-12.4c-19-4.8-38.1-3.5-55.3 2.6V90.6c0-21.7-5.9-43.1-17.1-61.7L252.6 11.7zM84.4 145.4c10.5-2.6 21.1-1.6 30.4 2.4c-10.4 20-13.8 43.8-7.9 67.5l33.6 134.4c3.2 12.9 16.2 20.7 29.1 17.5s20.7-16.2 17.5-29.1L153.4 203.6c-6.2-25 8.3-50.3 32.7-57.6c.7-.2 1.5-.4 2.2-.6c18.7-4.7 37.6 2.3 49 16.4c4.6 5.6 11.4 8.9 18.7 8.9s14.1-3.3 18.7-8.9c11.4-14.1 30.3-21.1 49-16.4c9.2 2.3 17 7 23 13.3c4.5 4.7 10.8 7.4 17.3 7.4s12.8-2.7 17.3-7.4c11.6-12.1 29-17.7 46.3-13.4c25.7 6.4 41.4 32.5 34.9 58.2l-56 224c-6.4 25.7-32.5 41.4-58.2 34.9c-9.2-2.3-17-7-23-13.3c-4.5-4.7-10.8-7.4-17.3-7.4s-12.8 2.7-17.3 7.4c-.2 .2-.5 .5-.7 .7l0 0c-4.7 4.7-10.5 8.5-17.1 11l0 0c-5.3 2-11 3.1-16.8 3.1h0c-5.8 0-11.5-1.1-16.8-3.1l0 0c-6.6-2.5-12.3-6.2-17-10.9l0 0c-.2-.2-.5-.5-.7-.8c-4.5-4.7-10.8-7.4-17.3-7.4s-12.8 2.7-17.3 7.4c-6 6.3-13.9 11-23 13.3c-25.7 6.4-51.8-9.2-58.2-34.9l-56-224c-6.4-25.7 9.2-51.8 34.9-58.2z" /></svg>
								</Circle>
								<Text type="small" isCentered>
									Product Info
								</Text>
							</Stapper>
							<Stapper>
								<Progress active={stepper === 3 || stepper > 3}></Progress>
								<Circle active={stepper === 3 || stepper > 3}>
									{/* <SlScreenDesktop color="white" /> */}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" /></svg>
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
						<ProductStepperThree
							setProductUnitError={setProductUnitError}
							setProductUnit={setProductUnit}
							productUnitError={productUnitError}
							productUnit={productUnit}
							unitOption={unitOption}
							tradeWithProduct_trade_unitError={tradeWithProduct_trade_unitError}
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
						<ProductStepperOne
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
							tradeWithProduct_trade_unitError={tradeWithProduct_trade_unitError}
							tradeWithProduct_trade_titleError={tradeWithProduct_trade_titleError}
							tradeWithProduct_trade_quantityError={tradeWithProduct_trade_quantityError}
							tradeWithProduct={tradeWithProduct}
							setTradeWithProduct={setTradeWithProduct}
							weightOption={weightOption}
						/>
					) : (
						<>
							<ProductStepperTwo
								isTrade={isTrade}
								setChemicalCheckBoxNone={setChemicalCheckBoxNone}
								chemicalCheckBoxNone={chemicalCheckBoxNone}
								allowToOrderOptions={allowToOrderOptions}
								setAllowToOrderOptions={setAllowToOrderOptions}
								captionError={captionError}
								setCaption={setCaption}
								setHoursOptions={setHoursOptions}
								hoursOptions={hoursOptions}
								setCaptionError={setCaptionError}
								caption={caption}
								setHours={setHours}
								hours={hours}
								setInventoryPriceError={setInventoryPriceError}
								inventoryPrice={inventoryPrice}
								inventoryPriceError={inventoryPriceError}
								setInventoryPrice={setInventoryPrice}
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
								setAllowToOrderError={setAllowToOrderError}
								allowToOrderError={allowToOrderError}
								setDistanceError={setDistanceError}
								setDistance={setDistance}
								distance={distance}
								setDaysOption={setDaysOption}
								daysOption={daysOption}
								setDays={setDays}
								days={days}
								setDaysError={setDaysError}
								setIsOrganicError={setIsOrganicError}
								isOrganicError={isOrganicError}
								chemicalsError={chemicalsError}
								setChemicalsError={setChemicalsError}
								daysError={daysError}
								setToggle={setToggle}
								chemicals={chemicals}
								chemicalsUsed={chemicalsUsed}
								setChemicalsUsed={setChemicalsUsed}
								toggle={toggle}
								setIsAddChemicalsModalOpen={setIsAddChemicalsModalOpen}
								setQuantityError={setQuantityError}
								quantityError={quantityError}
								quantity={quantity}
								setQuantity={setQuantity}
								unLimitted={unLimitted}
								setUnlimited={setUnlimited}
							/>
						</>
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
									width={stepper === 1 ? '100%' : '50%'}
									ifClicked={async (e: any) => {
										if (stepper === 1) {
											if (await validationStepperOne()) setStepper(stepper + 1)
										}
										if (stepper === 2) {
											if (await validationStepperTwo()) setStepper(stepper + 1)
										}
									}}
								/>
							) : (
								<Button
									label={`Add Product`}
									width="50%"
									ifClicked={async () => {
										if (validationStepperThree()) addProduct()
									}}
								/>
							)}
						</ActionContent>
					</Col>
				</Row>
				{isLoading && <Loader visible={isLoading} width="100%" />}

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
	height: 20rem;

	background-color: ${({ active }) => (active ? `${palette.Btn_dark_green}` : palette.stroke)};
	position: absolute;
	right: 12.8rem;
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
	svg path{
		fill: ${({ active }) => (active ? `${palette.white}` : '')};
	}
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
export default CreateProducts
