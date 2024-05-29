import React, { useState } from 'react'
import { BiDotsHorizontal } from 'react-icons/bi'

function TextWithSeeMore({ text, maxLength, background }) {
	const [isTruncated, setIsTruncated] = useState(true)

	const toggleTruncate = () => {
		setIsTruncated(!isTruncated)
	}

	return (
		<div>
			{isTruncated ? (
				<div title={text}>
					{text.length > maxLength ? text.slice(0, maxLength) : text}
					{text.length > maxLength && (
						<button onClick={toggleTruncate} style={{ border: 'none', marginLeft: '0.2rem', fontSize: '1rem', background: `${background}` }}>
							<BiDotsHorizontal style={{ border: 'none', color: 'gray', fontSize: '1rem', marginTop: '0.24rem' }} />
						</button>
					)}
				</div>
			) : (
				<div title={text}>
					{text}
					<button onClick={toggleTruncate} style={{ border: 'none', marginLeft: '0.2rem', background: `${background}` }}>
						See Less
					</button>
				</div>
			)
			}
		</div >
	)
}

export default TextWithSeeMore
