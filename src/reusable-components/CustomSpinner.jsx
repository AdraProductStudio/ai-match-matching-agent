import Spinner from 'react-bootstrap/Spinner';

const CustomSpinner = ({
    componentFrom,
    variant,
    size
}) => {
    return (
        <Spinner animation="border" role="status" variant={variant}  size={size}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}

export default CustomSpinner