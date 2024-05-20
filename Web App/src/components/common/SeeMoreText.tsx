import React, {useState} from 'react'
import {BiDotsHorizontal} from 'react-icons/bi'

function TextWithSeeMore({text, maxLength}) {
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
						<button onClick={toggleTruncate} style={{border: 'none', background: 'white', marginLeft: '0.2rem', fontSize: '1rem'}}>
							<BiDotsHorizontal style={{border: 'none', color: 'gray', fontSize: '1rem', marginTop: '0.24rem'}} />
						</button>
					)}
				</div>
			) : (
				<div title={text}>
					{text}
					<button onClick={toggleTruncate} style={{border: 'none', background: 'white', marginLeft: '0.2rem'}}>
						See Less
					</button>
				</div>
			)}
		</div>
	)
}

export default TextWithSeeMore
