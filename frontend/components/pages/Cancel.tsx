import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from "../../App"
import { useNavigate } from "react-router-dom"
import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import Footer from "../Footer"
import "../success.css"

// Interface defining the structure of the request body for confirming the invoice status
export interface ConfirmInvoiceBody {
  invoiceNo: number
  paymentMethod: string
  isSuccess: boolean
}

export default function Cancel() {
  // Extracting the invoice number from the URL parameters
  const { invoiceNo } = useParams()

  // Destructuring the authentication status and actor from the AppContext
  const { isAuthenticated, actor } = useContext(AppContext)

  // State to store the success or error message
  const [message, setMessage] = useState("")

  // Hook to navigate programmatically
  const navigate = useNavigate()

  // Effect to confirm the cancellation of the invoice
  useEffect(() => {
    function confirm() {
      // Preparing the data object to be sent in the status change request
      let data: ConfirmInvoiceBody = {
        invoiceNo: parseInt(invoiceNo),
        paymentMethod: window.location.pathname.startsWith("/stripe")
          ? "stripe"
          : "paypal",
        isSuccess: false, // Setting success to false since this is a cancellation
      }

      console.log("data", data)

      // Sending the request to change the invoice status
      actor
        .change_invoice_status(data)
        .then((data) => {
          console.log({ data })

          if (data.status) {
            toast.success(data.message) // Show success message if the status change is successful
            setMessage(data.message) // Update the message state with the success message
          } else {
            toast.error(data.message) // Show error message if the status change fails
          }
        })
        .catch((err) => {
          console.log({ err })
          toast.error(err.message) // Show error message on exception
        })
    }

    // Call the confirm function only if the user is authenticated and actor is available
    isAuthenticated && actor && confirm()
  }, [isAuthenticated, actor])

  return (
    <>
      {/* Rendering the header component */}
      <Header />

      <Container className="my-5">
        <Row className="mb-5 pb-5">
          <Col md={12} className="TitleCheckOut mb-5">
            {/* Back button linking to the checkout page */}
            <span className="id_BackBtn" id="id_BackBtn">
              <Link className="nav-link" to="/checkout">
                <i className="bi bi-arrow-left"></i>
              </Link>
            </span>
            <h2>Invoice Cancelled Successfully</h2>
          </Col>

          <Col md={12}>
            <Row className="justify-content-md-center">
              <Col md={5} className="iconStatusPaymen Cancelled">
                {/* Displaying a cancellation icon and success message */}
                <i className="bi bi-x-circle-fill"></i>
                <h1>
                  Thank you <br />
                  Your invoice has been <span>Cancelled</span> successfully.
                </h1>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Rendering the footer component */}
      <Footer />
    </>
  )
}
