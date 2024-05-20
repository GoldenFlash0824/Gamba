import React, {useEffect, useState} from 'react'
import {getSellerAllPost} from '../../apis/apis'
import ProductPost from '../productPost/ProductPost'
import {Col, Container, Row} from 'styled-bootstrap-grid'
import {Text} from '../../styled/shared'
import {setIsLoading} from '../../actions/authActions'
import {useDispatch} from 'react-redux'

const SellersAllPosts = ({sellerId}: any) => {
	const [sellerPosts, setSellerPost] = useState([])
	const _dispatch = useDispatch()
	const [isDataProgress, setIsDataProgress]: any = useState(true)

	useEffect(() => {
		doGetSellersAllPosts()
	}, [sellerId])
	// getSellerAllPost

	const doGetSellersAllPosts = async () => {
		_dispatch(setIsLoading(true))
		setIsDataProgress(true)
		if (sellerId) {
			const res = await getSellerAllPost(sellerId)
			setSellerPost(res?.data)
		}
		_dispatch(setIsLoading(false))
		setIsDataProgress(false)

	}
	return (
		<Container>
			<Row>
				{sellerPosts?.length ? (
					sellerPosts?.map((d: any) => (
						<Col>
							{' '}
							<ProductPost
								data={d}
								index={d.id}
								userData={d.user}
								community="community"
								// onEdit={() => getPosts()}
								parent={'myPost'}
							/>
						</Col>
					))
				) : sellerPosts?.length === 0 && (
					<Col>
						<Text type="small" margin="4rem 0rem" isCentered>
						{isDataProgress ? '' : 'No data found' }
						</Text>
					</Col>
				)}
			</Row>
		</Container>
	)
}

export default SellersAllPosts
