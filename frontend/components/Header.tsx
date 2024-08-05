'use client';
import React, { useContext, useState } from 'react';
import './Header.css';
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Header = ({ handlePageView,isAdmin }) => {
  const { logout,isAuthenticated } = useContext(AppContext)

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const navigate = useNavigate()
  const [owner, setOwner] = useState('');

  const handleInputChange = (e) => {
    setOwner(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate an API call to change the owner
      // Replace the below code with your actual API call
      const response = { status: true, message: "Owner changed successfully" };
      
      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleClickLogout = () => {
    logout()
    navigate("/auth/login")
  }
  return (
  <div className="header navbar navbar-dark navbar-expand-lg">
    <div className="container">
      <a className="navbar-brand" href="#home">
        <img src={Logo} className="logo" height={40} alt="Logo" />
      </a>
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
      <div className="collapse navbar-collapse flex-grow-0" id="navbar-nav">
        <div className="navbar-nav ml-auto">
          {isAuthenticated && <>
            {!isAdmin && <>
            <Link
              className="nav-link"
              to="/checkout"
              onClick={() => handlePageView('products', '')}
            >
              Checkout
            </Link>
            <Link
              className="nav-link"
              to="/my-invoices"
              onClick={() => handlePageView('invoice', '')}
            >
              Invoices
            </Link></>}

            {isAdmin && <> <Link className="nav-link" to=""  onClick={handleShow}>
              Setting
            </Link></>}

            <Link className="nav-link" to=""  onClick={handleClickLogout}>
            < i className="bi bi-door-closed-fill"></i>Logout
            </Link></>}
        </div>
      </div>
    </div>

    <Modal show={show}  onHide={handleClose} size="md" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Change Owner
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className='changeOwnerModal'>
          <form onSubmit={handleSubmit} >
        <div className='mb-4'>
          <label htmlFor="owner">Set Owner: </label>
          <input
            type="text"
            id="owner"
            value={owner}
            onChange={handleInputChange}
            className='form-input'
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
);
}
export default Header;
