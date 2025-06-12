import React from 'react'
import { Container, Navbar } from 'react-bootstrap'

const Footer = ({ isFooterText }) => {
  const year = new Date();
  return (
    <Navbar className="footer-section">
      <Container className='justify-content-center'>
        {
          isFooterText ?
            <Navbar.Text className='footer-text' style={{fontSize : "0.8rem"}}>
              {/* Copyright &copy;{year.getFullYear()} Powered by  <a href="https://adraproductstudio.com/" className='footer-link-text' target='_blank'>ADRA</a> */}
            </Navbar.Text>
            : null
        }
      </Container>
    </Navbar>
  )
}

export default Footer
