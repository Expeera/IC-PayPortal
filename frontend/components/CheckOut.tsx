"use client"

import React, { useState } from "react"
import { Card, Button, Col, Row, Image } from "react-bootstrap"
import "./CheckOut.css" // Importing the CSS file for styling
import stripe from "../assets/stripe.png" // Importing stripe payment logo
import paypal from "../assets/paypal.png" // Importing PayPal payment logo

/**
 * CheckOut Component
 *
 * This component handles the checkout process, allowing the user to review their cart,
 * select a payment method, select a currency, and proceed to payment.
 *
 * Props:
 * - cart: The current shopping cart details including products and total price.
 * - handlePageView: Function to navigate to different page views.
 * - decreaseQuantityInCart: Function to decrease the quantity of a product in the cart.
 * - addToCart: Function to add a product to the cart.
 * - getQuantityInCart: Function to get the current quantity of a product in the cart.
 * - setFormData: Function to set the form data, including payment method and currency.
 * - handleSubmit: Function to handle the submission of the payment.
 * - setPaymentMethod: Function to set the payment method selected by the user.
 * - setCurrency: Function to set the currency selected by the user.
 * - loading: Boolean indicating if the payment process is loading.
 */
const CheckOut = ({
  cart,
  handlePageView,
  decreaseQuantityInCart,
  addToCart,
  getQuantityInCart,
  setFormData,
  handleSubmit,
  setPaymentMethod,
  setCurrency,
  loading,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD") // State to manage selected currency, default to USD
  const [selectedMethod, setSelectedMethod] = useState("stripe") // State to manage selected payment method, default to Stripe

  // Handle selection of a payment method
  const handleMethodSelect = (method) => {
    setSelectedMethod(method) // Set the selected payment method in state
    setPaymentMethod(method) // Update the payment method in parent state
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentMethod: method,
    }))
  }

  // Handle selection of a currency
  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency) // Set the selected currency in state
    setCurrency(currency) // Update the currency in parent state
    setFormData((prevFormData) => ({
      ...prevFormData,
      currency: currency,
    }))
  }

  return (
    <>
      {/* Row to contain the checkout content */}
      <Row className="mb-5 pb-5">
        {/* Column for the title and back button */}
        <Col md={12} className="TitleCheckOut mb-5">
          <span
            className="id_BackBtn"
            id="id_BackBtn"
            onClick={() => handlePageView("products")}
          >
            <i className="bi bi-arrow-left"></i>{" "}
            {/* Back button to return to product view */}
          </span>
          <h2>CheckOut</h2> {/* Title for the checkout page */}
        </Col>

        {/* Column for displaying the products in the cart */}
        <div className="col-md-5">
          <div className="row">
            {cart?.products?.map(
              (product, index) =>
                getQuantityInCart(product.id) !== 0 && (
                  <div key={product.id} className="col-md-12 cardInCart">
                    {/* Card to display each product */}
                    <div className="card mb-3" style={{ width: "100%" }}>
                      <div className="imgProduct">
                        <img
                          className="card-img-top"
                          src={product.image}
                          alt={product.name}
                        />{" "}
                        {/* Product image */}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">
                          {product.name}{" "}
                          <span className="price-label-product">
                            ${product.price}
                          </span>{" "}
                          {/* Product name and price */}
                        </h5>
                        <p className="card-text">{product.description}</p>{" "}
                        {/* Product description */}
                      </div>
                      <div className="quantityPrice">
                        <div className="actionControlCart">
                          {/* Increase quantity button */}
                          <i
                            className="bi bi-plus-circle-fill"
                            onClick={() => addToCart(product)}
                          ></i>
                          <span>{getQuantityInCart(product.id)}</span>{" "}
                          {/* Current quantity in cart */}
                          {/* Decrease quantity button */}
                          <i
                            className="bi bi-dash-circle-fill"
                            onClick={() => decreaseQuantityInCart(product.id)}
                          ></i>
                        </div>
                        <span className="totalPriceSpan">
                          $ {product.totalPrice}
                        </span>{" "}
                        {/* Total price for the product */}
                      </div>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Column for payment method and currency selection */}
        <Col md={4}>
          <div className="CheckOutBox">
            <Row>
              {/* Section for selecting payment method */}
              <Col md={12} className="SelectPaymentMethodBox">
                <h6>Select Payment Method</h6>
                <div className="SelectPaymentMethod">
                  {/* Stripe payment method selection */}
                  <div
                    className={`Method ${
                      selectedMethod === "stripe" ? "selected" : ""
                    }`}
                    onClick={() => handleMethodSelect("stripe")}
                  >
                    <Image
                      src={stripe}
                      height={33}
                      alt="stripe"
                      className="imgPayment"
                    />
                  </div>
                  {/* PayPal payment method selection */}
                  <div
                    className={`Method ${
                      selectedMethod === "paypal" ? "selected" : ""
                    }`}
                    onClick={() => handleMethodSelect("paypal")}
                  >
                    <Image
                      src={paypal}
                      height={33}
                      alt="paypal"
                      className="imgPayment"
                    />
                  </div>
                </div>
              </Col>

              {/* Section for selecting currency */}
              <Col md={12} className="SelectPaymentMethodBox">
                <h6>Select Currency</h6>
                <div className="SelectPaymentMethod">
                  {/* USD currency selection */}
                  <div
                    className={`Method ${
                      selectedCurrency === "USD" ? "selected" : ""
                    }`}
                    onClick={() => handleCurrencySelect("USD")}
                  >
                    <span>
                      <i className="bi bi-currency-dollar"></i> USD
                    </span>
                  </div>
                  {/* EUR currency selection */}
                  <div
                    className={`Method ${
                      selectedCurrency === "EUR" ? "selected" : ""
                    }`}
                    onClick={() => handleCurrencySelect("EUR")}
                  >
                    <span>
                      <i className="bi bi-currency-euro"></i> EUR
                    </span>
                  </div>
                </div>
              </Col>

              {/* Section for displaying the total price */}
              <Col md={12} className="SelectPaymentMethodBox mb-4">
                <h6>Price </h6>
                <div className="SelectPaymentMethod">
                  <div className="Method price">
                    <span>{cart?.totalPrice}</span> {/* Display total price */}
                  </div>
                </div>
              </Col>

              {/* Button to submit payment */}
              <Col md={12} className="SelectPaymentMethodBox">
                <Button
                  variant="primary"
                  size="lg"
                  className="payNowBtn w-100"
                  disabled={loading} /* Disable button if loading */
                  onClick={handleSubmit} /* Handle payment submission */
                >
                  Pay Now
                  {loading ? (
                    <div className="spinner-grow text-light" role="status">
                      {" "}
                      <span className="sr-only"></span>{" "}
                    </div>
                  ) : (
                    <i className="bi bi-arrow-right"></i>
                  )}{" "}
                  {/* Show loading spinner if payment is processing */}
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default CheckOut
