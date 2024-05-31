import React, {useState} from 'react'
import styled from 'styled-components'
import {Modal} from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import {Text, Spacer, Flexed} from '../../styled/shared'
import {palette} from '../../styled/colors'
import {media} from 'styled-bootstrap-grid'
import Checkbox from '../common/CheckBox'
import StyledCheckBox from '../common/StyledCheckBox'
import InputField from '../common/InputField'

const UsedChemicalsModal = ({onClose, data}: any) => {
	const [searchProduct, setSearchProduct] = useState('')
	const searchProducts = async (value) => {
		setSearchProduct(value)
	}
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
					modal: 'addPost'
				}}>
				<ModalWrapper>
					<Head direction="row" align="center" justify="space-between">
						<Text type="large" lineHeight="1.438" color="heading_color">
							Chemicals Used
						</Text>
					</Head>
					<Body>
						<>
							{/* <Spacer height={0.5} /> */}
							<InputField handleChange={searchProducts} type="search" placeholder="Search Products" />
							<Spacer height={1} />
						</>
						<Wrapper>
							{data
								?.filter((data: any) => {
									if (searchProduct.length > 0) {
										if (data?.label?.toLowerCase().startsWith(searchProduct?.toLowerCase())) return data
									} else {
										return data
									}
								})
								?.map((data: any, index: any) => {
									// dummyChemicalsArray[index].isChecked = chemicalCheckBox
									return (
										<StyledDiv>
											<Text> {data?.chemical_data_detail?.title}</Text>
										</StyledDiv>
									)
								})}
						</Wrapper>
					</Body>
				</ModalWrapper>
				
			</Modal>
		</>
	)
}
const StyledDiv = styled.div`
	padding: 0.5rem;
	&:not(:last-child) {
		border-bottom: 1px solid ${palette.input_border};
	}
`

const ModalWrapper = styled.div``

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	// padding: 2rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
	padding-bottom: 1rem;
`

const Body = styled.div`
	background: ${palette.white};
	// padding: 1rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`
const Wrapper = styled.div`
	height: 60vh;
	overflow-y: auto;
	border: 1px solid ${palette.input_border};
`

export default UsedChemicalsModal
