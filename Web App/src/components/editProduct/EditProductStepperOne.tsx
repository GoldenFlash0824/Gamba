import React, {useEffect, useState} from 'react'
import {Col, Row} from 'styled-bootstrap-grid'
import DropDown from '../DropDown'
import {Flexed, Spacer, Text} from '../../styled/shared'
import CustomInputField from '../common/CustomInputField'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {RxCrossCircled} from 'react-icons/rx'
import Toggle from '../common/Toggle'
import {AiOutlinePlus} from 'react-icons/ai'
import MultiInputField from '../common/MultiInputField'

const EditProductStepperOne = ({
	setProductUnitError,
	setProductUnit,
	productUnitError,
	unitOption,
	setProductCategoryError,
	setProductCategory,
	productCategoryError,
	productCategoryOptions,
	setProductNameError,
	setProductName,
	productNameError,
	productName,
	isTrade,
	setPriceError,
	priceError,
	price,
	setPrice,
	setQuantityError,
	quantityError,
	quantity,
	setQuantity,
	setToggle,
	setIsAddChemicalsModalOpen,
	toggle,
	chemicals,
	imageData,
	handleCapture,
	deleteSelectImage,
	showFile,
	discount,
	setDiscount,
	productCategory,
	productUnit,
	setShowImageTrade1,
	weightOption,
	tradeWithProduct,
	setTradeWithProduct,
	tradeWithProduct_trade_titleError,
	tradeWithProduct_trade_quantityError
}) => {
	// const [selectedType, setSelectedType] = useState('')

	// useEffect(() => {
	// 	if (productCategory) {
	// 		productCategoryOptions?.find((e: any) => {
	// 			if (e.value == productCategory) {
	// 				setSelectedType(e?.label)
	// 			}
	// 		})
	// 	}
	// }, [productCategory])

	return (
		<>
			<Col lg={6}>
				<DropDown
					label="Product category"
					firstSelected={productCategory}
					// name="ProductCategory"
					hasChanged={(value: any) => {
						setProductCategoryError('')
						if (value == '') {
							setProductCategoryError('Product Category is required')
						}
						setProductCategory(value)
					}}
					required
					error={productCategoryError}
					errorMsg={productCategoryError}
					options={productCategoryOptions}
				/>
				<Spacer height={1.5} />
			</Col>

			<Col lg={6}>
				<CustomInputField
					label={isTrade !== 'Trade' ? 'Product name' : 'Product to trade'}
					type="text"
					bgTransparent
					placeholder="Enter"
					handleChange={(e: any) => {
						setProductNameError('')
						if (e === '') {
							setProductNameError('Product Name is required')
						}
						setProductName(e)
					}}
					required
					error={productNameError}
					errorMsg={productNameError}
					value={productName}
				/>
				<Spacer height={1.5} />
			</Col>

			{isTrade === 'Sell' && (
				<Col lg={6}>
					<CustomInputField
						label="Product price"
						bgTransparent
						// type="number"
						disabled={isTrade != 'Sell' ? true : false}
						placeholder="Enter"
						handleChange={(e: any) => {
							setPriceError('')
							if (e == '') {
								setPriceError('Price is required')
							}
							setPrice(e)
						}}
						required
						error={priceError}
						errorMsg={priceError}
						value={price}
						allowOnlyNumbersAndDecimal={true}
					/>
					<Spacer height={1.5} />
				</Col>
			)}
			{/* <Col lg={12}>
				<Text>if selected donation or trade price will be disabled</Text>
				<Spacer height={1.5} />
			</Col> */}

			{isTrade === 'Sell' && (
				<Col lg={6}>
					<CustomInputField
						label="Discount %"
						bgTransparent
						type="discount"
						disabled={isTrade != 'Sell' ? true : false}
						styledType="discount"
						placeholder="Enter"
						handleChange={(e: any) => {
							if (e <= 100) {
								setDiscount(e)
							}
						}}
						maxLength={3}
						value={discount}
						allowOnlyNumbersAndDecimal={true}
					/>

					<Spacer height={1.5} />
				</Col>
			)}
			{isTrade === 'Trade' && <Col lg={6} />}

			{isTrade === 'Trade' && (
				<Col lg={6}>
					<Flexed direction="column" gap={0.5} align="flex-end" justify="space-between">
						<AddMore
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
							<AiOutlinePlus size={15} />
							<StyledText>Trade product</StyledText>
						</AddMore>
					</Flexed>
					<Spacer height={1.5} />
				</Col>
			)}
			{isTrade === 'Trade' && tradeWithProduct.length < 4 && (
				<Col>
					{tradeWithProduct?.map((val, index) => {
						return (
							<Row>
								<Col lg={5}>
									<MultiInputField
										label="Trade With"
										bgTransparent
										placeholder={`Enter`}
										index={index}
										value={tradeWithProduct[index].trade_title}
										handleChange={(value: any) => {
											setTradeWithProduct((prevData: any[]) => {
												const newRow = Array.from(prevData)
												newRow[index].trade_title = value
												return newRow
											})
										}}
										required
										errorMsg={tradeWithProduct_trade_titleError}
										error={tradeWithProduct_trade_titleError}
									/>
									<Spacer height={1.5} />
								</Col>
								<Col lg={3}>
									<MultiInputField
										label="Qt"
										bgTransparent
										// type="number"
										placeholder={`Enter`}
										index={index}
										value={tradeWithProduct[index].trade_quantity}
										handleChange={(value: any) => {
											setTradeWithProduct((prevData: any[]) => {
												const newRow = Array.from(prevData)
												newRow[index].trade_quantity = value
												return newRow
											})
										}}
										required
										allowOnlyNumbers={true}
										errorMsg={tradeWithProduct_trade_quantityError}
										error={tradeWithProduct_trade_quantityError}
									/>

									<Spacer height={1.5} />
								</Col>
								<Col lg={4}>
									<DropDown
										label="Sold by"
										firstSelected={val?.trade_unit}
										name="type"
										hasChanged={(value: any) => {
											setTradeWithProduct((prevData: any[]) => {
												const newRow = Array.from(prevData)
												newRow[index].trade_unit = value
												return newRow
											})
											// setWeightOption(value)
										}}
										options={weightOption}
									/>
									<Spacer height={1.5} />
								</Col>

								{/* <Col lg={12}>
									<Row>
										<Col xs={6} sm={6} md={4} lg={4}>
											{!tradeWithProduct[index].trade_image && (
												<InputWrapper>
													<LabelWrapper>
														<ImgWrapperLabel type="small">0 of 1 Image</ImgWrapperLabel>
													</LabelWrapper>
													<Upload className="upload">
														<UploadIcon src="/images/icons/upload_img.svg" onClick={showFile} />

														<FileInput
															id="faceImage"
															accept="image/jpeg/png"
															type="file"
															onChange={(e) => {
																let im: any = e.target.files
																// handleCaptureTrade1(e)
																const reader = new FileReader()
																reader.readAsDataURL(im[0])
																reader.onload = () => {
																	if (reader.readyState === 2) {
																		setShowImageTrade1(reader.result)
																		setTradeWithProduct((prevData: any[]) => {
																			const newRow = Array.from(prevData)
																			newRow[index].trade_image = reader.result
																			return newRow
																		})
																	}
																}
															}}
														/>
													</Upload>
												</InputWrapper>
											)}
											{tradeWithProduct[index].trade_image && (
												<ImgWrapper>
													<ShowImage src={tradeWithProduct[index].trade_image} />
													<IconWrapper
														onClick={() => {
															// setShowImageTrade1(null)
															setTradeWithProduct((prevData: any[]) => {
																const newRow = Array.from(prevData)
																newRow[index].trade_image = ''
																return newRow
															})
														}}>
														<CrossIcon />
													</IconWrapper>
												</ImgWrapper>
											)}
											<Spacer height={1.5} />
										</Col>
									</Row>
								</Col> */}
							</Row>
						)
					})}
				</Col>
			)}

			<Col lg={6} />
		</>
	)
}

