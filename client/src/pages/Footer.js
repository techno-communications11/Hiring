// Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light text-center py-3 position-absolute w-100 bg-dark text-white">
      <Container>
        <Row>
          <Col>
            <p className="mb-0">© {new Date().getFullYear()} TECHNO COMMUNICATION LLC. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
