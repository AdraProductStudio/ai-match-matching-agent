import React, { useContext } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const CustomModal = ({
    modalHeader,
    show,
    handleHideModal,
    modalBody,
    isModalCentered,
    modalBackdropType,
    className,
    modalFooter

}) => {


    return (
        <div>
            <Modal
                show={show}
                onHide={handleHideModal}
                centered={isModalCentered}
                backdrop={modalBackdropType}
                className={className}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalBody}
                </Modal.Body>
                <Modal.Footer className='d-block'>
                    {modalFooter}
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default CustomModal
