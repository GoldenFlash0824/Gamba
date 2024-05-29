import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Product from '../components/Product'
import { RsponsiveSpacer } from '../styled/shared'
import { useSelector } from 'react-redux'
import { toastSuccess } from '../styled/toastStyle'
import { useNavigate } from 'react-router-dom'
import VerifyAccountModal from '../components/modals/VerifyAccountModal'

const Products = ({ addToCart, sellerId, setSellerId, setSelectedBtn, setUserId, userId, setSinglePost, setSingleEvent, setIsContactUsOpen, isContactUsOpen, setIsAboutOpen,
	isAboutOpen }: any) => {
	const _navigate = useNavigate();
	const selectedCategory = useSelector<any>((state: any) => state.auth.selectedCategory);
	const [isVerifyAccountModal, setIsVerifyAccountModal] = useState(false);
	let lat = useSelector<any>((state: any) => state.auth.userDetails.lat);
	let log = useSelector<any>((state: any) => state.auth.userDetails.log);
	const [isSelected, setIsSelected] = useState(selectedCategory)

	useEffect(() => {
		setIsSelected(selectedCategory)
	}, [selectedCategory]);

	// useEffect(() => {
	// 	if (lat === null || log === null) {
	// 		setIsVerifyAccountModal(true);
	// 	}
	// }, [lat, log]);

	return (
		<Wrapper>
			<RsponsiveSpacer height={1.875} />
			<Product setSellerId={setSellerId} sellerId={sellerId} addToCart={addToCart} setSelectedBtn={setSelectedBtn} setUserId={setUserId} userId={userId} setSinglePost={setSinglePost} setSingleEvent={setSingleEvent} isContactUsOpen={isContactUsOpen} setIsContactUsOpen={setIsContactUsOpen} setIsAboutOpen={setIsAboutOpen} isAboutOpen={isAboutOpen} />
			<VerifyAccountModal isVerifyAccountModal={isVerifyAccountModal} setIsVerifyAccountModal={setIsVerifyAccountModal} />
		</Wrapper>
	)
}

const Wrapper = styled.div`
	background: #F0F2F5;
`

export default Products
