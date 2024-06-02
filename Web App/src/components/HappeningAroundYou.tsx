import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Flexed, Text, Spacer} from '../styled/shared'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {colorPicker} from './utils'
import {getPopularEvent} from '../apis/apis'
import HappeningAroundYouList from './HappeningAroundYouList'
import {saveRoute} from '../actions/authActions'

const HappeningAroundYou = () => {
	const [seller, setSeller]: any = useState()
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _navigate = useNavigate()
	const _dispatch = useDispatch()
	const [color, setColor] = useState<any>('')
	const [event, setEvent] = useState([])

	const latestEvent = async () => {
		let response = await getPopularEvent()
		setEvent(response?.data?.event)
	}

	useEffect(() => {
		getColor()
		latestEvent()
	}, [])

	const getColor = async () => {
		let color = await colorPicker('a')
		setColor(color)
		return color
	}
	return (
		<>
			{event?.length > 0 && (
				<Wrapper>
					<Flexed direction="row" justify="space-between" gap={1} align="center">
						<Text type="normal" color="black_100" fontWeight="700">
							What's happening around you
						</Text>
						<Text
							pointer
							type="normal"
							textDecoration="underline"
							fontWeight={500}
							color="blue"
							onClick={() => {
								_navigate('/calendar')
								_dispatch(saveRoute('/calendar'))
							}}>
							View Users & Events
						</Text>
					</Flexed>

					{event?.map((item: any, index: any) => {
						return <>{index < 3 ? <HappeningAroundYouList key={index} item={item} loadEvents={() => latestEvent()} /> : null}</>
					})}
				</Wrapper>
			)}
		</>
	)
}

const Wrapper = styled.div`
	width: 100%;
	margin-bottom: 1.5rem;
`

const ViewMoreText = styled(Text)`
	cursor: pointer;
	font-style: italic;
`

export default HappeningAroundYou
