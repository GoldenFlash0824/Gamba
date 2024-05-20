import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../styled/colors';
import { Text } from '../../styled/shared';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const InputPhoneNo = ({ label, setFileValue, required, placeholder, disabled, error, errorMsg }:any) => {
    const [phone, setPhone] = useState();
    return (
        <>
            <Label type="medium" color="black" margin="0rem 0rem 0.19rem 0rem">
                {label} {required ? <Mandatory>*</Mandatory> : ''}
            </Label>
            <PhoneInput
                inputClass="phoneInputFields"
                country={'us'}
                enableAreaCodes={true}
                value={phone}
                inputProps={{
                    name: "phone",
                    country: "us",
                    required: true,
                    autoFocus: true
                }}
            // onChange={phone => setPhone({ phone })}
            />
            {required && error && !disabled && <ErrorText fontSize={0.625} type="small" color="danger">Error message</ErrorText>}
        </>
    );
};

const Label = styled(Text)`
    font-weight: 500;
    text-transform: capitalize;
`;

const Mandatory = styled.span`
	color: ${palette.danger};
`;

const ErrorText = styled(Text)`
    text-transform: capitalize;
    font-weight: 400;
`;

export default InputPhoneNo;
