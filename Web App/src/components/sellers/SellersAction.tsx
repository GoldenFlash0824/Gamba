import React, {useState} from 'react'
import styled from 'styled-components'
import {Text, Flexed, Spacer} from '../../styled/shared'
import SocialShareModal from '../modals/SocialShareModal'
import {media} from 'styled-bootstrap-grid'
import {useNavigate} from 'react-router-dom'

const SellersAction = ({data, userData}: any) => {
	const [openSocialModal, setOpenSocialModal] = useState(false)
	const _navigate = useNavigate()

	return (
		<>
			<CustomFlex direction="row" align="center" justify="space-between" gap={1}>
				<Flexed className="icon-text-hover" pointer direction="row" gap={0.225} align="center">
					<Icons src="/images/icons/eye_open.svg" alt="eye_open" />
					<CustomText type="medium" fontSize={0.875} fontWeight={600} color="black_100" onClick={() => _navigate(`/products?id=${data?.id}`)}>
						View Products
					</CustomText>
				</Flexed>
				<ActionContent direction="row" align="center" justify="flex-end">
					{/* <Flexed direction="row" gap={0.313} align="center">
						<Icons src='/images/icons/like.svg' alt='like' />
						<Text type='small' color='gray' fontWeight={500}>250</Text>
					</Flexed>
					<Flexed direction="row" gap={0.313} align="center">
						<Icons src='/images/icons/dislike.svg' alt='dislike' />
						<Text type='small' color='gray' fontWeight={500}>250</Text>
					</Flexed> */}
					<Flexed
						className="icon-text-hover"
						direction="row"
						gap={0.25}
						align="center"
						pointer
						onClick={() => {
							setOpenSocialModal(true)
						}}>
						<ShareIcon src="/images/icons/share.svg" alt="share" />
						<CustomText fontSize={0.975}  color="gray" type="medium" fontWeight={600}>
							Share
						</CustomText>
					</Flexed>
				</ActionContent>
			</CustomFlex>
			{openSocialModal && (
				<SocialShareModal
					sellersProfile={true}
					sellersProfileData={data}
					onClose={() => {
						setOpenSocialModal(false)
					}}
				/>
			)}
		</>
	)
}

const CustomFlex = styled(Flexed)`
	width: 100%;
	padding-top: 0.625rem;
	flex-wrap: wrap;
`

const Icons = styled.img<any>`
	cursor: pointer;
`

const ShareIcon = styled.img<any>`
	cursor: pointer;
	${media.xs`width: 15px;`}
`

const CustomText = styled(Text)`
	${media.xs`font-size:14px !important;`}
`

const ActionContent = styled(Flexed)`
	${media.xs`gap: 0.5rem;`}
	gap: 1.25rem;
`

export default SellersAction
