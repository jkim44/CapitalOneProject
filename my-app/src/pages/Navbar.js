import React from "react";

import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <Navbar bg="light" expand="sm" collapseOnSelect>
      <Container>
        <Nav>
          <Nav.Link
            as={Link}
            to="/"
            style={{ fontWeight: "bold", color: "#004977" }}
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/transaction"
            style={{ paddingRight: 10, fontWeight: "bold", color: "#004977" }}
          >
            Transactions
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navigation;
