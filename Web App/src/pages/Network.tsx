import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flexed, Spacer, Text, MiddleLayout, RsponsiveSpacer } from '../styled/shared'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import { palette } from '../styled/colors'
import MainCategorySideBar from '../components/MainCategorySideBar'
import GambaNetworkList from '../components/GambaNetworkList'
import { useSelector } from 'react-redux'
import { getTopUsersApi } from '../apis/apis'
import { useLocation } from 'react-router-dom'

const Network = ({ setUserId, setSellerId, sellerId, singlePost, setSelectCategory, setSinglePost, setIsContactUsOpen, isAboutOpen, setIsAboutOpen, isContactUsOpen, showStories, setSingleEvent, setSelectedBtn }) => {
    const { pathname } = useLocation()
    const [searchText, setSearchText] = useState("");
    const [expand, setExpand] = useState(false);
    const [topUsers, setTopUsers] = useState([]);
    const randerGambaNetworkListToggle = useSelector<any>((state: any) => state.auth.randerGambaNetworkListToggle)

    const filteredUsers = topUsers?.filter(
        (user: any) =>
            (user?.first_name || user?.last_name) &&
            (user.first_name.toLowerCase().includes(searchText.toLowerCase()) || user.last_name.toLowerCase().includes(searchText.toLowerCase()))
    );

    const getTopUsers = async () => {
        const response = await getTopUsersApi()
        setTopUsers(response?.data?.data)
    }

    useEffect(() => {
        getTopUsers()
    }, [randerGambaNetworkListToggle])

    return (
        <Wrapper>
            <RsponsiveSpacer height={1.875} />
            <Main fluid>
                <Row justifyContent="center">
                    <Col xxl={2.5} xl={3}>
                        <MainCategorySideBar
                            setSelectedBtn={setSelectedBtn}
                            sellerId={sellerId}
                            setSinglePost={setSinglePost}
                            isContactUsOpen={isContactUsOpen}
                            setIsContactUsOpen={setIsContactUsOpen}
                            setIsAboutOpen={setIsAboutOpen}
                            isAboutOpen={isAboutOpen}
                            setSellerId={setSellerId}
                            setSingleEvent={setSingleEvent}
                            setSelectCategory={setSelectCategory}
                        />
                    </Col>
                    <MiddleLayout xxl={7} xl={6} lg={10} style={{ backgroundColor: 'white', borderRadius: '0.875rem', padding: '2rem' }}>
                        <Flexed direction="col">
                            <Flexed direction="row" justify="space-between" align='center'>
                                <CustomText styledColor={palette.black} type="large">
                                    Camba Network Community
                                </CustomText>
                                <InputWrapper>
                                    <Input
                                        className=''
                                        placeholder="Search for"
                                        value={searchText}
                                        onChange={(e: any) => {
                                            setSearchText(e.target.value)
                                        }}
                                    />
                                    <Search src="/images/icons/search.svg" alt="search" />
                                </InputWrapper>
                            </Flexed>
                            <div className="mt-3">
                                {filteredUsers?.length > 6 ? (
                                    <>
                                        {!expand ? (
                                            <>
                                                {filteredUsers.slice(0, 6).map((row, index) => (
                                                    <GambaNetworkList
                                                        key={index}
                                                        setSelectCategory={setSelectCategory}
                                                        setSellerId={setSellerId}
                                                        setUserId={setUserId}
                                                        social={true}
                                                        data={row}
                                                    />
                                                ))}
                                                <button onClick={() => setExpand(true)}>Show More</button>
                                            </>
                                        ) : (
                                            <>
                                                {filteredUsers.map((row, index) => (
                                                    <GambaNetworkList
                                                        key={index}
                                                        setSelectCategory={setSelectCategory}
                                                        setSellerId={setSellerId}
                                                        setUserId={setUserId}
                                                        social={true}
                                                        data={row}
                                                    />
                                                ))}
                                                <button onClick={() => setExpand(false)}>Show Less</button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    filteredUsers?.map((row, index) => (
                                        <GambaNetworkList
                                            key={index}
                                            setSelectCategory={setSelectCategory}
                                            setSellerId={setSellerId}
                                            setUserId={setUserId}
                                            social={true}
                                            data={row}
                                        />
                                    ))
                                )}
                            </div>
                        </Flexed>
                    </MiddleLayout>
                    <SideCol xxl={2.5} xl={3}>
                        <Section>
                            <Spacer height={1} />
                            <Flexed>
                                <AdsImg src="/images/ImageForGamba.png" alt="sidebar_ads_img" />
                                <Text type="small" color="gray" textTransform="">
                                    <p className="side-img-text">Welcome to Gamba, a vibrant community where passion for good food, a commitment to the environment, and the joy of growing, selling, and sharing homegrown or handmade products more... <a href='/about-us' >read more..</a></p>
                                </Text>
                            </Flexed>
                            <Spacer height={1} />
                        </Section>
                    </SideCol>
                </Row>
            </Main>
        </Wrapper>
    )
}

const Wrapper = styled.div`
	background: #f0f2f5;
`

const Button = styled.span`
	border: none;
	cursor: pointer;
	font-size: 0.75rem;
	color: ${palette.gray};
	-webkit-box-align: center;
	-webkit-box-pack: center;
	font-family: Lato-Bold, sans-serif;
`

const Main = styled(Container)`
	padding-right: 0;
	padding-left: 0;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
	background: #F0F2F5
`

const SideCol = styled(Col)`
	display: none;
	${media.xl`display:block;`}
`
const Section = styled.div<any>`
	position: sticky;
	// top: 132.03px;
	top : 100px;
	height: calc(100vh - 132.03px);
	overflow-y: auto;
	display: flex;

	flex-direction: column;
	::-webkit-scrollbar {
		display: none !important;
	}
`

const InputWrapper = styled.div`
	position: relative;
`

const Input = styled.input`
	font-family: 'Lato-Regular', sans-serif;
    font-style: italic;
	line-height: normal;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 1.875rem;
	padding: 0.45rem 3.25rem 0.45rem 1.25rem;
	border: 1px solid rgb(248, 249, 250);
	color: ${palette.black};
	background: #F0F2F5;
	width: 100%;
	&::placeholder {
		color: ${palette.gray_100};
	}
`

const Search = styled.img`
	position: absolute;
	top: 25%;
	right: 1.25rem;
	margin: auto;
	width:20px;
	height:18px;
`

const AdsImg = styled.img`
	border-radius: 8px;
	margin-bottom: 0.625rem;
	/* height: 200px; */
	width: 100%;
	object-fit: cover;
`

const CustomText = styled(Text)`
	/* text-transform: capitalize; */
	color: ${({ styledColor }) => (styledColor ? `${styledColor}` : palette.red)};
`

export default Network;