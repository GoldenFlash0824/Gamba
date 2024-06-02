import React from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Text, Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {media} from 'styled-bootstrap-grid'
import Button from '../common/Button'

const ChemicalsErrorModal = ({onClose}: any) => {
	return (
		<>
			<Modal
				open={true}
				onClose={() => {
					onClose(false)
				}}
				center
				classNames={{
					overlay: 'customOverlay',
					modal: 'smallModal'
				}}>
				<ModalWrapper>
					<Head direction="row" align="center" justify="space-between">
						<Text type="large" lineHeight="1.438" color="heading_color">
							Info
						</Text>
					</Head>
					<Body>
						<Text type="normal" color="text">
							You’ve selected organic, normally organic products are offered without chemical sprayed, if it is organic please uncheck the chemical
						</Text>
						<Spacer height={2} />
						<Flexed direction="row" align="center" justify="center">
							<Button  label="Ok" ifClicked={onClose} />
						</Flexed>
					</Body>
				</ModalWrapper>
				
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div``

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	padding-bottom: 1rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`

const Body = styled.div`
	background: ${palette.white};
	// padding: 1rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`

export default ChemicalsErrorModal
