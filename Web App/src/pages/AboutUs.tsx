import React, {useState} from 'react'
import {Flexed, Spacer, Text} from '../styled/shared'
import {useDispatch} from 'react-redux'
import {saveSearchText} from '../actions/authActions'
import {pdfjs} from 'react-pdf'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {useNavigate} from 'react-router-dom'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import {Worker, Viewer} from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const AboutUs = ({profile}: any) => {
	const _dispatch = useDispatch()
	const _navigate = useNavigate()

	const Layout = defaultLayoutPlugin()
	return (
		<div style={{overflow: 'hidden'}}>
			{/* {loading && <Loader visible={loading} />} */}
			{!profile && (
				<Flexed className= "mt-4" direction="row" align="center" gap="0.5">
					<Text
						pointer
						fontWeight={500}
						type="normal"
						color="gray"
						onClick={() => {
							_dispatch(saveSearchText(''))
							_navigate('/')
						}}>
						Home
					</Text>
					<img src="/images/icons/arrow.svg" alt="arrow.svg" />
					<Text fontWeight={500} type="normal" color="black_100">
						About Us
					</Text>
				</Flexed>
			)}

				<div className='card mt-3 mb-5 shadow-none p-3'>
						<div className='card-body'>
						<div className='row d-flex  justify-content-center '>
						<div className='col-10'>
						<img src="../images/gambaLogo.png" alt="" className='img-fluid w-25' />
						 <p className='mt-3 mb-3'>
						 Welcome to Gamba, a vibrant community where passion for good
						food, a commitment to the environment, and the joy of growing,
						selling, and sharing homegrown or handmade products come
						together. Gamba serves as a unique platform that connects likeminded individuals who are dedicated to cultivating a sustainable
						lifestyle.
						 </p>
						 
						 <p className='mb-3'>
						 At Gamba, we believe in the power of community-driven
							initiatives. Whether you're an avid gardener, a skilled artisan, or
							someone who simply appreciates quality, Gamba provides a
							space for individuals to come together to practice, share, sell, and
even giveaway the products they've lovingly crafted or
cultivated. Our community is built on the principles of
collaboration, fostering a sense of unity among people who share
common values and interests.

						 </p>

						 <h4 className='my-4'>The community of passionate individuals</h4>
						 <p className='mb-3'>
						 By joining Gamba, you become part of a network of individuals
who are not only passionate about what they create but are also
conscious of the impact their actions have on the environment.
It's more than just a platform; it's a community that celebrates
the beauty of sustainable living, where members can connect
with each other, exchange ideas, and support one another on
their journey towards a more mindful and eco-friendly lifestyle
						 </p>

						 <div className='d-flex justify-content-center mb-3'>
						 <img src="../images/about/img1.jpg" alt="" className='img-fluid w-50  rounded-6 ' />
						 </div>

						 <h4 className='mt-5 mb-3'>Share your sustainable goods</h4>
						 <p className='mb-3'>Whether you're looking to showcase your culinary creations,
share your gardening expertise, or find unique, locallyproduced goods, Gamba is the place to be. Join us in building a
community that values the goodness of homemade,
handcrafted, and locally sourced products. Together, let's
create a sustainable future, one delicious meal, beautiful
handcrafted item, or thriving garden at a time.</p>

<div className='d-flex justify-content-center mb-3'>
						 <img src="../images/about/img2.jpg" alt="" className='img-fluid w-50  rounded-6 ' />
						 </div>

						<h4 className='mb-3 mt-5'>Host Creative Activities at Your Venue!</h4>
						<p className='mb-3'>
						At Gamba, we invite you to infuse excitement into your space
by organizing unique activities like '<strong>A Picking Day.</strong>' Tailored
for individuals, families, and kids, this event can be offered
with flexible pricing or as a complimentary experience.
						</p>
						<p className='mb-3'>
						Elevate your venue's charm with our '<strong>Farmer's Lunch Special.</strong>'
Let local farmers showcase their produce, and chefs dazzle
with culinary skills using clean, fresh ingredients. It's not just a
meal—it's an immersive celebration of passion and creativity.
						</p>

						<p className='mb-3'>
						Bring your venue to life, share your talents, and cultivate an
enjoyable atmosphere. Join us at Gamba, where every day is
an opportunity to create lasting memories and showcase
your products in style!"
						</p>

						
<div className='d-flex justify-content-center mb-3'>
						 <img src="../images/about/img3.jpg" alt="" className='img-fluid w-50 rounded-6 ' />
						 </div>

						<h4 className='mb-3 mt-5'>Empower your wellbeing</h4>

						<p  className='mb-3'>
						Experience a holistic transformation as you take control of your
health journey. By consuming clean and nutrient-rich food,
you're not just benefiting yourself, but also champions a larger
movement for healthier, sustainable living. Your simple act of
choosing wholesome foods becomes a game-changer for both
you and the planet.
						</p>

						<div className='row d-flex  justify-content-center mt-5'>
						<div className='col-8'>
						
						<h4  className='mb-3 fw-semibold '>Let's go on this journey together, spreading humanitarian
ideas that put people and the environment's health first.</h4>
						
						</div>
						</div>

						</div>
						</div>
						</div>
				</div>

			{/* <Spacer height={2} />
			<Wrapper>
				<div style={{width: '100%', maxWidth: '1000px'}}>
					<Worker workerUrl={`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
						<Viewer fileUrl="/assets/Gamba_About.pdf" />
					</Worker>
				</div>
			</Wrapper>
			<Spacer height={2} /> */}
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

export default AboutUs
