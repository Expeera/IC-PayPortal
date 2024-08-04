import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light text-dark mt-5 p-4 text-center">
      <Container>
        <Row>
          <Col>&copy; 2024 Expeera. All Rights Reserved.</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
