import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {media} from 'styled-bootstrap-grid'
import {Flexed, Text} from '../../styled/shared'
import {palette} from '../../styled/colors'
import Toggle from '../common/Toggle'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {saveSearchText, setOrganicProducts} from '../../actions/authActions'
import {useSelector} from 'react-redux'
import {sideBarCountProduct} from '../../apis/apis'

const ProductCategories = ({setIsSellerSelfProfileOpen, getAllSellersApi, getAllProducts, isSellerProfileLinkOpen, setIsSellerProfileLinkOpen, getAllUserAndPosts, selectCategory, setSelectCategory, sellersProfile, setSelectSearchCategory}: any) => {
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [toggle, setToggle] = useState(true)
	let [countData, setCountData] = useState<any>('')
	const _navigate = useNavigate()
	const _dispatch = useDispatch()
	const organicProducts: any = useSelector<any>((state: any) => state.auth.organicProducts)
	const currentRoute = useSelector<any>((state: any) => state.auth.currentRoute)

	const getSidebarCount = async () => {
		let count = await sideBarCountProduct()
		setCountData(count.data)
	}

	useEffect(() => {
		getSidebarCount()
	}, [currentRoute])

	useEffect(() => {
		setToggle(organicProducts)
	}, [organicProducts])
	// organicProducts
	// setOrganicProducts

	return (
		<>
			<Categories gap={0.35} align={''} justify={''}>
				<CustomHeading
					type="normal"
					active={selectCategory === 'products'}
					onClick={() => {
						setSelectCategory('products')
						setSelectSearchCategory('products')
						// _dispatch(setOrganicProducts(false))
						_dispatch(saveSearchText(''))
						if (isSellerProfileLinkOpen) {
							setIsSellerProfileLinkOpen(false)
							_navigate('/products')
						}
					}}>
					<SocialIcon src="/images/icons/product.svg" active={selectCategory === 'products'} />
					Products
					{/* {countData?.allProductCount ? `(${countData?.allProductCount})` : ``} */}
				</CustomHeading>

				{!sellersProfile && (
					<CustomHeading
						type="normal"
						active={selectCategory === 'sellers'}
						onClick={async () => {
							setIsSellerSelfProfileOpen(false)
							setSelectCategory('sellers')
							setSelectSearchCategory('sellers')
							_dispatch(saveSearchText(''))
							if (isSellerProfileLinkOpen) {
								setIsSellerProfileLinkOpen(false)
								_navigate('/products')
							}

							if (token !== null) {
								await getAllUserAndPosts()
							}
						}}>
						<SocialIcon small src="/images/icons/sellers.svg" active={selectCategory === 'sellers'} />
						Sellers
						{/* {countData?.sellerCount ? `(${countData?.sellerCount})` : ``} */}
					</CustomHeading>
				)}

				<CustomHeading
					type="normal"
					active={selectCategory === 'trade'}
					onClick={() => {
						setSelectCategory('trade')
						setSelectSearchCategory('trade')
						_dispatch(saveSearchText(''))
						if (isSellerProfileLinkOpen) {
							setIsSellerProfileLinkOpen(false)
							_navigate('/products')
						}
					}}>
					<SocialIcon src="/images/icons/trade.svg" active={selectCategory === 'trade'} />
					Trade
					{/* {countData?.tradeProductCount ? `(${countData?.tradeProductCount})` : ``} */}
				</CustomHeading>

				<CustomHeading
					type="normal"
					active={selectCategory === 'donation'}
					onClick={() => {
						setSelectCategory('donation')
						setSelectSearchCategory('donation')
						_dispatch(saveSearchText(''))
						if (isSellerProfileLinkOpen) {
							_navigate('/products')
							setIsSellerProfileLinkOpen(false)
						}
					}}>
					<SocialIcon src="/images/icons/give_away.svg" active={selectCategory === 'donation'} />
					Giveaway
					{/* {countData?.donationCount ? `(${countData?.donationCount})` : ``} */}
				</CustomHeading>

				<CustomHeading
					type="normal"
					active={selectCategory === 'sale'}
					onClick={() => {
						setSelectCategory('sale')
						setSelectSearchCategory('sale')
						_dispatch(saveSearchText(''))
						if (isSellerProfileLinkOpen) {
							setIsSellerProfileLinkOpen(false)
							_navigate('/products')
						}
					}}>
					<SocialIcon src="/images/icons/sale.svg" active={selectCategory === 'sale'} />
					Sale
					{/* {countData?.saleProductCount ? `(${countData?.saleProductCount})` : ``} */}
				</CustomHeading>
				<Filter
					active={selectCategory === 'products'}
					onClick={async () => {
						_dispatch(setOrganicProducts(!organicProducts))
						if (selectCategory !== 'sellers') await getAllProducts(!organicProducts)
						else await getAllSellersApi(!organicProducts)
					}}>
					<Flexed direction="row" align="center" gap={0.625}>
						<OrganicText type="normal" active={organicProducts}>
							Organic
						</OrganicText>
						<div
							onClick={async () => {
								_dispatch(saveSearchText(''))
								// if(selectCategory !== 'products'){
								// }
							}}>
							{/* <Toggle  setToggle={(e) => _dispatch(setOrganicProducts(e))} toggle={organicProducts} /> */}
							<Switch toggle={organicProducts}>
								<Dot toggle={organicProducts} />
							</Switch>
						</div>
					</Flexed>
				</Filter>
			</Categories>
		</>
	)
}

