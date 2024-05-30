import React from 'react'
import styled from 'styled-components'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import { Text, Spacer, Flexed } from '../../styled/shared'
import { palette } from '../../styled/colors'
import ProductDetailsCard from '../ProductDetailsCard'
import { useNavigate } from 'react-router-dom'

const VerifyAccountModal = ({ isVerifyAccountModal, setIsVerifyAccountModal }: any) => {
	const _navigate = useNavigate();
	const customStyles = {
		modal: {
			backgroundColor: '#2b2b2b',
			width: '30%',
			borderRadius: '4rem',
			paddingBottom: '10px !important'
		}
	}

	const handleClick = () => {
		setIsVerifyAccountModal(false);
		_navigate("/settings");
	}

	return (
		<>
			<Modal
				open={isVerifyAccountModal}
				onClose={() => {
					setIsVerifyAccountModal(false)
				}}
				center
				showCloseIcon={false}
				classNames={{
					overlay: 'customOverlay',
					modal: 'productDetailModel'
				}}
				styles={customStyles}>
				<div>
					<Body>
						<Flexed direction="column" gap={1} margin='0rem 0rem 1.125rem 0rem' align="start" justify="start">
							<Flexed direction="row" justify="center" style={{ width: '100%' }}>
								<Text fontSize={1.125} fontWeight={700} color='white'>We are so thrilled to have you on board!</Text>
							</Flexed>
							<Text fontSize={1} fontWeight={200} color='white' lineHeight={1.6}>One last step is needed: please complete your profile.
								This is necessary for posting and selling. Your personal information, including your location, will not be disclosed.
								It will only show the distance between buyers and sellers. You can always change this in the privacy settings. Thanks again for becoming part of Gamba’s community!</Text>
							<Flexed direction="row" justify="flex-end" style={{ width: '100%' }}>
								<Button onClick={handleClick}>Got it</Button>
							</Flexed>
						</Flexed>
					</Body>
				</div>
			</Modal>
		</>
	)
}

const Body = styled.div`
`

export const MenuText = styled(Text) <any>`
	position: relative;
	color: ${({ active }) => (active ? palette.Btn_dark_green : palette.text)};
	letter-spacing: 0.05em;
	/* font-weight: 600; */
	font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};

	cursor: pointer;
	&:not(:last-child) {
		/* padding-right: 2.5rem; */
	}

	&:hover {
		color: ${({ active }) => (active ? palette.Btn_dark_green : palette.Btn_dark_green)};
		transition: color 0.1s ease 0.1s;
	}
`

const Button = styled.div<any>`
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.25rem;
	height: 2rem;
	color: ${palette.black};
	font-weight: 700;
	font-family: 'Lato-Regular', sans-serif;
	font-size: 0.875rem;
	text-align: left;
	opacity: 1;
	width: 6.5rem;
	background-color: #ffda00;
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: #caae06;
		color: ${palette.white};
	}
`

export default VerifyAccountModal
