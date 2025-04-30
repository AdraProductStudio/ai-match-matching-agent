import React from 'react'

const CustomButton = ({
    className,
    buttonName,
    onClick
}) => {


    return (
        <button className={className} onClick={onClick}>
            {buttonName}
        </button>
    )
}

export default CustomButton
