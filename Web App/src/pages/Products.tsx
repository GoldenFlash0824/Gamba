import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Product from '../components/Product'
import { RsponsiveSpacer } from '../styled/shared'
import { useSelector } from 'react-redux'
import { palette } from '../styled/colors'

const Products = ({ addToCart, sellerId, setSellerId, setSelectedBtn, setUserId, userId, setSinglePost, setSingleEvent, setIsContactUsOpen, isContactUsOpen, setIsAboutOpen,
	isAboutOpen }: any) => {
	const selectedCategory = useSelector<any>((state: any) => state.auth.selectedCategory)
	const [isSelected, setIsSelected] = useState(selectedCategory)

	useEffect(() => {
		setIsSelected(selectedCategory)
	}, [selectedCategory])
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
