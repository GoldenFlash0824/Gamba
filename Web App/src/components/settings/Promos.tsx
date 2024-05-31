import React, {useState} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Flexed, Spacer, Text} from '../../styled/shared'
import {Row, Col, media} from 'styled-bootstrap-grid'
import {IoIosArrowForward} from 'react-icons/io'
import CustomInputField from '../common/CustomInputField'
import Button from '../common/Button'

const Promos = ({setSelectCategory, setSelectProfileSettingsCategory}) => {
	const [verificationCode, setVerificationCode] = useState('')

	return (
		<>
			<Flexed direction="row" align="center" gap="0.5" margin="0.5rem 0rem">
				<StyledHeading
					opacity
					type="normal"
					onClick={() => {
						setSelectProfileSettingsCategory('')
						setSelectCategory('profile')
					}}>
					Account
				</StyledHeading>
				<IoIosArrowForward />
				<StyledHeading type="normal" color="text">
					Account Security
				</StyledHeading>
			</Flexed>
			<Spacer height={0.5} />
			<Wrapper>
				<Row>
					<Col>
						<Flexed align="center" justify="center">
							<ImgWrapper>
								<Img src="/icons/sticker.png" />
							</ImgWrapper>
							<Text type="large" color="text" fontWeight="600" isCentered>
								You do not have coupons
							</Text>
							<Spacer height={0.5} />

							<Text type="normal" color="text_description" isCentered>
								Go hunt for vouchers at laundry Voucher Right Away
							</Text>
							<Spacer height={1} />
							<InputField>
								<CustomInputField
									type="text"
									placeholder="Enter the Voucher"
									handleChange={(e: any) => {
										setVerificationCode(e)
									}}
									value={verificationCode}
									required
								/>
							</InputField>

							<Spacer height={1} />
						</Flexed>
					</Col>

					<Col>
						<Flexed direction="row" align="center" justify="center">
							<Button label="Submit" width="min-content" ifClicked={() => {}} />
						</Flexed>
					</Col>
				</Row>
			</Wrapper>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white} !important;
	padding: 2.5rem 1.5rem;
	width: 100%;
	box-shadow: 0.063rem 0.063rem 2px ${palette.posts_shadow};
	border-radius: 0.3rem;
`

const InputField = styled.div`
	width: 12rem;
`
const ImgWrapper = styled.div`
	width: 12rem;
`
const Img = styled.img`
	width: 100%;
`

const StyledHeading = styled(Text)<any>`
	position: relative;
	cursor: pointer;
	opacity: ${({opacity}) => (opacity ? '0.5' : '1')};
	/* color: ${({active}) => (active ? palette.Btn_dark_green : palette.text_black)}; */
`

export default Promos
