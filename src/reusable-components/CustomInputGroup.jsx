import React from 'react'
import { InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { IoEyeOff, IoEye } from "react-icons/io5";


const CustomInputGroup = ({
    componentFrom,
    inputLabel,
    inputType,
    labelClassName,
    inputContainerClassName,
    inputControlId,
    className,
    change,
    placeholder,
    name,
    value,
    id,
    inputName,
    inputAccept,
    inputHidden,
    inputPattern,
    keyDown,
    disableRequiredStar,
    btnDisable,
    readOnly,
    handleBlur,
    onClick,
    eyeOpen,
    showPassword,
    type,
    onBlur,
    onChange,
    onKeyDown

}) => {

    return (
        <>
            <Form.Label className={`${labelClassName} `}>
                {inputLabel}
            </Form.Label>
            <InputGroup className={className}>
                <Form.Control
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    id={id}
                    accept={inputAccept}
                    hidden={inputHidden}
                    pattern={inputPattern}
                    readOnly={readOnly}
                    onBlur={onBlur}
                />
                <InputGroup.Text id="basic-addon1" className='cup eye-icon' onClick={onClick}>
                    {showPassword === true ?
                        <IoEye onClick={onClick} /> :
                        <IoEyeOff onClick={onClick} />}
                </InputGroup.Text>
            </InputGroup>
        </>

    )
}

export default CustomInputGroup
