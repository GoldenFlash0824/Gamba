import React, {useState} from 'react'
import styled from 'styled-components'
import {DropMenu, Flexed} from '../styled/shared'
import {palette} from '../styled/colors'
import {AiFillBank} from 'react-icons/ai'

const MobViewAddPost = ({select, setSelect, isAddPostModalOpen, setIsAddPostModalOpen, setIsModalFooterOpen}: any) => {
	return (
		<>
			<CustomDropContent>
				<div
					onClick={() => {
						setIsAddPostModalOpen(true)
						setSelect('Photo')
						setIsModalFooterOpen(false)
					}}>
					<DropMenu>
						<Flexed direction="row" align="center" gap={0.5}>
							<div>
								<SocialIcon src="/icons/home.png" />
							</div>
							Share your Post
						</Flexed>
					</DropMenu>
				</div>

				<DropMenu
					onClick={() => {
						setIsAddPostModalOpen(true)
						setSelect('Sell')
						setIsModalFooterOpen(false)
					}}>
					<Flexed direction="row" align="center" gap={0.5}>
						<div>
							<SocialIcon src="/icons/calender.png" />
						</div>
						Create an Event
					</Flexed>
				</DropMenu>
				<DropMenu
					onClick={() => {
						setIsAddPostModalOpen(true)
						setSelect('Goods')
						setIsModalFooterOpen(false)
					}}>
					<Flexed direction="row" align="center" gap={0.5}>
						<div>
							<SocialIcon src="/images/icons/product.svg"  />
						</div>
						Sell a Product
					</Flexed>
				</DropMenu>
			</CustomDropContent>
		</>
	)
}

const CustomDropContent = styled.div<any>`
	position: absolute;
	top: 3rem;
	right: -0.5rem;
	padding: 1rem 0;
	width: 13rem;
	max-height: 20rem;
	overflow-y: scroll;
	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	z-index: 1;
	border-radius: 0.5rem;
	box-shadow: ${palette.shadow};
`

const Icon = styled(AiFillBank)`
	font-size: 1.2rem;
`

const SocialIcon = styled.img<any>`
	width: 1.2rem;
	color: ${({pathname}) => (pathname === '/' ? palette.Btn_dark_green : palette.text)};
`
export default MobViewAddPost
