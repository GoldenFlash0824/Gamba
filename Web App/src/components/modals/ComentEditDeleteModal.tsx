import React from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {media} from 'styled-bootstrap-grid'

const ComentEditDeleteModal = ({onClose, onEdit, onDelete}: any) => {
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
					<Spacer height="2" />
					<Body>
						<Flex direction="column" justify="center">
							<CustomDiv onClick={onEdit}>Edit</CustomDiv>
							<CustomDiv onClick={onDelete}>Delete</CustomDiv>
						</Flex>
					</Body>
				</ModalWrapper>
				
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div``

const Body = styled.div`
	background: ${palette.white};
	padding: 1rem 2.5rem;
	${media.xs`padding: 1.5rem 1.5rem;`};
`

const Flex = styled(Flexed)`
	flex-wrap: wrap;
	/* gap: 0.5rem; */
	/* text-align: center; */
`

const CustomDiv = styled.div`
	padding: 0.4rem;
	cursor: pointer;
	:hover {
		background: #d9dada;
		border-radius: 0.2rem;
	}
`

export default ComentEditDeleteModal
