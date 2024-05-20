import React from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Text, Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {media} from 'styled-bootstrap-grid'
import Button from '../common/Button'

const AllowToOrderModal = ({onClose, allowPerPerson}: any) => {
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
							{allowPerPerson
								? 'This is to limit donation. If you’d like to have one person get 2 times donation, then enter the number 2, if not leave it alone.'
								: 'Please set it up If you allow customers to order your products ahead of time, please enter the number of hours or days in advance.'}
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

export default AllowToOrderModal
