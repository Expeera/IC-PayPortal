import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from "../../App"
import { useNavigate } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import { Col, Container, Row } from "react-bootstrap"
import "../success.css" // Importing CSS for styling

// Interface defining the structure of the request body to confirm an invoice
export interface ConfirmInvoiceBody {
  invoiceNo: number
  paymentMethod: string
  isSuccess: boolean
}

export default function Success() {
  // Extracting parameters from the URL (sessionId and invoiceNo)
  const { sessionId, invoiceNo } = useParams()

  // Destructuring values from AppContext
  const { isAuthenticated, actor } = useContext(AppContext)

  // State variable to hold the success message
  const [message, setMessage] = useState("")

  // Hook for programmatic navigation
  const navigate = useNavigate()

  useEffect(() => {
    // Function to confirm the invoice status
    function confirm() {
      // Preparing data to be sent in the confirmation request
      let data: ConfirmInvoiceBody = {
        invoiceNo: parseInt(invoiceNo), // Convert invoiceNo from string to number
        paymentMethod: window.location.pathname.startsWith("/stripe")
          ? "stripe"
          : "paypal", // Determine payment method based on URL path
        isSuccess: true,
      }

      console.log("data", data) // Logging data for debugging

      // Sending request to change the invoice status
      actor
        .change_invoice_status(data)
        .then((data) => {
          console.log({ data }) // Logging response data

          if (data.status) {
            toast.success(data.message) // Display success message
            setMessage(data.message) // Update message state with response message
          } else {
            toast.error(data.message) // Display error message
          }
        })
        .catch((err) => {
          console.log({ err }) // Logging error for debugging
          toast.error(err.message) // Display error message
        })
    }

    // Conditionally calling the confirm function if the user is authenticated and actor is available
    isAuthenticated && actor && confirm()
  }, [isAuthenticated, actor]) // Dependency array includes isAuthenticated and actor

  return (
    <>
      {/* Rendering the Header component */}
      <Header />

      <Container className="my-5">
        <Row className="mb-5 pb-5">
          <Col md={12} className="TitleCheckOut mb-5">
            {/* Back button to navigate to the checkout page */}
            <span className="id_BackBtn" id="id_BackBtn">
              <Link className="nav-link" to="/checkout">
                <i className="bi bi-arrow-left"></i>
              </Link>
            </span>
            {/* Page title */}
            <h2>Invoice Completed Successfully</h2>
          </Col>

          <Col md={12}>
            <Row className="justify-content-md-center">
              {/* Displaying success icon and message */}
              <Col md={5} className="iconStatusPaymen Success">
                <i className="bi bi-check-circle-fill"></i>
                <h1>
                  Thank you for your payment! <br />
                  Your invoice has been processed <span>Successfully</span>
                </h1>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Rendering the Footer component */}
      <Footer />
    </>
  )
}
