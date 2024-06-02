import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Flexed, Text } from '../../styled/shared'
import { palette } from '../../styled/colors'

const AutoComplete = ({ label, placeholder, disabled, error, setError, errorMsg, style, bgTransparent, suggestions, tags, setTags }: any) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [focus, setFocus] = useState(false);
    const [inputVal, setInputVal] = useState("")
    // const [filteredSuggestions, setFilteredSuggestions] = useState([])
    // const [showSuggestions, setShowSuggestions] = useState(false)
    const [wrapperWidth, setWrapperWidth] = useState(0)
    const handleChange = (e: any) => {
        const filtered = suggestions.filter((suggestion: any) => suggestion.label.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
        setError('')
        if (e.target.value === '' && tags.length === 0) {
            setError('Chemicals are required')
        }
        setInputVal(e.target.value)
        // setFilteredSuggestions(filtered)
        // setShowSuggestions(true)
    }

    const handleClick = (e: any) => {
        addTag(e.target.innerText)
    }

    const handleKeyDown = (e: any) => {
        if (e.keyCode === 13 && inputVal.trim()) {
            addTag(inputVal);
        } else if (e.keyCode === 8 && inputVal === '') {
            if (tags.length > 0) {
                removeTag(tags.length - 1);
            }
        }
    };

    const addTag = (tag: any) => {
        setTags([...tags, tag]);
        setInputVal('');
        // setFilteredSuggestions([]);
        // setShowSuggestions(false);
    };

    const removeTag = (index: any) => {
        setTags(tags.filter((_: any, i: any) => i !== index));
    }

    // const renderSuggestions = () => {
    //     if (showSuggestions && inputVal) {
    //         if (filteredSuggestions.length) {
    //             return (
    //                 <ListItems style={{ width: wrapperWidth }}>
    //                     {filteredSuggestions.map((suggestion: any, index) => {
    //                         return (
    //                             <ListItem key={suggestion.id} onClick={handleClick}>
    //                                 {suggestion.label}
    //                             </ListItem>
    //                         );
    //                     })}
    //                 </ListItems>
    //             );
    //         } else {
    //             return (
    //                 <div className="no-suggestions">
    //                     <em>No suggestions available</em>
    //                 </div>
    //             );
    //         }
    //     }
    //     return null;
    // };

    useEffect(() => {
        if (wrapperRef.current) {
            setWrapperWidth(wrapperRef.current.offsetWidth)
        }
    }, []);

    // useEffect(() => {
    //     if (tags.length === 0) {
    //         setError('Chemicals are required')
    //     }
    // }, [tags])

    return (
        <>
            {label && (
                <Label type="normal" style={{ fontWeight: style && '500' }} margin="0rem 0rem 0.25rem 0rem">
                    {label}{' '}
                    <Mandatory>*</Mandatory>
                </Label>
            )}
            <InputWrapper focus={focus} error={error} disabled={disabled} bgTransparent={bgTransparent} ref={wrapperRef}>
                {tags.map((tag: any, index: any) => (
                    <Tag key={index}>
                        {tag}
                        <XButton type="button" onClick={() => removeTag(index)}>
                            x
                        </XButton>
                    </Tag>
                ))}
                <TextInput type="text" disabled={disabled} placeholder={placeholder} error={error} onFocus={() => { setFocus(true) }} onBlur={() => { setFocus(false) }} value={inputVal} onChange={handleChange} onKeyDown={handleKeyDown} />
            </InputWrapper>
            {error && !disabled && (
                <Text fontSize={0.625} type="small" color="danger" textTransform="lowercase">
                    {errorMsg}
                </Text>
            )}
            {/* {renderSuggestions()} */}
        </>
    )
}

const Label = styled(Text)`
	font-weight: 700;
	color: ${palette.black};
`

const Mandatory = styled.span`
	color: ${palette.danger};
`

const InputWrapper = styled.div<any>`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-bottom: 5px;
    border: 1px solid ${({ focus, error, disabled, bgTransparent }: any) => (focus ? (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)
        : (disabled ? `${palette.light_gray}` : error ? `${palette.danger}` : bgTransparent ? `${palette.stroke}` : `#e1e5e8`))};
    overflow: hidden;
`

const TextInput = styled.input<any>`
	font-family: 'Lato-Regular', sans-serif;
	line-height: 1.25rem;
	border: none;
    width: 100%;
    outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
    margin-top: 5px;
    padding: 5px 0px 5px 0.7rem;
	color: ${({ disabled }) => (disabled ? `${palette.light_gray}` : `${palette.black}`)};
	background: ${({ disabled, bgTransparent }) => (bgTransparent ? 'transparent' : disabled ? `${palette.white}` : `${palette.white}`)};
	&::placeholder {
		color: ${palette.gray_100};
	}
`
const ListItems = styled.div<any>`
	position: absolute;
	background: ${palette.white};
	z-index: 10;
	border: 1px solid ${palette.stroke};
    border-top-width: 0;
	max-height: 15rem;
	overflow-y: auto;
`

const ListItem = styled.div`
	background-color: ${palette.white};
	cursor: pointer;
	line-height: 2rem;
	padding: 0.5rem 0.8rem;
	border-bottom: 1px solid ${palette.stroke};
	font-family: 'Lato-Regular', sans-serif;
	text-transform: normal;
	color: ${palette.heading_color};
		&:hover {
		background: ${palette.Btn_dark_green};
		color: ${palette.white};
	}
		&: last-child {
		border-bottom: 0;
	}
`

const Tag = styled.div`
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 12px;
    padding: 5px 10px;
    margin: 5px 0px 0px 5px;
    font-size: 13px;
    white-space: nowrap;
`

const XButton = styled.button`
    width: 15px;
    height: 15px;
    background: #bebebe;
    border-radius: 50%;
    border: none;
    color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    cursor: pointer;
    box-shadow: none;
    margin-left: 5px;
    &:hover {
        background: #a9a9a9;
    }
`;

export default AutoComplete;