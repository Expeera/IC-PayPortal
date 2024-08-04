'use client';
import React from 'react';
import './Header.css';
import Logo from "../assets/logo.svg";
import { Link } from 'react-router-dom';

const Header = ({ handlePageView }) => (
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
            </Link>
            <Link className="nav-link" to="#logout">
              <i className="bi bi-door-closed-fill"></i> Logout
            </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
