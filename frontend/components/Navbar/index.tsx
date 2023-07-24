import React, { useContext } from "react"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { AppContext } from "../../App"
import { useNavigate } from "react-router-dom"

export default function Header({ isAdmin=false }) {
  const { logout } = useContext(AppContext)
  const navigate = useNavigate()

  const handleClickLogout = () => {
    logout()
    navigate("/auth/login")
  }
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="">Fiat</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            
            
            {isAdmin ? 
              <Nav className="me-auto">
              </Nav> : 
              <Nav className="me-auto">
                <Nav.Link href="/checkout">Checkout</Nav.Link>
                <Nav.Link href="/my-invoices">My Invoices</Nav.Link>
              </Nav>
            }
            <button
              onClick={handleClickLogout}
              style={{
                padding: "10px 12px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              Logout
            </button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}
