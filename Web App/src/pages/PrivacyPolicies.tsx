import React, { useState } from 'react'
import { Flexed, Spacer, Text } from '../styled/shared'
import { useDispatch } from 'react-redux'
import { saveSearchText } from '../actions/authActions'
import { Document, Page, pdfjs } from 'react-pdf'
import Loader from '../components/common/Loader'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { useNavigate } from 'react-router-dom'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const PrivacyPolicies = () => {
	const _dispatch = useDispatch()

	const _navigate = useNavigate()
	const Layout = defaultLayoutPlugin()

	return (
		<div style={{ overflow: 'hidden' }}>
			<Flexed className="mt-4" direction="row" align="center" gap="0.5">
				<Text
					pointer
					fontWeight={500}
					type="normal"
					color="gray"
					onClick={() => {
						_dispatch(saveSearchText(''))
						_navigate('/products')
					}}>
					Home
				</Text>
				<img src="/images/icons/arrow.svg" alt="arrow.svg" />
				<Text fontWeight={500} type="normal" color="black_100">
					Privacy Policies
				</Text>
			</Flexed>

			<Spacer height={2} />
			<Wrapper>
				<div style={{ width: '100%', maxWidth: '1000px' }}>
					<Worker workerUrl={`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
						<Viewer fileUrl="/assets/Gamba_Privacy_Policy.pdf" />
					</Worker>
				</div>
			</Wrapper>
			<Spacer height={2} />
		</div>
	)
}

const Wrapper = styled.div<any>`
	background-color: ${palette.white};
	padding: 1rem;
	border: 1px solid ${palette.stroke};
	border-radius: 0.5rem;
	transition: border 0.1s ease 0.1s;
	display: flex;
	justify-content: center;
`

export default PrivacyPolicies
