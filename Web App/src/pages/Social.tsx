import Community from './Community'
import { RsponsiveSpacer } from '../styled/shared'
import styled from 'styled-components'

const Social = ({ setUserId, setSellerId, sellerId, singlePost, setSelectCategory, setSinglePost, setIsContactUsOpen, isAboutOpen, setIsAboutOpen, isContactUsOpen, showStories, setSingleEvent, setSelectedBtn }) => {
	return (
		<Wrapper>
			<RsponsiveSpacer height={1.875} />
			<Community
				setSellerId={setSellerId}
				sellerId={sellerId}
				setSinglePost={setSinglePost}
				setSelectCategory={setSelectCategory}
				singlePost={singlePost}
				isContactUsOpen={isContactUsOpen}
				isAboutOpen={isAboutOpen}
				setIsAboutOpen={setIsAboutOpen}
				setIsContactUsOpen={setIsContactUsOpen}
				setUserId={setUserId}
				showStories={showStories}
				setSingleEvent={setSingleEvent}
				setSelectedBtn={setSelectedBtn}
			/>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	background: #f0f2f5;
`

export default Social
