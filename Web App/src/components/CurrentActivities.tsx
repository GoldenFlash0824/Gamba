import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import { media } from 'styled-bootstrap-grid';
import { Flexed, Text, getDistanceFromLatLonInMiles } from '../styled/shared';
import { palette } from '../styled/colors';
import { useNavigate } from 'react-router-dom';

const CurrentActivities = ({ data, handleItemClick, setSingleEvent }: any) => {
	const _navigate = useNavigate();
	const _userLocation = JSON.parse(localStorage?.getItem('userLocation') || '{}');
	const [distances, setDistances] = useState<any>({});

	const doGetDistanceFromLatLonInMiles = async (item: any) => {
		if (item?.eventUser?.lat && item?.eventUser?.log && _userLocation?.lat && _userLocation?.log) {
			const distance = await getDistanceFromLatLonInMiles(item?.eventUser?.lat, item?.eventUser?.log, _userLocation.lat, _userLocation.log);
			return distance;
		}
		return 'N/A';
	};

	useEffect(() => {
		const calculateDistances = async () => {
			const distanceInMiles: any = {};
			for (let item of data?.data?.event || []) {
				distanceInMiles[item.id] = await doGetDistanceFromLatLonInMiles(item);
			}
			setDistances(distanceInMiles);
		};

		calculateDistances();
	}, [data]);

	return (
		<MdHide>
			{data?.data?.event.length !== 0 && (
				<Text type="normal" className="text-start" margin="0rem 0rem 1.25rem 0rem" color="black_100" fontWeight={700}>
					Current Activities
				</Text>
			)}

			{data?.data?.event.map((item: any, index: any) => (
				<List key={index} onClick={() => _navigate(`/calendar?id=${item?.id}`)}>
					<li>
						<Flexed direction="row" align="center" gap={0.5}>
							{/* <div>
								<Profile styledColor={palette.white}>
									{item?.eventUser?.image ? (
										<Img src={`https://imagescontent.s3.us-east-1.amazonaws.com/${item?.eventUser?.image}`} />
									) : (
										<CustomText styledColor={palette.white} type="normal">
											{item?.eventUser?.first_name ? item?.eventUser?.first_name[0].toUpperCase() : 'S'}
										</CustomText>
									)}
								</Profile>
							</div> */}
							<Flexed direction="column">
								<Name color="black_100" type="normal" pointer lineHeight={1.2} fontWeight={500} textTransform="capitalize">
									{item?.title}
								</Name>
								<Flexed direction="row" margin={'0.3rem 0rem 0rem 0rem'} justify={'space-between'}>
									<span style={{ fontSize: '0.8rem', fontWeight: 'normal', fontStyle: 'italic', color: '#aaa' }}>
										By {item?.eventUser?.first_name} {item?.eventUser?.last_name}
									</span>

									<Distance color="text_description" type="xsmall">
										<LocationIcon src="/images/icons/location.svg" alt="location" />
										{distances[item.id] || 'N/A'}
									</Distance>
								</Flexed>
								<Divider style={{ width: '100%', marginTop: '0.5rem' }} />
							</Flexed>
						</Flexed>
					</li>
				</List>
			))}
		</MdHide>
	);
};

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 100%;
`;
const MdHide = styled(Flexed)`
	display: none;
	${media.lg`display:flex;`}
`;

const LgHide = styled.div`
	display: none;
	${media.xl`display:block;`}
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
`;
const CustomText = styled(Text)`
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`;
const Profile = styled.div<any>`
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 100%;
	background: ${({ styledColor }) => (styledColor ? `${styledColor} !important` : palette.Btn_dark_green)};
	color: ${palette.black};
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	position: relative;
`;

const Divider = styled.div`
	height: 1px;
	${media.xxl`width: 80%;`}
	background: ${palette.silver};
`;

const Name = styled(Text) <any>`
	text-overflow: ellipsis;
	overflow: hidden;
	height: 1.2em;
	white-space: nowrap;
`;

const Distance = styled(Text)`
	font-style: normal;
	min-width: 5rem;
	display: flex;
	align-items: center;
`;

const LocationIcon = styled.img`
	width: 16px;
`;

export default CurrentActivities;
