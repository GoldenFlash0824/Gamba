import React, {useState} from 'react'
import {Col, Row} from 'styled-bootstrap-grid'
import DropDown from '../DropDown'
import {Flexed, Spacer, Text} from '../../styled/shared'
import CustomInputField from '../common/CustomInputField'
import {palette} from '../../styled/colors'
import styled from 'styled-components'
import AllowToOrderModal from '../modals/AllowToOrderModal'

const ProductStepperThree = ({
	tradeWithProduct_trade_unitError,
	setProductUnitError,
	setProductUnit,
	productUnitError,
	productUnit,
	unitOption,
	tradeWithProduct_trade_titleError,
	tradeWithProduct_trade_quantityError,
	setAllowCustomersToGetUpToError,
	setAllowCustomersToGetUpTo,
	allowCustomersToGetUpTo,
	allowCustomersToGetUpToError,
	showFile,
	setShowImageTrade1,
	weightOption,
	tradeWithProduct,
	setTradeWithProduct,
	setDiscount,
	setPriceError,
	priceError,
	price,
	setPrice,
	discount,

	isTrade,
	setIsTrade,
	optionType,
	setToggle,
	setIsAddChemicalsModalOpen,
	toggle,
	chemicals,
	imageData,
	handleCapture,
	deleteSelectImage,
	imageError,
	setImageError
}) => {
	const [isAllowPerPersonModalOpen, setIsAllowPerPersonModalOpen] = useState(false)
	return (
		<>
			{imageData?.map((value: any, index) => {
				return (
					<Col key={index} xs={6} sm={6} md={4} lg={4}>
						<ImgWrapper>
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
			{imageData?.length > 2 ? (
				<Col>
					{/* <Spacer height={0.5} /> */}
					<Text fontSize={0.625} type="small" color="danger">
						You can Add Maximum 2 images
					</Text>
					<Spacer height={1.5} />
				</Col>
			) : (
				imageData?.length < 2 && (
					<Col xs={6} sm={6} md={4} lg={4}>
						<InputWrapper>
							<Upload className="upload">
								<UploadIcon src="/images/icons/upload_img.svg" onClick={showFile} />
								<FileInput
									multiple
									id="faceImage"
									accept="image/jpeg/png"
									type="file"
									onChange={(e) => {
										handleCapture(e)
									}}
								/>
							</Upload>
						</InputWrapper>
					</Col>
				)
			)}
			<Col>
				<ImgWrapperLabel type="small">{imageData?.length} / 2</ImgWrapperLabel>
				{imageData?.length ? (
					''
				) : (
					<Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
						{imageError}
					</Text>
				)}
				<Spacer height={1} />
			</Col>
			<Col lg={isTrade === 'Giveaway' ? 12 : 6}>
				<DropDown
					label="Product is for"
					firstSelected={isTrade}
					name="type"
					hasChanged={(value: any) => {
						setIsTrade(value)
					}}
					required
					options={optionType}
					selectedOption={isTrade}
				/>
				<Spacer height={1.5} />
			</Col>

			{isTrade !== 'Giveaway' && (
				<Col lg={6}>
					<DropDown
						label="Sold by"
						firstSelected={productUnit}
						required
						name="unit"
						hasChanged={(value: any) => {
							setProductUnitError('')
							if (value == '') {
								setProductUnitError('Unit is required')
							}
							setProductUnit(value)
						}}
						error={productUnitError}
						errorMsg={productUnitError}
						options={unitOption}
					/>
					<Spacer height={1.5} />
				</Col>
			)}

			{/* {isTrade === 'Giveaway, Allow Per Person' && <Col lg={6} />} */}

			{isTrade === 'Giveaway' && (
				<Col lg={6}>
					<DropDown
						label="Sold by"
						firstSelected={productUnit}
						required
						name="unit"
						hasChanged={(value: any) => {
							setProductUnitError('')
							if (value == '') {
								setProductUnitError('Unit is required')
							}
							setProductUnit(value)
						}}
						error={productUnitError}
						errorMsg={productUnitError}
						options={unitOption}
					/>
					<Spacer height={1.5} />
				</Col>
			)}
			{isTrade === 'Giveaway' && (
				<Col lg={6}>
					{/* <Spacer height={1.5} /> */}

					<CustomInputField
						label="Allow per person"
						type="text"
						bgTransparent
						modal={true}
						setIsAllowToOrderModalOpen={setIsAllowPerPersonModalOpen}
						// disabled={quantityUnlimited}
						placeholder="Enter"
						handleChange={(e: any) => {
							// setAllowCustomersToGetUpToError('')
							// if (e == '') {
							// 	setAllowCustomersToGetUpToError('Allow Per person is required')
							// }
							setAllowCustomersToGetUpTo(e)
						}}
						// required
						// error={allowCustomersToGetUpToError}
						// errorMsg={allowCustomersToGetUpToError}
						value={allowCustomersToGetUpTo}
						allowOnlyNumbers={true}
					/>
					<Spacer height={1.5} />
				</Col>
			)}

			{isAllowPerPersonModalOpen && (
				<AllowToOrderModal
					allowPerPerson={true}
					onClose={() => {
						setIsAllowPerPersonModalOpen(false)
					}}
				/>
			)}
		</>
	)
}

const IconWrapper = styled.div``

const ImgWrapper = styled.div`
	position: relative;
	margin-bottom: 0.5rem;
`

const InputWrapper = styled.div`
	position: relative;
	margin-bottom: 0.5rem;
`

const CrossIcon = styled.img`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	cursor: pointer;
`

const FileInput = styled.input`
	display: none !important;
`

const ShowImage = styled.img`
	width: 100%;
	height: 8.5rem;
	object-fit: cover;
	border-radius: 1rem;
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
	border-radius: 1rem;
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
const ImgWrapperLabel = styled(Text)`
	/* font-weight: 500; */
	text-transform: normal;
`
const Mandatory = styled.span`
	color: ${palette.danger};
`
export default ProductStepperThree
