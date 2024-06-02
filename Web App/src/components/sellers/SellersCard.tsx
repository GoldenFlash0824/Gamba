import React, {useEffect, useState} from 'react'
import SellersProducts from './SellersProducts'
import SellersProfile from './SellersProfile'
import styled from 'styled-components'
import {getDistanceFromLatLonInMiles} from '../../styled/shared'
import {palette} from '../../styled/colors'
import SellersAction from './SellersAction'

const SellersCard = ({data, commentsModal, setSellerId, sellersCardOpen, setIsSellerSelfProfileOpen, sellerCard, setSelectedSeller}: any) => {
	const [distanceInMiles, setDistanceInMiles]: any = useState('')
	let _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}')

	useEffect(() => {
		doGetDistanceFromLatLonInMiles()
	}, [])

	const doGetDistanceFromLatLonInMiles = async () => {
		if (data?.lat && data?.log && _userLocation.lat && _userLocation.log) {
			const res = await getDistanceFromLatLonInMiles(data?.lat, data?.log, _userLocation.lat, _userLocation.log)
			setDistanceInMiles(res)
		}
	}

	return (
		<Wrapper commentsModal={commentsModal}>
			<SellersProfile
				sellersCardOpen={sellersCardOpen}
				setSellerId={setSellerId}
				distanceInMiles={distanceInMiles}
				data={data}
				sellerCard={sellerCard}
				setSelectedSeller={setSelectedSeller}
				setIsSellerSelfProfileOpen={setIsSellerSelfProfileOpen}
			/>
			<SellersProducts content={data.userProducts} />
			<SellersAction data={data} />
		</Wrapper>
	)
}

const Wrapper = styled.div<any>`
	background-color: ${({commentsModal}) => (commentsModal ? '' : palette.gray_300)};
	border-radius: .675rem;
	padding: 1.25rem;
`

export default SellersCard
