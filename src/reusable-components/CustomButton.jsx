import React from 'react'

const CustomButton = ({
    className,
    buttonName,
    onClick,
    style,
    disabled
}) => {


    return (
        <button className={className} onClick={onClick} style={style} disabled={disabled}>
            {buttonName}
        </button>
    )
}

export default CustomButton
