import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import Header from "../Header"
import Footer from "../Footer"
import "../invoices.css"
import { Col, Container, Row, Table } from "react-bootstrap"
import { toast } from "react-toastify"

export default function MyInvoices() {
  // Accessing context values ( authentication status, actor, and isOwner) from AppContext
  const { isAuthenticated, actor, isOwner } = useContext(AppContext)

  // State to control the visibility of the invoice modal
  const [show, setShow] = useState(false)

  // Function to close the modal
  const handleClose = () => setShow(false)

  // State to store the selected invoice and its ID for modal display
  const [selectedInvoice, setSelectedInvoice] = useState()
  const [selectedInvoiceId, setSelectedInvoiceId] = useState()

  // Hook for navigation
  const navigate = useNavigate()

  // State to store the list of invoices
  const [invoices, setInvoices] = useState([])

  // Effect to check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login") // Redirect to login if not authenticated
    }
  }, [isAuthenticated])

  // Effect to fetch invoices when the component mounts or when authentication status changes
  useEffect(() => {
    async function myInvoice() {
      var isOwnerVal = await isOwner() // Check if the user is the owner
      if (isOwnerVal) {
        navigate("/admin") // Redirect to admin page if the user is the owner
      }

      // Fetching the user's invoices using the actor object
      actor
        .get_my_invoices()
        .then((data) => {
          console.log("invoices", { data })

          if (data.status) {
            if ("success" in data.body) {
              setInvoices(data.body.success) // Set the invoices if fetched successfully
            }
          } else {
            toast.error(data.message) // Show error message if fetching fails
          }
        })
        .catch((err) => {
          console.log("invoices err", { err })
          toast.error(err.message) // Show error message if there's an exception
        })
    }

    // Fetch invoices if the user is authenticated and actor is available
    isAuthenticated && actor && myInvoice()
  }, [isAuthenticated, actor])

  // Function to show the modal with the selected invoice details
  const handleShow = (invoice, id) => {
    let invoiceId = Number(id)
    setSelectedInvoice(invoice)
    setSelectedInvoiceId(invoiceId)
    setShow(true)
  }

  return (
    <>
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
            <h2>Invoices</h2>
          </Col>
          <Col md={12}>
            {/* Table displaying the list of invoices */}
            <Table responsive striped className="customeTable">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Create At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapping through the invoices and displaying each one */}
                {invoices.map((item) => (
                  <tr key={item.id}>
                    <td>{parseInt(item.id)}</td>
                    <td>{parseFloat(item.amount).toFixed(2)}</td>
                    <td>{item.currency}</td>
                    <td>{item.paymentMethod}</td>
                    <td>
                      {/* Displaying the status with conditional styling */}
                      <span
                        className={
                          item.status === "Pending"
                            ? "pending"
                            : item.status === "Completed"
                            ? "completed"
                            : item.status === "Cancelled"
                            ? "cancelled"
                            : item.status === "Cancelled by system"
                            ? "cancelledSystem"
                            : item.status === "Cancelled by admin"
                            ? "cancelledSystem"
                            : ""
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {/* Converting timestamp to readable date */}
                      {new Date(
                        parseInt(item.createdAt) / (1000 * 1000),
                      ).toLocaleString()}
                    </td>
                    <td>
                      {/* Action to view the invoice details */}
                      <span
                        className="view"
                        onClick={() => handleShow(item, item.id)}
                      >
                        <i className="bi bi-eye-fill ml-0"></i>
                      </span>
                      {/* Link to pay the invoice if it's pending */}
                      {item.status == "Pending" && (
                        <span className="view ml-2">
                          <a
                            className="w-100"
                            href={item.paymentLink}
                            target="_blank"
                          >
                            <i className="bi bi-wallet2"></i> pay now
                          </a>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          {/* Modal to display selected invoice details */}
          <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Invoice No: {selectedInvoiceId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-2 justify-content-around titleDiv">
                <p>
                  Total Amount: {parseFloat(selectedInvoice?.amount).toFixed(2)}{" "}
                  {selectedInvoice?.currency}
                </p>
                <p>PaymentMethod: {selectedInvoice?.paymentMethod}</p>
                <p>
                  Status:
                  <span
                    className={
                      selectedInvoice?.status === "Pending"
                        ? "pending"
                        : selectedInvoice?.status === "Completed"
                        ? "completed"
                        : selectedInvoice?.status === "Cancelled"
                        ? "cancelled"
                        : selectedInvoice?.status === "Cancelled by system"
                        ? "cancelledSystem"
                        : ""
                    }
                  >
                    {selectedInvoice?.status}
                  </span>
                </p>
              </div>
              <div className="table-container" style={{ width: "100%" }}>
                <h3>Items</h3>

                {/* Table displaying items in the selected invoice */}
                <Table responsive striped className="customeTable">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice?.items.map((item) => (
                      <tr key={item.id}>
                        <td>{parseInt(item.id)}</td>
                        <td>{item.name}</td>
                        <td>{parseInt(item.quantity)}</td>
                        <td>{parseFloat(item.price).toFixed(2)}</td>
                        <td>
                          {parseFloat(item.price) * parseInt(item.quantity)}{" "}
                          {selectedInvoice?.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
          </Modal>
        </Row>
      </Container>
      <Footer />
    </>
  )
}
