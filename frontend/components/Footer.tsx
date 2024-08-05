import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import icpLogo from "../assets/icp-logo.svg";
const Footer = () => {
  return (
    <>
    <Container>
        <Row>
          <Col className="icpLogoDiv">
    <img src={icpLogo} className="icpLogo" height={40} alt="icpLogo" />
    </Col>
    </Row>
      </Container>
    <footer className="bg-light text-dark mt-3 p-4 text-center">
      <Container>
        <Row>
          <Col>&copy; 2024 Expeera. All Rights Reserved. </Col>
        </Row>
      </Container>
    </footer>
    </>
  );
};

export default Footer;
