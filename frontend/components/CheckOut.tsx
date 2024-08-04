'use client';
import React, { useState } from "react";
import { Card, Button, Col, Row, Image } from "react-bootstrap";
import "./CheckOut.css";
import stripe from "../assets/stripe.png";
import paypal from "../assets/paypal.png";
const CheckOut = ({ cart, handlePageView,decreaseQuantityInCart ,addToCart,getQuantityInCart,setFormData ,handleSubmit,setPaymentMethod,setCurrency,loading}) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const [selectedMethod, setSelectedMethod] = useState("stripe"); // Default to stripe

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentMethod: method,
    }));
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setCurrency(currency);
    setFormData((prevFormData) => ({
      ...prevFormData,
      currency: currency,
    }));
  };

  return (
    <>
      <Row className="mb-5 pb-5">
        <Col md={12} className="TitleCheckOut mb-5">
          <span
            className="id_BackBtn"
            id="id_BackBtn"
            onClick={() => handlePageView("products")}
          >
            <i className="bi bi-arrow-left"></i>
          </span>
          <h2>CheckOut</h2>
        </Col>
        <div className="col-md-5">
          <div className="row">
            {cart?.products?.map((product, index) => (
              getQuantityInCart(product.id) !== 0 && (
                <div key={product.id} className="col-md-12 cardInCart">
                  <div className="card mb-3" style={{ width: "100%" }}>
                    <div className="imgProduct">
                      <img className="card-img-top" src={product.image} alt={product.name} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {product.name} <span className="price-label-product">${product.price}</span>
                      </h5>
                      <p className="card-text">{product.description}</p>
                    </div>
                    <div className="quantityPrice">
                      <div className="actionControlCart">
                        <i className="bi bi-plus-circle-fill" onClick={() => addToCart(product)}></i>
                        <span>{getQuantityInCart(product.id)}</span>
                        <i className="bi bi-dash-circle-fill" onClick={() => decreaseQuantityInCart(product.id)}></i>
                      </div>
                      <span className="totalPriceSpan">$ {product.totalPrice}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        <Col md={4}>
          <div className="CheckOutBox">
            <Row>
              <Col md={12} className="SelectPaymentMethodBox">
                <h6>Select Payment Method</h6>
                <div className="SelectPaymentMethod">
                  <div
                    className={`Method ${selectedMethod === 'stripe' ? 'selected' : ''}`}
                    onClick={() => handleMethodSelect('stripe')}
                  >
                    <Image src={stripe} height={33} alt="stripe" className="imgPayment" />
                  </div>
                  <div
                    className={`Method ${selectedMethod === 'paypal' ? 'selected' : ''}`}
                    onClick={() => handleMethodSelect('paypal')}
                  >
                    <Image src={paypal} height={33} alt="paypal" className="imgPayment" />
                  </div>
                </div>
              </Col>
              <Col md={12} className="SelectPaymentMethodBox">
                <h6>Select Currency</h6>
                <div className="SelectPaymentMethod">
                  <div
                    className={`Method ${selectedCurrency === 'USD' ? 'selected' : ''}`}
                    onClick={() => handleCurrencySelect('USD')}
                  >
                    <span>
                      <i className="bi bi-currency-dollar"></i> USD
                    </span>
                  </div>
                  <div
                    className={`Method ${selectedCurrency === 'EUR' ? 'selected' : ''}`}
                    onClick={() => handleCurrencySelect('EUR')}
                  >
                    <span>
                      <i className="bi bi-currency-euro"></i> EUR
                    </span>
                  </div>
                </div>
              </Col>
              <Col md={12} className="SelectPaymentMethodBox mb-4">
                <h6>Price </h6>
                <div className="SelectPaymentMethod">
                  <div className="Method price">
                    <span>{cart?.totalPrice}</span>
                  </div>
                </div>
              </Col>
              <Col md={12} className="SelectPaymentMethodBox">
                <Button
                  variant="primary"
                  size="lg"
                  className="payNowBtn w-100"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  Pay Now  {loading ?  <div className="spinner-grow text-light" role="status"> <span className="sr-only"></span> </div>:<i className="bi bi-arrow-right"></i> }
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CheckOut;
