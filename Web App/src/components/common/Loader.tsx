import React from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'

const Loader = (props: any) => {
	return (
		<Wrapper visible={props.visible} transparent={props.transparent} top={props?.top} width={props.width}>
			<Spinner>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</Spinner>
		</Wrapper>
	)
}
const Spinner = styled.div`
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;

	div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 36px;
		height: 36px;
		margin: 8px;
		border: 4px solid ${palette.Btn_dark_green};
		border-radius: 50%;
		animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: ${palette.Btn_dark_green} transparent transparent transparent;
		transform-origin: 18px 18px;

		&:nth-child(1) {
			animation-delay: -0.45s;
		}

		&:nth-child(2) {
			animation-delay: -0.3s;
		}

		&:nth-child(3) {
			animation-delay: -0.15s;
		}
	}

	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`
const Wrapper = styled.div<any>`
	display: ${(props) => (props.visible === true ? 'flex ' : 'none')};
	position: fixed;
	cursor: pointer;
	font-weight: bold;
	z-index: 9999;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	top: ${(props) => (props.top ? props?.top : '0')};
	right: 0;
	left: 0;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.5);

	height: ${(props) => (props.width ? 'auto' : '100vh')};
	width: ${(props) => (props.width ? 'auto' : '100vw')};
`

export default Loader
