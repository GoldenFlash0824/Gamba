import { MoreHorizSharp } from '@material-ui/icons'
import React, { useState } from 'react'

function TextWithSeeMore({ text, maxLength }) {
    const [isTruncated, setIsTruncated] = useState(true)

    const toggleTruncate = () => {
        setIsTruncated(!isTruncated)
    }

    return (
        <div>
            {isTruncated ? (
                <div>
                    {text.length > maxLength ? text.slice(0, maxLength) : text}
                    {text.length > maxLength && (
                        <button onClick={toggleTruncate} style={{ border: 'none', background: 'white', marginLeft: '0.1rem', fontSize: '1rem' }}>
                            <MoreHorizSharp style={{ border: 'none', color: 'gray', fontSize: '1rem', marginTop: '0.24rem' }} />
                        </button>
                    )}
                </div>
            ) : (
                <div>
                    {text}
                    <button onClick={toggleTruncate} style={{ border: 'none', background: 'white', marginLeft: '0.1rem' }}>
                        See Less
                    </button>
                </div>
            )}
        </div>
    )
}

export default TextWithSeeMore
