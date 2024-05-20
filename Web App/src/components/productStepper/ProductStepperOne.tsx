import React from 'react'
import {Col, Row} from 'styled-bootstrap-grid'
import DropDown from '../DropDown'
import {Flexed, Spacer, Text} from '../../styled/shared'
import CustomInputField from '../common/CustomInputField'
import styled from 'styled-components'
import {AiOutlinePlus} from 'react-icons/ai'
import MultiInputField from '../common/MultiInputField'

const ProductStepperOne = ({
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
	tradeWithProduct_trade_quantityError,
	tradeWithProduct_trade_titleError,
	tradeWithProduct_trade_unitError,
	tradeWithProduct,
	setTradeWithProduct,
	weightOption
}) => {
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
					bgTransparent
					label={isTrade !== 'Trade' ? 'Product name' : 'Product to trade'}
					type="text"
					placeholder="Enter"
					handleChange={(e: any) => {
						setProductNameError('')
						if (e === '') {
							setProductNameError('Product name is required')
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
						bgTransparent
						label="Product price"
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

						// allowNumber={true}
					/>
					<Spacer height={1.5} />
				</Col>
			)}
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
					{tradeWithProduct.map((val, index) => {
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
										required
										errorMsg={tradeWithProduct_trade_unitError}
										error={tradeWithProduct_trade_unitError}
										options={weightOption}
									/>
									<Spacer height={1.5} />
								</Col>
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

export default ProductStepperOne
