import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, TextField, Button, Grid, Select, FormControl, MenuItem, Checkbox, FormControlLabel, Switch } from '@material-ui/core'
import { toast } from 'react-toastify'
import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'
import { MDBDataTableV5 } from 'mdbreact'
import StyledImageUpload from '../common/UploadImage'
import { doGetChemicals, getCategory } from '../../assets/constant/apis'
import moment from 'moment'
import ChemicalsMdel from '../common/ChemicalsMdel'
import AddChemicalsModal from '../common/AddChemicalsModel'

const UserDetailForm = ({ user, goBackAllProduct, tabActive }) => {
	useEffect(() => {
		if (user !== null) {
			if (tabActive) {
				setproduct_id(user?.id)
				setSeller(user?.user?.first_name && user?.user?.last_name ? user?.user?.first_name + ' ' + user?.user?.last_name : user?.user?.first_name ? user?.user?.first_name : '')
				setProductName(user?.name)
				user?.trade[0]?.title?.map((data, index) => {
					createTradeWithTable(data)
				})
				setinstock('Unlimited')

				setsetSoldQuantity(user?.sold$ ? user?.sold$ : 0)
				setsoldQuantity(user?.quantity ? user?.quantity : 0)
				setTotalSold(user?.total_sold ? user?.total_sold : 0)
				setprice(user?.price)
				setdescription(user?.caption)
			} else {
				setId(user?.id)
				setproduct_id(user?.product_id)
				setSeller(user?.reported_product?.user?.first_name && user?.reported_product?.user?.last_name ? user?.reported_product?.user?.first_name + ' ' + user?.reported_product?.user?.last_name : user?.reported_product?.user?.first_name ? user?.reported_product?.user?.first_name : '')
				setProductName(user?.reported_product?.name)
				user?.reported_product?.trade[0]?.title?.map((data, index) => {
					createTradeWithTable(data)
				})
				if (user?.reported_product?.quantity > 0) {
					setinstock('yes')
				} else {
					setinstock('no')
				}
				setsetSoldQuantity(user?.reported_product?.sold$)
				setsoldQuantity(user?.reported_product?.quantity)
				setTotalSold(user?.reported_product?.total_sold)
				setprice(user?.reported_product?.price)
				setdescription(user?.reported_product?.caption)
			}

		} else {
			_history.push('/viewAllProduct')
		}
		getAllCategory()
	}, [])
	let product = tabActive ? user : user?.reported_product
	let _history = useHistory()
	const classes = useStyles()
	const [id, setId] = useState('')
	const [product_id, setproduct_id] = useState('')
	const [seller, setSeller] = useState('')
	const [productName, setProductName] = useState('')
	const [instock, setinstock] = useState('')
	const [setSoldQuantity, setsetSoldQuantity] = useState('')
	const [soldQuantity, setsoldQuantity] = useState('')
	const [totalSold, setTotalSold] = useState('')
	const [price, setprice] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [errorproductName, setErrorproductName] = useState('')
	const [errorinstock, setErrorinstock] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorsetSoldQuantity, setErrorsetSoldQuantity] = useState('')
	const [errorsoldQuantity, setErrorsoldQuantity] = useState('')
	const [deleteproduct, setdeleteproduct] = useState(false)
	const [image, setImage] = useState()
	const [imageError, setImageError] = useState('')
	const [description, setdescription] = useState('')
	const [errordescription, setErrordescription] = useState('')
	const [chemicalCheckBoxNone, setChemicalCheckBoxNone] = useState(product?.none)
	const [productCategory, setProductCategory] = useState(product?.category?.title)
	const [productUnit, setProductUnit] = useState(product?.unit)
	const [showImage, setShowImage] = useState(null)
	const [toggle, setToggle] = useState(product?.is_organic)
	const [imageData, setImageData] = useState(product?.images)
	const [quantity, setQuantity] = useState(product?.quantity)
	const [allowToOrder, setAllowToOrder] = useState(product?.allow_to_0rder)
	const [showImageTrade1, setShowImageTrade1] = useState(null)
	const [days, setDays] = useState(product?.allow_to_0rder_advance)
	const [endDate, setEndDate] = useState(tabActive ? user?.available_to ? new Date(tabActive ? user?.available_to : user?.reported_product?.available_to) : new Date() : new Date(tabActive ? user?.available_to : user?.reported_product?.available_to))
	const [isDelivery, setIsDelivery] = useState(tabActive ? user?.is_delivery : user?.reported_product?.is_delivery)
	const [isPickUp, setIsPickUp] = useState(tabActive ? user?.is_pickUp : user?.reported_product?.is_pickUp)
	const [allowCustomersToGetUpTo, setAllowCustomersToGetUpTo] = useState(tabActive ? user?.allow_per_person : user?.reported_product?.allow_per_person)
	const [distance, setDistance] = useState(tabActive ? user?.distance : user?.reported_product?.distance)
	const [caption, setCaption] = useState(tabActive ? user?.caption : user?.reported_product?.caption)
	const [startDate, setStartDate] = useState(tabActive ? user?.available_from ? new Date(tabActive ? user?.available_from : user?.reported_product?.available_from) : new Date() : new Date(tabActive ? user?.available_from : user?.reported_product?.available_from))
	const [hours, setHours] = useState(tabActive ? user?.advance_order_day : user?.reported_product?.advance_order_day)
	const [unLimitted, setUnlimited] = useState(product?.isUnlimitted)

	const [tradeWithProduct, setTradeWithProduct] = useState([
		{
			trade_quantity: '',
			trade_title: '',
			trade_unit: ''
			// trade_image: ''
		}
	])

	const [priceError, setPriceError] = useState('')
	const [allowToOrderError, setAllowToOrderError] = useState('')
	const [allowToOrderOptions, setAllowToOrderOptions] = useState([
		{ value: 'Hour(s)', label: 'Hour(s)' },
		{ value: 'Day(s)', label: 'Day(s)' }
	])

	const [isOrganicError, setIsOrganicError] = useState('')

	const [isAddChemicalsModalOpen, setIsAddChemicalsModalOpen] = useState(false)
	const [discount, setDiscount] = useState(product?.discount)
	const [isTrade, setIsTrade] = useState(product?.is_trade ? 'Trade' : product?.is_donation ? 'Giveaway' : 'Sell')
	const [category, setCategory] = useState('')

	const [chemicalCheckBox, setChemicalCheckBox] = useState(false)
	const [dummyChemicalsArray, setDummyChemicalsArray] = useState([])
	const [chemicals, setChemicals] = useState()
	const [productNameError, setProductNameError] = useState('')
	const [productCategoryError, setProductCategoryError] = useState('')
	const [productUnitError, setProductUnitError] = useState('')
	const [quantityError, setQuantityError] = useState('')
	const [captionError, setCaptionError] = useState('')
	const [distanceError, setDistanceError] = useState('')
	const [daysError, setDaysError] = useState('')
	const [startDateError, setStartDateError] = useState('')
	const [endDateError, setEndDateError] = useState('')
	const [allowCustomersToGetUpToError, setAllowCustomersToGetUpToError] = useState('')

	const [tradeWithProduct_trade_quantityError, setTradeWithProduct_trade_quantityError] = useState('')
	const [tradeWithProduct_trade_titleError, setTradeWithProduct_trade_titleError] = useState('')
	const [isAllowToOrderModalOpen, setIsAllowToOrderModalOpen] = useState(false)
	const [isChemicalsErrorModalOpen, setIsChemicalsErrorModalOpen] = useState(false)

	const [optionType, setOptionType] = useState([
		{ value: 'Sell', label: 'Sell' },
		{ value: 'Giveaway', label: 'Giveaway' },
		{ value: 'Trade', label: 'Trade' }
	])

	const [unitOption, setUnitOption] = useState([
		{ value: 'Unit', label: 'Unit' },
		{ value: 'Kilo', label: 'Kilo' },
		{ value: 'pound', label: 'pound' },
		{ value: 'Dozen', label: 'Dozen' },
		{ value: 'Tray', label: 'Tray' }
	])

	const [productCategoryOptions, setProductCategoryOptions] = useState([
	])

	const [weightOption, setWeightOption] = useState([
		{ value: 'Kg', label: 'Kg' },
		{ value: 'Unit', label: 'Unit' },
		{ value: 'Kilo', label: 'Kilo' },
		{ value: 'pound', label: 'pound' },
		{ value: 'Dozen', label: 'Dozen' },
		{ value: 'Tray', label: 'Tray' }
	])

	const getAllCategory = async () => {
		const response = await getCategory()
		const getChemicals = await doGetChemicals()
		let res = []
		let chemicals = []
		let _chemicals = tabActive ? user?.chemical_data : user?.reported_product?.chemical_data
		getChemicals?.data?.chemical?.length &&
			getChemicals?.data?.chemical?.map((e) => {
				chemicals.push({
					label: e?.title,
					isChecked: _chemicals?.some((c) => {
						if (c?.chemical_id === e?.id) return true
						else return false
					}),
					id: e?.id
				})
			})

		let trades = []
		let _trade = tabActive ? user : user?.reported_product

		_trade?.trade[0]?.title?.map((d) =>
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

		setChemicals(chemicals?.filter((data) => data?.isChecked === true))
	}

	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Quantity',
				field: 'quantity',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Unit', field: 'unit', width: 200, sort: String('disabled') },
			{ label: 'Product', field: 'product', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	const doSaveUser = () => {
		if (checkValidation()) {
			const trade = isTrade == 'Trade' ? true : false
			const donation = isTrade == 'Giveaway' ? true : false

			const chemicalsUsed = chemicals?.map((data) => data?.id)

			const category = productCategoryOptions?.filter((d) => d?.label === productCategory)
			setIsLoading(true)
			api.post(`/admin/update_reported_product`, {
				product_id: product_id,
				product_name: productName,
				quantity: soldQuantity,
				price: price,
				is_donation: donation,
				is_trade: trade,
				images: image,
				is_organic: toggle,
				category_id: category[0]?.id,
				discount,
				unit: productUnit,
				trade_with: tradeWithProduct,
				chemical_id: chemicalsUsed,
				available_from: moment(startDate).format('MM/DD/YY'),
				available_to: moment(endDate).format('MM/DD/YY'),
				allow_to_0rder: isTrade === 'Sell' ? allowToOrder : null,
				is_delivery: isDelivery,
				is_pickUp: isPickUp,
				allow_to_0rder_advance: isTrade === 'Sell' ? days : null,
				distance,
				caption: description,
				allow_per_person: allowCustomersToGetUpTo,
				isUnlimitted: unLimitted
			})
				.then((response) => {
					if (response?.data?.success) {
						goBackAllProduct()
						setIsLoading(false)
						toast.success(tabActive ? 'Product updated successfully.' : 'Reported product updated successfully.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					} else {
						setIsLoading(false)
						toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					}
				})
				.catch(function (error) {
					setIsLoading(false)
					toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
				})
		}
	}
	const doDeleteReportedProduct = () => {
		setIsLoading(true)
		api.delete(tabActive ? `admin/delete_product_good/${product_id}` : `admin/delete_product/${user.id}`)
			.then((response) => {
				if (response?.data?.success) {
					toast.success('product delete successfully.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setdeleteproduct(false)
					setIsLoading(false)
					goBackAllProduct()
				} else {
					toast.error('Something went wrong. Please try again later.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setIsLoading(false)
				}
			})
			.catch(function (error) {
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
				setIsLoading(false)
			})
	}

	const checkValidation = () => {
		let _isValid = true

		let isValid = true
		if (image?.length <= 0) {
			setImageError('Images is required')
			isValid = false
		}


		if (productCategory === '') {
			setProductCategoryError('Product Category is required')
			isValid = false
		}

		if (productName === '') {
			setProductNameError('Product Name is required')
			isValid = false
		}

		if (isTrade == 'Sell' && price === '') {
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

		if (description === '') {
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

		console.log('========', _isValid)
		return _isValid
	}

	const onBlursoldQuantity = () => {
		const errorsoldQuantity = ValidateInput('soldQuantity', soldQuantity)
		if (errorsoldQuantity) {
			setErrorsoldQuantity(errorsoldQuantity)
		} else {
			setErrorsoldQuantity(null)
		}
	}

	const createTradeWithTable = (row) => {
		let _obj = {
			quantity: row?.trade_quantity,
			unit: row?.trade_unit,
			product: row?.trade_title
		}
		setUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	console.log('==========products', product)
	return (
		<>
			{isLoading && (
				<div id="loader-div" className={classes.loading}>
					<div id="loadings"></div>
				</div>
			)}
			<Grid container style={{ marginTop: '1rem' }}>
				<StyledImageUpload event={false} onSelect={setImage} tabActive={tabActive} user={user} post={false} imageError={imageError} product={true} />

			</Grid>
			<Grid container>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Seller <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							value={seller}
							disabled
							onChange={(e) => {
								e.preventDefault()
							}}
						/>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorFullName}
						</Box>
					</Grid>

					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							{isTrade !== 'Trade' ? 'Product name' : 'Product to trade'} <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={productName} onChange={(e) => {
							setProductNameError('')
							if (e.target.value === '') {
								setProductNameError('Product Name is required')
							}
							setProductName(e.target.value)
						}
						} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{productNameError}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Product is for <span className={classes.danger}>*</span>
						</Typography>
						<FormControl className={classes.formControl}>

							<Select
								labelId="dropdown-label"
								id="dropdown"
								value={isTrade}
								onChange={(e) => setIsTrade(e.target.value)}

							>
								{optionType?.map(res => (
									<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
							</Select>
						</FormControl>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
					</Grid>
					{isTrade === 'Trade' && tradeWithProduct.length < 4 &&
						tradeWithProduct?.map((val, index) => {
							return (<Grid item xs={12} md={12} className={classes.control}>
								<Typography variant="subtitle2" className={classes.label}>
									{' '}
									Trade With <span className={classes.danger}>*</span>
								</Typography>
								<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={tradeWithProduct[index].trade_title} onChange={(e) => {
									setTradeWithProduct((prevData) => {
										const newRow = Array.from(prevData)
										newRow[index].trade_title = e.target.value
										return newRow
									})
								}
								} />
								<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
									{tradeWithProduct_trade_titleError}
								</Box>
							</Grid>
							)
						})}
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Product category <span className={classes.danger}>*</span>
						</Typography>
						<FormControl className={classes.formControl}>

							<Select
								labelId="dropdown-label"
								id="dropdown"
								value={productCategory}
								onChange={(e) => {
									setProductCategoryError('')
									if (e.target.value == '') {
										setProductCategoryError('Product Category is required')
									}
									setProductCategory(e.target.value)
								}}

							>
								{productCategoryOptions?.map(res => (
									<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
							</Select>
						</FormControl>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>{productCategoryError}</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label} style={{ marginBottom: '-0.3rem', display: 'flex', justifyContent: 'space-between' }}>
							{' '}
							<div>
								Pick-Up
								<Checkbox type="normal" color="black" fontWeight={700} label="isPickUp" style={{ padding: '0rem' }} checked={isPickUp} onClick={(e) => setIsPickUp(!isPickUp)} />

							</div>
							<Typography variant="subtitle2" className={classes.label} style={{ marginBottom: '-0.3rem', display: 'flex', justifyContent: 'space-between' }}>
								<div>
									Delivery
									<Checkbox type="normal" color="black" fontWeight={700} style={{ padding: '0rem' }} checked={isDelivery} onClick={(e) => setIsDelivery(!isDelivery)} />
								</div>
							</Typography>
						</Typography>
					</Grid>

					<Grid item xs={12} md={12} className={classes.control} >
						<div
							onClick={() => {
								if (!toggle) setIsAddChemicalsModalOpen(true)
							}}>
							<Typography variant="subtitle2" className={classes.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								Chemical Used <FormControlLabel
									control={
										<Switch
											checked={toggle}
											onChange={() => setToggle((prev) => !prev)}
											onClick={() => {
												if (toggle === false) {
													if (chemicals?.length > 0) {
														setIsChemicalsErrorModalOpen(true)
													} else {
														toast.success('If you choose organic, it means that no chemicals were used on your crops. But if you use other natural products to treat your crops, please list it in the product description', {
															autoClose: 20000
														})
														setIsAddChemicalsModalOpen(toggle)
													}
												} else {
													setIsAddChemicalsModalOpen(toggle)
												}
											}}
											name="toggleSwitch"
										/>
									}
									label="Organic"
								/>
							</Typography>
							<TextField type="text" size="small" disabled={toggle} className={classes.textField} fullWidth variant="outlined" bgTransparent value={chemicals?.map((data) => data?.label)} />
						</div>

					</Grid>
				</Grid>

				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Sold Quantity <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" disabled className={classes.textField} fullWidth variant="outlined" value={setSoldQuantity} onChange={(e) => setsetSoldQuantity(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorsetSoldQuantity}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Total Sold <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" disabled className={classes.textField} fullWidth variant="outlined" value={totalSold} onChange={(e) => setTotalSold(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Sold by <span className={classes.danger}>*</span>
						</Typography>
						<FormControl className={classes.formControl}>

							<Select
								labelId="dropdown-label"
								id="dropdown"
								value={productUnit}
								onChange={(e) => {
									setProductUnitError('')
									if (e.target.value == '') {
										setProductUnitError('Unit is required')
									}
									setProductUnit(e.target.value)
								}}

							>
								{unitOption?.map(res => (
									<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
							</Select>
						</FormControl>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>{productUnitError}</Box>
					</Grid>
					{isTrade === 'Trade' && tradeWithProduct.length < 4 &&
						tradeWithProduct?.map((val, index) => {
							return (<Grid item xs={12} md={12} className={classes.control}>
								<Typography variant="subtitle2" className={classes.label}>
									{' '}
									Qt <span className={classes.danger}>*</span>
								</Typography>
								<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined"
									value={tradeWithProduct[index].trade_quantity} onChange={(e) => {
										setTradeWithProduct((prevData) => {
											const newRow = Array.from(prevData)
											newRow[index].trade_quantity = e.target.value.replace(/[^\w\s]/gi, '')
											return newRow
										})
									}
									} />
								<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
									{tradeWithProduct_trade_quantityError}
								</Box>
							</Grid>
							)
						})}
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Product available from <span className={classes.danger}>*</span>
						</Typography>
						<div className={classes.dateTimePicker}>
							<TextField
								className={classes.textField}
								fullWidth
								label=""
								aria-readonly={true}
								variant="outlined"
								// onKeyDown={(e) => e.preventDefault()}
								type="date"
								value={moment(startDate).format('MM-DD-YYYY')}
								onChange={(e) => setStartDate(e.target.value)}
								inputProps={{ min: moment().format() }}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</div>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{startDateError}
						</Box>
					</Grid>
					{isDelivery && <Grid item xs={12} md={12} className={classes.control}>
						<div>

							{isDelivery &&
								<Typography variant="subtitle2" className={classes.label}>
									{' '}
									Delivery distance in Radius<span className={classes.danger}>*</span>
								</Typography>
							}
						</div>

						<div>
							<div style={{ display: 'flex', gap: '0.5rem' }}>

								<TextField type="text" size="small" placeholder='Enter the mile radius you deliver' className={classes.textField} disabled={isTrade != 'Sell' ? true : false} fullWidth variant="outlined" value={distance} onChange={(e) => {
									setDistanceError('')
									if (e.target.value === '') {
										setDistanceError('delivery distance is required')
									}
									setDistance(e.target.value)
								}
								} />
								<span>Miles</span>
							</div>

							<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
								{distanceError}
							</Box>
						</div>
					</Grid>}

				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Product price<span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} disabled={isTrade != 'Sell' ? true : false} fullWidth variant="outlined" value={price} onChange={(e) => {
							setPriceError('')
							if (e.target.value == '') {
								setPriceError('Price is required')
							}
							setprice(e.target.value.replace(/[^\w\s]/gi, ''))
						}
						} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{priceError}
						</Box>
					</Grid>

					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							in Stock <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" disabled className={classes.textField} fullWidth variant="outlined" value={instock} onChange={(e) => setinstock(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorinstock}
						</Box>
					</Grid>

					{isTrade === 'Giveaway' && <Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Allow per person [!]<span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={allowCustomersToGetUpTo} onChange={(e) => setAllowCustomersToGetUpTo(e.target.value.replace(/[^\w\s]/gi, ''))} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{allowCustomersToGetUpToError}
						</Box>
					</Grid>}
					{isTrade === 'Sell' && <Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Discount %<span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} disabled={isTrade != 'Sell' ? true : false} fullWidth variant="outlined" value={discount} onChange={(e) => {
							if (e.target.value.replace(/[^\w\s]/gi, '') <= 100) {
								setDiscount(e.target.value)
							}
						}
						} />
					</Grid>}

					{isTrade === 'Trade' && (
						<Grid item xs={12} md={12} className={classes.control}>
							<Typography variant="subtitle2" className={classes.label}>
								<Box id="" component="div">
									<Box
										component="div"
										style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem', cursor: 'pointer', marginBottom: '1.78rem', }}
										onClick={() => {
											let temp = [...tradeWithProduct]
											if (tradeWithProduct.length < 3) {
												temp.push({
													trade_quantity: '',
													trade_title: '',
													trade_unit: ''
													// trade_image: ''
												})
											}
											setTradeWithProduct(temp)
										}}>
										+
										<Box id="" component="div">Trade product</Box>
									</Box>
								</Box>
							</Typography>
						</Grid>
					)}

					{isTrade === 'Trade' && tradeWithProduct.length < 4 &&
						tradeWithProduct?.map((val, index) => {
							return (<Grid item xs={12} md={12} className={classes.control}>
								<Typography variant="subtitle2" className={classes.label}>
									{' '}
									Sold by <span className={classes.danger}>*</span>
								</Typography>
								<FormControl className={classes.formControl}>

									<Select
										labelId="dropdown-label"
										id="dropdown"
										value={tradeWithProduct[index].trade_unit}
										onChange={(e) => {
											setTradeWithProduct((prevData) => {
												const newRow = Array.from(prevData)
												newRow[index].trade_unit = e.target.value
												return newRow
											})
										}}

									>
										{weightOption?.map(res => (
											<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
									</Select>
								</FormControl>
							</Grid>
							)
						})}
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label} style={{ marginBottom: '-0.3rem', display: 'flex', justifyContent: 'space-between' }}>
							{' '}
							<div>Ends on <span className={classes.danger}>*</span></div>
							<div>
								Unlimitted
								<Checkbox type="normal" color="black" fontWeight={700} label="Unlimitted" style={{ padding: '0rem' }} checked={unLimitted} onClick={(e) => setUnlimited((prev) => !prev)} />

							</div>

						</Typography>
						<div className={classes.dateTimePicker}>
							<TextField
								className={classes.textField}
								fullWidth
								label=""
								aria-readonly={true}
								variant="outlined"
								disabled={unLimitted}
								// onKeyDown={(e) => e.preventDefault()}
								type="date"
								value={moment(endDate).format('MM-DD-YYYY')}
								onChange={(e) => setEndDate(e.target.value)}
								inputProps={{ min: moment().format() }}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</div>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{endDateError}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
					</Grid>
					{isTrade === 'Sell' &&
						<>
							<Grid item xs={12} md={12} className={classes.control}>
								<Typography variant="subtitle2" className={classes.label}>
									{' '}
									Allow to order in advance [!]<span className={classes.danger}>*</span>
								</Typography>
								<TextField type="text" size="small" className={classes.textField} disabled={isTrade != 'Sell' ? true : false} fullWidth variant="outlined" value={days} onChange={(e) => {

									let reg = ''
									if (e.target.value === '') {
										setDaysError('Days is required')
									}
									setDaysError('')
									if (allowToOrder === 'Hour(s)') {
										reg = /^(?:[0-9]|1[0-9]|2[0-3])?$/

										if (reg.test(e.target.value.toString())) {
											setDays(e.target.value.toString())
										}
									} else if (allowToOrder === 'Day(s)') {
										reg = /^(?:[1-9]|10)?$/
										if (reg.test(e.target.value.toString())) {
											setDays(e.target.value.toString())
										}
									}
								}
								} />
								<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
									{daysError}
								</Box>
							</Grid>
							<Grid item xs={12} md={12} className={classes.control}>
								{/* <Typography variant="subtitle2" className={classes.label}>
									{' '}
									<span className={classes.danger}>*</span>
								</Typography> */}
								<FormControl className={classes.formControl}>

									<Select
										labelId="dropdown-label"
										id="dropdown"
										value={allowToOrder}
										onChange={(e) => {
											setAllowToOrderError('')
											if (e.target.value === '') {
												setAllowToOrderError('Allow To Order is required')
											}
											setAllowToOrder(e.target.value)
											if (e.target.value === 'Day(s)') {
												setDays(1)
											} else if (e.target.value === 'Hour(s)') {
												setDays(0)
											}
										}}

									>
										{allowToOrderOptions?.map(res => (
											<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
									</Select>
								</FormControl>
								<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>{productUnitError}</Box>
							</Grid>
						</>
					}
				</Grid>
				<Grid item xs={12} md={12} className={classes.control}>
					<Typography variant="subtitle2" className={classes.label}>
						{' '}
						Post Description <span className={classes.danger}>*</span>
					</Typography>
					<textarea type="text" size="small" rows={6} style={{ width: '100%' }} className={classes.textArea} fullWidth variant="outlined" value={description} onChange={(e) => setdescription(e.target.value)} />
					<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
						{captionError}
					</Box>
				</Grid>
				<Grid item xs={12} md={12} className={classes.control} style={{ textAlign: 'center', justifyContent: 'flex-end', display: 'flex' }}>
					<div style={{ padding: '0 10px' }}></div>
					<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => doSaveUser()}>
						Save Changes
					</Button>
				</Grid>

				{user?.reported_product?.trade?.length && user?.reported_product?.trade[0]?.title?.length > 0 ? (
					<div>
						<h3>Trade with</h3>
						<MDBDataTableV5 className="customTableResponsive tradeTable" responsive={true} paging={false} hover entries={15} pagesAmount={4} data={users} fullPagination searchTop={false} searchBottom={false} />
					</div>
				) : ''}
			</Grid>
			{isChemicalsErrorModalOpen && (
				<ChemicalsMdel
					onClose={() => {
						setIsChemicalsErrorModalOpen(false)
					}}
				/>
			)}
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
			<DeleteModal
				open={deleteproduct}
				close={() => setdeleteproduct(false)}
				title="Delete product"
				message="Do you really want to delete Reported Product? You cannot undo this action."
				deleteButtonText="Delete User"
				deleteAction={doDeleteReportedProduct}
			/>
		</>
	)
}

export default UserDetailForm

const useStyles = makeStyles((theme) => ({
	danger: {
		color: color.red
	},
	label: {
		color: color.darkBlue
	},
	saveButton: {
		marginTop: '10px',
		backgroundColor: color.darkBlue,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.darkBlue
		}
	},
	textArea: {
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		marginTop: '3px',
		focus: 'none',
	},
	deleteButton: {
		backgroundColor: 'transparent',
		color: color.red,
		border: `1px solid ${color.red}`,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		cursor: 'pointer',

		'&:hover': {
			backgroundColor: color.darkRed,
			color: color.white,
		}
	},
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
	errorMessage: {
		color: color.red,
		marginTop: '6px'
	},
	loading: {
		position: 'fixed',
		height: '100%',
		width: '100%',
		left: '0',
		zIndex: ' 99'
	},
	formControl: {
		width: ' 100%',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		padding: '0.456rem 0.4rem'
	},
}))
