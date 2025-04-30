import React from 'react'
import Header from '../components/Header'
import { Container, Image } from 'react-bootstrap'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import CustomButton from '../../reusable-components/CustomButton'

const PageNotFound = () => {
    const navigate = useNavigate()
    return (
        <section className='layout'>
            <Header />
            <Container className='main-section d-flex flex-column justify-content-center align-items-center' fluid >
                <div>
                    <Image src='https://d1olhs2thomfrd.cloudfront.net/pageNotFound.png' width={180} className='' alt="pageNotFound" />
                </div>
                <h1 className='h1' style={{ color: '#667da7' }}>Page Not Found</h1>
                <p className='mb-0 text-center'>Oops! The page you are looking for does not exist</p>
                <div className="btn-wrapper go-top">
                    <CustomButton
                        buttonName="Back to Home"
                        className='px-3 mt-3 btn logout-button'
                        onClick={() => navigate("/")}
                    />
                </div>
            </Container >
            <Footer isFooterText={true} />
        </section>
    )
}

export default PageNotFound
