import Form from 'react-bootstrap/Form';

const CustomInput = ({
    inputLabel,
    type,
    name,
    id,
    labelClassName,
    placeholder,
    value,
    inputAccept,
    inputHidden,
    inputPattern,
    keyDown,
    btnDisable,
    readOnly,
    onChange,
    onBlur,
    className,
    autoFocus,
    required
}) => {
    return (
        <>
            <Form.Label className={`${labelClassName} `}>
                {inputLabel}
            </Form.Label>
            <Form.Control
                required={required}
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
                disabled={btnDisable}
            />
        </>
    )
}

export default CustomInput
