// react layout component that uses Outlet to render the page given by the route
import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import { useState } from "react"
import Logo from "../../assets/logo.svg"
import icpLogo from "../../assets/icp-logo.svg"
import Header from "../Header"
import { Button, Col, Container, Row } from "react-bootstrap"
import "../login.css"

export const DefaultLayout = () => {
  const { logout, login, isAuthenticated, isOwner } = useContext(AppContext)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/checkout")
    }
  }, [isAuthenticated])

  // @todo take the popup to a seperate component
  const navigate = useNavigate()
  const [owner, setOwner] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      ;(async () => {
        setOwner(await isOwner())
      })()
    }
  }, [isAuthenticated])

  const handleNavigateToUsers = () => navigate("/users")

  if (owner) {
    // add it in the second position
    menuItem.splice(1, 0, {
      name: "Users Management",
      onClick: handleNavigateToUsers,
    })
  }

  // const navigate = useNavigation()
  const cb = (val) => navigate(val)

  const handleLogin = () => {
    login(cb)
  }
  return (
    <>
      <Header />
      <div className="py-5 loginContainer container-fluid">
        <Row className="mb-5 pb-5">
          <Col md={12}>
            <Row className="justify-content-md-center">
              <Col md={4} className="loginBox">
                <div className="titleimg">
                  <img src={Logo} className="logo" height={40} alt="Logo" />
                </div>
                <h3>Securely connect to dapps on the Internet Computer</h3>
                <Button
                  variant="primary"
                  size="lg"
                  className="payNowBtn w-100"
                  onClick={handleLogin}
                >
                  Connect Using Identity <i className="bi bi-arrow-right"></i>
                </Button>
              </Col>
              <Col md={12} className="text-center">
                &copy; 2024 Expeera. All Rights Reserved.
              </Col>
              <Col className="icpLogoDiv mt-4">
                <img
                  src={icpLogo}
                  className="icpLogo"
                  height={40}
                  alt="icpLogo"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}
