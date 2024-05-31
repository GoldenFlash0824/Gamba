import React, { useState } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { Flexed, Spacer, Text } from '../styled/shared'
import { useDispatch } from 'react-redux'
import { saveSearchAddress, saveSearchLat, saveSearchLog, saveSearchText } from '../actions/authActions'
import { Document, Page, pdfjs } from 'react-pdf'
import Loader from './common/Loader'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const About = ({ setIsAboutOpen }) => {
	const _dispatch = useDispatch()

	const Layout = defaultLayoutPlugin()
	return (
		<>
			<Flexed direction="row" align="center" gap="0.5">
				<Text
					pointer
					fontWeight={500}
					type="normal"
					color="gray"
					onClick={() => {
						setIsAboutOpen(false)
						_dispatch(saveSearchText(''))
						_dispatch(saveSearchLat(null))
						_dispatch(saveSearchLog(null))
						_dispatch(saveSearchAddress(''))
					}}>
					Home
				</Text>
				<img src="/images/icons/arrow.svg" alt="arrow.svg" />
				<Text fontWeight={500} type="normal" color="black_100">
					About
				</Text>
			</Flexed>

			<Spacer height={2} />
			<Worker workerUrl={`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
				<Viewer fileUrl="/assets/GambaAboutNew.pdf" />
			</Worker>
			<Spacer height={2} />
		</>
	)
}

export default About
