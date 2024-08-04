// react layout component that uses Outlet to render the page given by the route
import { GenericErrorBoundary } from "../../Boundries/GenericErrorBoundry"
import React, { useContext, useEffect } from "react"
import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom"
import { AppContext } from "../../App"
import clsx from "clsx"
import { useState } from "react"
import Logo from "../../assets/logo.svg"
import classNames from "classnames"
import User from "../../assets/person.png"
import Logo from "../../assets/logo.svg";

import Header from "../Header"
import Footer from "../Footer"
import { Button, Col, Container, Row } from "react-bootstrap"
import "../login.css";


export const DefaultLayout = () => {
  const { logout, login, isAuthenticated, user, isOwner, balance } =
    useContext(AppContext)
  // @todo take the popup to a seperate component
  const [popupMenuOpen, setPopupMenuOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleClickLogout = () => {
    logout()
    navigate("/auth/login")
  }

  const [owner, setOwner] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      ;(async () => {
        setOwner(await isOwner())
      })()
    }
  }, [isAuthenticated])

  const handleNavigateToProfile = () => navigate("/profile")

  const handleNavigateToRoot = () => navigate("/")

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
         <img src={Logo} className="logo" height={40} alt="Logo" /></div>
           <h3>
           Securely connect to dapps on the Internet Computer
           </h3>
           <Button
                  variant="primary"
                  size="lg"
                  className="payNowBtn w-100"
                  onClick={handleLogin}
                >
                  Connect Using Identity  <i className="bi bi-arrow-right"></i> 
                </Button>
         </Col>
         <Col md={12} className="text-center">
         &copy; 2024 Expeera. All Rights Reserved.</Col>
         </Row>
       </Col>
       
     </Row>
     </div>
   
   </>
    // <article className="grid 2xl:grid-cols-[min(1440px,100vw)] 2xl:justify-center grid-rows-[auto_1fr_auto] min-h-screen ">
    //   <header className="text-sm  h-20 flex justify-end items-center">
    //     {/* a popup menu that is a button which has a username and and arrow down icon that will have login and logout buttons appear in the menu depending on whether the user
    //             is already logged in then logout is in the list and if he is not logged in the menu will not appear */}
    //     <div className="flex justify-between h-[100px] items-center mx-auto w-[82%] 2xl:w-full">
    //       {/* <div
    //         className="h-full flex items-center gap-1 cursor-pointer"
    //         style={{ display: "flex", alignItems: "center" }}
    //         onClick={handleNavigateToRoot}
    //       >
    //         <img alt="logo" src={Logo} className="w-8 h-8" />
    //         <span
    //           className=""
    //           style={{
    //             fontSize: "18px",
    //             fontWeight: "bold",
    //             marginLeft: "10px",
    //           }}
    //         >
    //           Expeera
    //         </span>
    //       </div> */}

    //       <div style={{ height: "600px", display: "grid", placeItems: "center" }} >
    //         <button
    //           onClick={handleLogin}
    //           style={{
    //             background: "#007bff",
    //             border: "none",
    //             color: "#fff",
    //             borderRadius: "8px",
    //             padding: "20px",
    //             fontSize: "18px",
    //             cursor: "pointer",
    //           }}
    //         >
    //           Connect Using Identity
    //         </button>
    //       </div>
    //     </div>
    //   </header>
    //   <GenericErrorBoundary>
    //     <Outlet />
    //   </GenericErrorBoundary>
    //   <Footer />
    // </article>
  )
}
