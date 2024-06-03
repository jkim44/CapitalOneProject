import React from "react";
import "../styles/Header.css";
import logo from "../images/Capital-One-Logo.png";
import Navigation from "../pages/Navbar";
import Image from "react-bootstrap/Image";
import { Navbar, Col, Container, Row } from "react-bootstrap";

function Header() {
  return (
    <Container className="">
      <Row>
        <Col lg={12}>
          <Image src={logo} height={100} style={{ padding: "1rem 0" }} />
        </Col>
        <Col>
          <Navigation className="header"></Navigation>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
