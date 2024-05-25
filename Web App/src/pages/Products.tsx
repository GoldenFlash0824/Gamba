import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Product from '../components/Product'
import { RsponsiveSpacer } from '../styled/shared'
import { useSelector } from 'react-redux'
import { toastSuccess } from '../styled/toastStyle'

const Products = ({ addToCart, sellerId, setSellerId, setSelectedBtn, setUserId, userId, setSinglePost, setSingleEvent, setIsContactUsOpen, isContactUsOpen, setIsAboutOpen,
	isAboutOpen }: any) => {
	const selectedCategory = useSelector<any>((state: any) => state.auth.selectedCategory);
	let lat = useSelector<any>((state: any) => state.auth.userDetails.lat);
	let log = useSelector<any>((state: any) => state.auth.userDetails.log);
	const [isSelected, setIsSelected] = useState(selectedCategory)

	useEffect(() => {
		setIsSelected(selectedCategory)
	}, [selectedCategory]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (lat === null || log === null) {
			toastSuccess("Please input your address");

			interval = setInterval(() => {
				toastSuccess("Please input your address");
			}, 60000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		}
	}, [lat, log]);

	return (
		<Wrapper>
			<RsponsiveSpacer height={1.875} />
			<Product setSellerId={setSellerId} sellerId={sellerId} addToCart={addToCart} setSelectedBtn={setSelectedBtn} setUserId={setUserId} userId={userId} setSinglePost={setSinglePost} setSingleEvent={setSingleEvent} isContactUsOpen={isContactUsOpen} setIsContactUsOpen={setIsContactUsOpen} setIsAboutOpen={setIsAboutOpen} isAboutOpen={isAboutOpen} />
		</Wrapper>
	)
}

const Wrapper = styled.div`
	background: #F0F2F5;
`

export default Products