const AddMore = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	gap: 0.2rem;
`
const StyledText = styled(Text)`
	text-decoration: underline;
`

const ImgWrapper = styled.div`
	position: relative;
`
const CustomText = styled(Text)`
	color: ${({toggle}) => (toggle ? palette.Btn_dark_green : palette.text)};
`
const ShowImage = styled.img`
	width: 100%;
	height: 8.5rem;
	object-fit: cover;
	border-radius: 0.375rem;
`

const IconWrapper = styled.div``

const InputWrapper = styled.div`
	position: relative;
`
const LabelWrapper = styled.div`
	position: absolute;
	top: -0.8rem;
	left: 0.5rem;
	background-color: ${palette.white};
	padding: 0 0.2rem;
`
const Upload = styled.label`
	padding: 1rem;
	height: 8.5rem;
	border: 0.063rem solid ${palette.stroke};
	border-radius: 0.375rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.7rem;
	flex-direction: column;
	cursor: pointer;
`

const UploadIcon = styled.img`
	width: 3rem;
	/* font-size: 2.5rem; */
	/* color: ${palette.black}; */
`
const FileInput = styled.input`
	display: none !important;
`

const ImgWrapperLabel = styled(Text)`
	/* font-weight: 500; */
	text-transform: normal;
`
const CrossIcon = styled(RxCrossCircled)`
	position: absolute;
	top: 0;
	right: 0;
	cursor: pointer;
`

export default EditProductStepperOne
