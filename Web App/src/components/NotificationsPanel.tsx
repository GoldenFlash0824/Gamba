import React from 'react'
import styled from 'styled-components'
import {Text, Flexed} from '../styled/shared'
import {palette} from '../styled/colors'
import {media} from 'styled-bootstrap-grid'

const NotificationsPanel = () => {
	const notificationsLoop = [
		{
			name: 'Mike',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'John',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'Alan',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'Mike',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'Mike',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'John',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'Alan',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'Mike',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		},
		{
			name: 'Mike',
			profileImg: 'https://nammorganic.wpengine.com/wp-content/uploads/2023/01/instagram-8.jpg',
			notificationHead: 'Three Products sold',
			notificationBody: 'Three Products soldThree Products'
		}
	]
	return (
		<DropNotification>
			<Label>
				<Text color="text_black" fontSize="0.625" textTransform="upperCase">
					Notification&nbsp;(10)
				</Text>
			</Label>

			<NotificationBody>
				{notificationsLoop?.map((data, index) => {
					return (
						<Notifications key={index}>
							<Flexed direction="row" gap={0.5}>
								<CommentsUserProfile>
									{data?.profileImg ? (
										<img src={data?.profileImg} alt="profile" />
									) : (
										<Text fontSize={0.8} color="black">
											{data?.name && data?.name[0]}
										</Text>
									)}
								</CommentsUserProfile>

								<div>
									<Text type="small">{data?.name}</Text>
									<CustomStyledText fontSize="0.75">Three Products sold Three Three Products sold Three Three Products sold Three Three Products sold Three</CustomStyledText>
									<Text color="gray" fontSize="0.625">
										3 minutes ago
									</Text>
								</div>
							</Flexed>
						</Notifications>
					)
				})}
			</NotificationBody>
		</DropNotification>
	)
}

const DropNotification = styled.div<any>`
	/* margin-top: 0.4rem; */
	position: absolute;
	top: 2.2rem;
	right: -0.5rem;
	padding: 1rem 0;
	height: 26.563rem;
	box-shadow: ${palette.shadowHover};

	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	width: 20rem;
	/* box-shadow: ${palette.shadow}; */
	z-index: 1;
	border-radius: 0.5rem;
	${media.sm`
	display:none
	`}
	${media.md`
	display:block
	`}
`

const CustomStyledText = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	width: 16.813rem;
	white-space: nowrap;
`
const Notifications = styled.div<any>`
	color: ${({isDarkTheme}) => (isDarkTheme ? palette.text_black : palette.text_black)};
	font-size: 0.875rem;
	padding: 0.3rem 0.5rem 0.2rem 0.5rem;
	text-decoration: none;
	display: flex;

	align-items: center;
	background-color: ${palette.white};
	border-bottom: 0.063rem solid ${palette.divider_gray};
	&:hover {
		background-color: ${palette.silver};
		transition: color 0.1s ease 0.1s;
	}
`

const NotificationBody = styled.div`
	overflow-x: hidden;
	overflow-y: scroll;
	height: 23rem;
`
const Label = styled.div`
	padding: 0 0.5rem 0.625rem;
	border-bottom: 0.063rem solid ${palette.divider_gray};
`

const CommentsUserProfile = styled.div<any>`
	width: 1.7rem;
	height: 1.7rem;
	border-radius: 100%;
	overflow: hidden;
	background: ${palette.Btn_dark_green};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	align-items: center;
	& > img {
		width: 1.7rem;
		height: 1.7rem;
		border-radius: 100%;

		object-fit: cover;
	}
`

export default NotificationsPanel
