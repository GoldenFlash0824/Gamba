import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import 'react-responsive-modal/styles.css'
import {Text, Flexed} from '../styled/shared'
import {palette} from '../styled/colors'
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

const Map = ({open, onCloseModal}: any) => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)
	const [map, setMap] = useState(null)
	const [clat, setCLat] = useState<any>('')
	const [clng, setCLng] = useState<any>('')
	const [location, setLocation] = useState('')

	useEffect(() => {
		if (open) {
			getCurrentLatLng()
		}
	}, [open])

	const containerStyle = {
		width: '100%',
		height: '100vh'
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
				await getCurrentAddress(position.coords.latitude, position.coords.longitude)
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
			.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${parseFloat(lat)},${parseFloat(lng)}&sensor=true&key=${process.env.REACT_APP_MAP_API_KEY}`)
			.then((response) => {
				setLocation(response.data.results[6].formatted_address)
			})
			.catch((error) => {
				setLocation('')
			})
	}

	return (
		<>
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
		</>
	)
}

export default Map
