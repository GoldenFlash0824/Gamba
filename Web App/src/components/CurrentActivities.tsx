import React from 'react'
import styled from 'styled-components'
import 'react-calendar/dist/Calendar.css'
import { media } from 'styled-bootstrap-grid'
import { Flexed, Text } from '../styled/shared'
import { palette } from '../styled/colors'
import { useNavigate } from 'react-router-dom'
const CurrentActivities = ({ data, handleItemClick, setSingleEvent }: any) => {
	const _navigate = useNavigate()
	return (
		<MdHide>
			{data?.data?.event.length !== 0 && (
				<Text type="normal" className="text-start" margin="0rem 0rem 1.25rem 0rem" color="black_100" fontWeight={700}>
					Current Activites
				</Text>
			)}

			{data?.data?.event.map((item: any, index: any) => (
				<List key={index} onClick={() => _navigate(`/calendar?id=${item?.id}`)}>
					<li>
						<Flexed direction="row" align="center" gap={0.5}>
							<div>
								<Profile>
									{item?.eventUser?.image ? (
										<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${item?.eventUser?.image}`} />
									) : (
										<CustomText styledColor={palette.white} type="normal">
											{item?.user?.first_name ? item?.user?.first_name[0].toUpperCase() : 'S'}
										</CustomText>
									)}
								</Profile>
							</div>
							<Name color="black_100" type="normal" pointer lineHeight={1.2} fontWeight={500} textTransform="capitalize">
								{item?.title}
							</Name>
						</Flexed>
					</li>
				</List>
			))}
		</MdHide>
	)
}

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 100%;
`
const MdHide = styled(Flexed)`
	display: none;
	${media.lg`display:flex;`}
`
const List = styled.ul`
	list-style: none;
	padding: 0px;
	margin-bottom: 0;

	& > li {
		padding-bottom: 0.625rem;
		cursor: pointer;
		color: ${palette.text_description};
		&:hover {
			color: ${palette.orange};
			transition: color 0.1s ease-in-out;
		}
	}
`
const CustomText = styled(Text)`
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`
const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 100%;
	// overflow: hidden;
	/* background: ${palette.Btn_dark_green}; */
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`

const Divider = styled.div`
	height: 1px;
	${media.xxl`width: 80%;`}
	background: ${palette.silver};
`

const Name = styled(Text) <any>`
	text-overflow: ellipsis;
	overflow: hidden;
	// width: 10rem;
	height: 1.2em;
	white-space: nowrap;
`

export default CurrentActivities