const Categories = styled(Flexed)`
	flex-wrap: wrap;
	flex-wrap: nowrap;
	flex-direction: row;
	overflow-x: auto;
	margin-bottom: 1rem;
	flex-direction: row;
	${media.sm`justify-content: center;`};
	${media.xl`
	justify-content: start;
	`}

	::-webkit-scrollbar {
		display: none;
	}
`

const SocialIcon = styled.img<any>`
	filter: ${({active}) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`

const CustomHeading = styled(Text)<any>`
	position: relative;
	padding: 0.344rem 0.675rem;
	cursor: pointer;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 0.325rem;
	white-space: nowrap;
	font-weight: ${({active}) => (active ? 700 : 400)};
	background: ${({active}) => (active ? palette.green_300 : palette.white)};
	text-align: center;
	border-radius: 1.25rem;
	color: ${({active}) => (active ? palette.green_200 : palette.gray_400)};
	margin-bottom: 0.5rem;

	&:hover {
		color: ${palette.green_200};
		background: ${palette.green_300};
	}

	&:hover ${SocialIcon} {
		filter: invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);
	}
	${media.xxl`
	padding: 0.344rem 1rem;
	`}
`

const Filter = styled.div<any>`
	padding: 0.344rem 0.5rem;
	margin-bottom: 0.5rem;
	// opacity: ${({active}) => (active ? '0.5' : '1')};
`

const OrganicText = styled(Text)<any>`
	position: relative;
	cursor: pointer;
	white-space: nowrap;
	font-weight: ${({active}) => (active ? 700 : 400)};
	color: ${({active}) => (active ? palette.green_200 : palette.gray_400)};
`

const Switch = styled.div<any>`
	display: flex;
	align-items: center;
	justify-content: ${({toggle}) => (toggle ? 'flex-end' : 'flex-start')};
	background-color: ${({toggle}) => (toggle ? palette.Btn_dark_green : palette.gray_100)};
	width: 35px;
	height: 21px;
	border-radius: 1rem;
	padding: 0.5rem 0.1rem;
	margin-top: 3px;
	transition: justify-content 2s, transform 2s;
	border: 0.063rem solid ${({toggle}) => (toggle ? palette.fbBg : palette.fbBg)};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};
`

const Dot = styled.div<any>`
	width: 15px;
	height: 15px;
	border-radius: 100%;
	background-color: ${palette.white};
`

export default ProductCategories
