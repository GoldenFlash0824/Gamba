import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from 'react-places-autocomplete'
import { Text } from '../../styled/shared'

const LocationSearch = ({ setLocation, isPrivate, setLatitude, location, setLongitude, setLocationError, isProfile }: any) => {
	const [address, setAddress] = useState('')

	const handleSelect = (address: any) => {
		if (address !== '') {
			setLocationError('')
			if (isProfile) {
				setAddress(address)
				setLocation(address)
			}

			geocodeByAddress(address)
				.then((results: any) => {
					getLatLng(results[0])
					if (!isProfile) {
						let _address = removeCountryFromAddress(results[0])
						setAddress(_address.formatted_address)
						setLocation(_address.formatted_address)
					}
					if (isPrivate) {
						let _address = privateAddress(results[0])
						setAddress(_address)
						setLocation(_address)
					}
				})
				.then((latLng: any) => {
					setLatitude(latLng?.lat)
					setLongitude(latLng?.lng)
				})
				.catch((error: any) => console.error('Error', error))
		}
	}

	const privateAddress = (address: any) => {
		const addressComponents = address.address_components
		const city = addressComponents.find((component: any) => component.types.includes('locality'))?.long_name || ''
		const state = addressComponents.find((component: any) => component.types.includes('administrative_area_level_1'))?.short_name || ''
		const zip = addressComponents.find((component: any) => component.types.includes('postal_code'))?.long_name || ''

		return `${city} ${state} ${zip}`
	}

	useEffect(() => {
		if (location) {
			setAddress(location)
		}
	}, [location])

	function removeCountryFromAddress(addressDetails: any) {
		const filteredAddressComponents = addressDetails.address_components.filter((component: any) => !component.types.includes('country'))
		const newFormattedAddress = filteredAddressComponents.map((component: any) => component.long_name).join(', ')
		addressDetails.formatted_address = newFormattedAddress

		return addressDetails
	}
	return (
		<>
			<PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
				{({ getInputProps, suggestions, getSuggestionItemProps }: any) => (
					<div>
						<>
							<InputWrapper>
								<LabelWrapper>
									<CalenderLabel type="normal" margin="0rem 0rem 0.25rem 0rem">
										Location
									</CalenderLabel>
								</LabelWrapper>
								<GoogleAutoLocation isPrivate={isPrivate} width={'100%'} borderRadius={'0.2rem'} margin={'0'} padding={'0.8rem 0.8rem 0.8rem 2.5rem'} value={address} {...getInputProps()} placeholder="Search location" />
							</InputWrapper>
							<ListItems open={suggestions?.length > 0}>
								{suggestions?.map((suggestion: any, i: any) => {
									const style = {
										backgroundColor: suggestion.active ? '#32CD32' : 'white'
									}
									return (
										<LocationList
											key={i + 'mapkey'}
											{...getSuggestionItemProps(suggestion, {
												style
											})}>
											{suggestion?.description}
										</LocationList>
									)
								})}
							</ListItems>
						</>
					</div>
				)}
			</PlacesAutocomplete>
		</>
	)
}
const LabelWrapper = styled.div``
const InputWrapper = styled.div`
	position: relative;
`

const CalenderLabel = styled(Text)`
	font-weight: 700;
	color: ${palette.black};
`
const GoogleAutoLocation = styled.input<any>`
	font-family: 'Lato-Regular', sans-serif;
	width: 100%;
	line-height: 1.25rem;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.7rem 1.25rem;
	border: 1px solid ${palette.stroke};
	color: ${({ isPrivate }) => (isPrivate ? palette.gray : palette.black)};
	background: ${palette.white};
	width: 100%;

	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`

const ListItems = styled.div<any>`
	position: absolute;
	background: ${palette.white};
	z-index: 1;
	width: calc(100% - 1.875rem);
	border: ${({ open }) => (open ? `1px solid ${palette.stroke}` : null)};

	border-radius: 1rem;

	max-height: 15rem;
	overflow-y: auto;
`

const LocationList = styled.div`
	background-color: ${palette.white};
	cursor: pointer;
	line-height: 2rem;
	padding: 0.5rem 0.8rem;
	border-bottom: 1px solid ${palette.stroke};
	font-family: 'Lato-Regular', sans-serif;
	text-transform: normal;
	color: ${palette.heading_color};
	&:hover {
		background: ${palette.Btn_dark_green};
		color: ${palette.white};
	}

	&:first-child {
		border-top-left-radius: 0.375rem;
		border-top-right-radius: 0.375rem;
	}
	&:last-child {
		border-bottom-left-radius: 0.375rem;
		border-bottom-right-radius: 0.375rem;
	}
	&:last-child {
		border-bottom: 0;
	}
`

export default LocationSearch
