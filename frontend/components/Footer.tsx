import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import icpLogo from "../assets/icp-logo.svg" // Importing the ICP logo image

/**
 * Footer Component
 *
 * This component renders the footer of the webpage. It includes a logo and
 * a copyright notice.
 */
const Footer = () => {
  return (
    <>
      <Container>
        <Row>
          <Col className="icpLogoDiv">
            {/* Displaying the ICP logo */}
            <img src={icpLogo} className="icpLogo" height={40} alt="icpLogo" />
          </Col>
        </Row>
      </Container>

      {/* Footer section with background, text, and padding styling */}
      <footer className="bg-light text-dark mt-3 p-4 text-center">
        <Container>
          <Row>
            {/* Copyright notice */}
            <Col>&copy; 2024 Expeera. All Rights Reserved.</Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer
