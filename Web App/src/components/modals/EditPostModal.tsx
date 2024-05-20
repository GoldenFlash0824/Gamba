import React, {useState} from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Text, Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import InputField from '../common/InputField'
import Button from '../common/Button'
import {IoIosArrowForward} from 'react-icons/io'
import EditEvent from '../EditEvent'
import EditProduct from '../EditProduct'

const EditPostModal = ({onClose, productContent, openEditEventModal, openProductEditModal, openEditPostModal, data, onUpdate}: any) => {
	const [sellGoodsCategory, setSellGoodsCategory]: any = useState('Products');


	return (
		<>
			<Modal
				open={true}
				center
				onClose={() => {
					onClose()
				}}
				closeOnOverlayClick={false}
				classNames={{
					overlay: 'customOverlay',
					modal: 'addPostModal'
				}}>
				<ModalWrapper>
					<Head direction="row" align='center' gap={0.5}>
						<Text type="large" lineHeight="1.438" color="heading_color" fontWeight={700}>
							{openEditEventModal ? 'Edit Event' : openProductEditModal ? 'Edit Your Goods' : ''}
						</Text>
						{openProductEditModal  && <IoIosArrowForward/>}
							 {openProductEditModal && <span>{sellGoodsCategory}</span>}
					</Head>
					<Body>
						{openEditEventModal ? (
							<EditEvent
								data={data}
								onClose={() => {
									onUpdate()
									onClose()
								}}
							/>
						) : openProductEditModal ? (
							<EditProduct
							setSellGoodsCategory={setSellGoodsCategory}
								productContent={productContent}
								onClose={() => {
									onUpdate()
									onClose()
								}}
							/>
						) : (
							''
						)}
					</Body>
				</ModalWrapper>
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div`
`

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	padding-bottom: 1rem;
`

const Footer = styled.div`
	padding: 1.5rem 2.5rem;
`
const Body = styled.div`
	border-radius: 0.5rem;
	background: ${palette.white};
	// padding: 0rem 2.5rem 1rem 2.5rem;
`
const RadioButton = styled.input`
	height: 1.2rem;
	width: 1.2rem;
	accent-color: #3f730a;
	cursor: pointer;
`
export default EditPostModal
