import React from 'react'
import Form from 'react-bootstrap/Form';


const CustomInput = ({
    componentFrom,
    inputLabel,
    type,
    name,
    id,
    labelClassName,
    inputContainerClassName,
    change,
    gropuClassName,
    placeholder,
    value,
    inputHeading,
    inputError,
    inputSuccess,
    eyeState,
    eyeFunctionClick,
    inputId,
    inputAccept,
    inputHidden,
    inputPattern,
    keyDown,
    disableRequiredStar,
    btnDisable,
    readOnly,
    handleBlur,
    onChange,
    onBlur,
    className,
    autoFocus
}) => {
    return (
        <>
            <Form.Label className={`${labelClassName} `}>
                {inputLabel}
            </Form.Label>
            <Form.Control
                autoFocus={autoFocus}
                className={className}
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                onKeyDown={keyDown}
                onBlur={onBlur}
                accept={inputAccept}
                hidden={inputHidden}
                pattern={inputPattern}
                readOnly={readOnly}
            />
        </>
    )
}

export default CustomInput
