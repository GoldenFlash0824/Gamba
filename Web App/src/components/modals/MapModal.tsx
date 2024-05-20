import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Text, Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {BsXLg} from 'react-icons/bs'
import {GoogleMap, useJsApiLoader, MarkerF} from '@react-google-maps/api'
import {useSelector} from 'react-redux'

import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
interface IProps {
	isDarkTheme: boolean
}

const MapModal = ({open, onCloseModal, data}: any) => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [map, setMap] = useState(null)
	const [clat, setCLat] = useState<any>(parseFloat(data?.latitude))
	const [clng, setCLng] = useState<any>(parseFloat(data?.longitude))
	const [location, setLocation] = useState('')

	useEffect(() => {
		if (open) {
			getCurrentLatLng()
		}
	}, [open])

	const containerStyle = {
		width: '100%',
		height: '400px'
	}

	const center = {
		lat: clat ? clat : 38.892708,
		lng: clng ? clng : -94.6426741,
		zoom: 15
	}

	const {isLoaded} = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyCyeed677ICVk7ZvQARsvHpE0P5Mjgx52Q'
	})

	const getCurrentLatLng = async () => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				setCLat(position.coords.latitude)
				setCLng(position.coords.longitude)
				// await getCurrentAddress(position.coords.latitude, position.coords.longitude)
			},
			function (error) {
				// eslint-disable-next-line eqeqeq
				if (error.code == error.PERMISSION_DENIED) {
				} else {
				}
			},
			{timeout: 5000, enableHighAccuracy: true}
		)
	}

	//Function to get Exact Address from above taken Latitude and longitude
	const getCurrentAddress = async (lat: any, lng: any) => {
		await axios
			.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${parseFloat(lat)},${parseFloat(lng)}&sensor=true&key=AIzaSyCyeed677ICVk7ZvQARsvHpE0P5Mjgx52Q`)
			.then((response) => {
				setLocation(response.data.results[6].formatted_address)
			})
			.catch((error) => {
				setLocation('')
			})
	}
	return (
		<>
			<Modal
				open={true}
				center
				onClose={() => {
					onCloseModal()
				}}
				classNames={{
					overlay: 'customOverlay',
					modal: 'locationModal'
				}}
				showCloseIcon={false}
				// @ts-ignore
				styles={{zIndex: '2'}}>
				<ModalWrapper isDarkTheme={_isDarkTheme}>
					<Head direction="row" align="center" justify="space-between">
						<Text type="large" lineHeight="1.438" color="heading_color">
							Map
						</Text>
						<CrossIcon
							isDarkTheme={_isDarkTheme}
							onClick={() => {
								onCloseModal()
							}}
						/>
					</Head>
					<Body>
						{isLoaded ? (
							<GoogleMap
								mapContainerStyle={containerStyle}
								zoom={center.zoom}
								center={center}
								onLoad={(map: any) => {
									setMap(map)
								}}
								options={{
									mapTypeControl: false,
									fullscreenControl: false,
									streetViewControl: false
								}}>
								<MarkerF
									position={{lat: parseFloat(clat), lng: parseFloat(clng)}}
									icon={{
										url: `/images/icons/marker.svg`,
										scaledSize: new window.google.maps.Size(40, 40),
										// @ts-ignore
										shape: {coords: [17, 17, 18], type: 'circle'},
										optimized: false
									}}
								/>
								<></>
							</GoogleMap>
						) : (
							<Text isDarkTheme={_isDarkTheme}>Loading</Text>
						)}
					</Body>
					
				</ModalWrapper>
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div<IProps>`
	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
`

const Head = styled(Flexed)`
	padding: 0rem 0px  1rem 0px;
`

const Body = styled.div``

const CrossIcon = styled(BsXLg)<IProps>`
	cursor: pointer;
	z-index: 1;
	padding: 0.2rem;
	color: ${({isDarkTheme}) => (isDarkTheme ? palette.silver : palette.gray)};
	font-size: 1.3rem;
`

export default MapModal
