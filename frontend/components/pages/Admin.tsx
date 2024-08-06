import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import { toast } from "react-toastify"
import "../invoices.css"
import Header from "../Header"
import { Button, Col, Container, Row, Table } from "react-bootstrap"
import Footer from "../Footer"

// Interface defining the structure of the request body for confirming invoice status
export interface ConfirmInvoiceAdminBody {
  invoiceNo: number
  paymentMethod: string
  isCompleted: boolean
}

export default function Admin() {
  // State to store the list of invoices fetched from the server
  const [invoices, setInvoices] = useState([])

  // Hook to navigate programmatically
  const navigate = useNavigate()

  // Destructuring values from the AppContext (logout, authentication status, actor, isOwner)
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)

  // Effect to check if the current user is the owner/admin
  useEffect(() => {
    const checkIsOwner = async () => {
      const ownerValue = await isOwner() // Check if the user is the owner
      if (!ownerValue) {
        navigate("/checkout") // Redirect to checkout if not the owner
      }
    }
    checkIsOwner()
  }, [isOwner, navigate])

  // Function to fetch all invoices for the admin
  async function invoicesFun() {
    actor
      .get_all_invoices_to_admin()
      .then((data) => {
        if (data.status) {
          if ("success" in data.body) {
            setInvoices(data.body.success) // Set the fetched invoices
          }
        } else {
          toast.error(data.message) // Show error if fetching fails
        }
      })
      .catch((err) => {
        toast.error(err.message) // Show error message on exception
      })
  }

  // Effect to fetch invoices if the user is authenticated and actor is available
  useEffect(() => {
    isAuthenticated && actor && invoicesFun()
  }, [isAuthenticated, actor])

  // Function to handle the status change of an invoice
  const handleStatusChange = async (index, item, status) => {
    // Confirmation dialog to confirm the status change
    const confirmed = window.confirm(
      `Do you want to change the status of Invoice ID ${item.id} to: ${status}?`,
    )

    if (confirmed) {
      // Preparing the data to send in the status change request
      let data = {
        invoiceNo: parseInt(item.id),
        paymentMethod: item.paymentMethod,
        isCompleted: status === "Completed",
      }

      try {
        // Sending the request to change the invoice status
        const response = await actor.change_invoice_status_to_admin(data)
        if (response.status) {
          toast.success(response.message) // Show success message if status is updated

          // Updating the UI with the new status
          document.getElementById("status-buttons" + index).innerHTML =
            status === "Completed" ? "Completed" : "Cancelled by admin"
        } else {
          toast.error(response.message) // Show error message if status update fails
        }
      } catch (err) {
        console.log({ err })
        toast.error(err.message) // Show error message on exception
      }
    }
  }

  return (
    <>
      {/* Rendering the header component, passing isAdmin prop as true */}
      <Header isAdmin={true} />
      <Container className="my-5">
        <Row className="mb-5 pb-5">
          <Col md={12} className="TitleCheckOut mb-5">
            <h2 className="ml-0">All Invoices</h2>
          </Col>

          <Col md={12}>
            {/* Table displaying all invoices */}
            <Table responsive striped className="customeTable">
              <thead>
                <tr>
                  <th>Invoice NO</th>
                  <th>Owner</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Create At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapping through the invoices to display each one */}
                {invoices.map((item, index) => (
                  <tr key={item.id}>
                    <td>{parseInt(item.id)}</td>
                    <td>{item.owner.toString()}</td>
                    <td>{parseFloat(item.amount).toFixed(2)}</td>
                    <td>{item.currency}</td>
                    <td>{item.paymentMethod}</td>
                    <td id={"td-status" + index}>
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
                            ? "cancelledSystemA"
                            : item.status === "Cancelled by admin"
                            ? "cancelledSystemA"
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
                      {/* Rendering action buttons if the invoice status is pending */}
                      {item.status === "Pending" ? (
                        <div
                          id={"status-buttons" + index}
                          className="ButtonsAction"
                        >
                          <Button
                            variant="success"
                            className="status-button"
                            onClick={() =>
                              handleStatusChange(index, item, "Completed")
                            }
                          >
                            Completed
                          </Button>
                          <Button
                            variant="danger"
                            className="status-button"
                            onClick={() =>
                              handleStatusChange(index, item, "Canceled")
                            }
                          >
                            Canceled
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      {/* Rendering the footer component */}
      <Footer />
    </>
  )
}
