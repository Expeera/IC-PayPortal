"use client"
import React, { useContext, useState } from "react"
import "./Header.css"
import Logo from "../assets/logo.svg"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import { Button, Modal } from "react-bootstrap"
import { toast } from "react-toastify"

/**
 * Header Component
 *
 * This component renders the header of the webpage, which includes the logo,
 * navigation links, and user actions like logout and admin settings.
 *
 * @param {Function} handlePageView - Function to handle page navigation
 * @param {Boolean} isAdmin - Flag indicating if the user is an admin
 */
const Header = ({ handlePageView, isAdmin }) => {
  const { logout, isAuthenticated } = useContext(AppContext) // Accessing logout and authentication status from AppContext

  const [show, setShow] = useState(false) // State to control the visibility of the modal

  const handleClose = () => setShow(false) // Function to close the modal
  const handleShow = () => setShow(true) // Function to show the modal
  const navigate = useNavigate() // Hook for navigation
  const [owner, setOwner] = useState("") // State to manage the owner input value

  // Function to handle input changes in the modal form
  const handleInputChange = (e) => {
    setOwner(e.target.value)
  }

  // Function to handle form submission in the modal
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Simulate an API call to change the owner
      const response = { status: true, message: "Owner changed successfully" }

      if (response.status) {
        toast.success(response.message) // Display success message
      } else {
        toast.error(response.message) // Display error message if unsuccessful
      }
    } catch (error) {
      toast.error("An error occurred") // Display error message on failure
    }
  }

  // Function to handle logout action
  const handleClickLogout = () => {
    logout() // Call logout function from context
    navigate("/auth/login") // Redirect to the login page
  }

  return (
    <div className="header navbar navbar-dark navbar-expand-lg">
      <div className="container">
        {/* Logo in the header */}
        <a className="navbar-brand" href="#home">
          <img src={Logo} className="logo" height={40} alt="Logo" />
        </a>

        {/* Toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-nav"
          aria-controls="navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse flex-grow-0" id="navbar-nav">
          <div className="navbar-nav ml-auto">
            {isAuthenticated && (
              <>
                {!isAdmin && (
                  <>
                    {/* Link to the checkout page */}
                    <Link
                      className="nav-link"
                      to="/checkout"
                      onClick={() => handlePageView("products", "")}
                    >
                      Checkout
                    </Link>
                    {/* Link to the invoices page */}
                    <Link
                      className="nav-link"
                      to="/my-invoices"
                      onClick={() => handlePageView("invoice", "")}
                    >
                      Invoices
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    {/* Link to open the settings modal */}
                    <Link className="nav-link" to="" onClick={handleShow}>
                      Setting
                    </Link>
                  </>
                )}

                {/* Link to log out */}
                <Link className="nav-link" to="" onClick={handleClickLogout}>
                  <i className="bi bi-door-closed-fill"></i>Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for changing the owner */}
      <Modal show={show} onHide={handleClose} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body className="changeOwnerModal">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="owner">Set Owner: </label>
              <input
                type="text"
                id="owner"
                value={owner}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              className="payNowBtn w-100"
              type="submit"
            >
              Change <i className="bi bi-arrow-right"></i>
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Header
