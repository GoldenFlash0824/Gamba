import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Row, Col, Container, media} from 'styled-bootstrap-grid'
import {Heading, Spacer, Text} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {getUserPosts} from '../../apis/apis'
import {Flexed} from '../../styled/shared'
import ProductPost from '../productPost/ProductPost'
import Loader from '../common/Loader'
import {IoIosArrowForward} from 'react-icons/io'
import {useNavigate} from 'react-router-dom'

const ProfilePosts = ({setUserId}) => {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)

	let _navigate = useNavigate()

	const getPosts = async () => {
		setLoading(true)
		const resp = await getUserPosts()
		setPosts(resp.data)
		setLoading(false)
	}

	useEffect(() => {
		getPosts()
	}, [])

	return (
		<Main fluid>
			{loading && <Loader visible={loading} />}
			<Spacer height={1.25} />
			<Flexed direction="row" align="center" gap="0.5">
				<Text
				pointer
					fontWeight={500}
					type="normal"
					color="gray"
					onClick={() => {
						_navigate('/')
						// setSinglePost(null)
						// setSelectProfileSettingsCategory('')
						// setSelectCategory('profile')
					}}>
					Home
				</Text>
				
				<img src='/images/icons/arrow.svg' alt='arrow' />

				<Text fontWeight={500} type="normal" color="black_100">
					My Posts
				</Text>
			</Flexed>
			<Spacer height={1.25} />

			<Wrapper >
				<Row>
					{/* <Spacer height={3} /> */}

					{posts.length
						? posts?.map((d: any) => (
								<Col className='h' lg={6}>
									{' '}
									<ProductPost  data={d} index={d.id} userData={d.user} setUserId={setUserId} community="community" onEdit={() => getPosts()} parent={'myPost'} />
								</Col>
						  ))
						: posts?.length === 0 && (
								<Col>
									<Text type="small" margin="4rem 0rem" isCentered>
									{loading ? '' : 'No data found' }
									</Text>
								</Col>
						  )}
				</Row>
			</Wrapper>
			<Spacer height={2} />
		</Main>
	)
}

const Main = styled(Container)`
	padding-right: 0rem;
	padding-left: 0rem;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`;

const Wrapper = styled.div`
	background-color : #ffffff;
	width: 100%;
	padding: 20px;
	border-radius: 1rem;

	div>.h>div {
		border: 1px solid #e1e2e4 !important;
		padding: 0.5rem;
	}
`


export default ProfilePosts
