import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import Header from "../Navbar"

export default function MyInvoices() {
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)
  console.log(isAuthenticated)

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = (invoice) => {
    setSelectedInvoice(invoice)
    setShow(true)
  }
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const navigate = useNavigate()
  
  const [invoices, setInvoices] = useState([])
  if (!isAuthenticated) {
    // navigate("/auth/login")
  }

  useEffect(() => {
    async function myInvoice() {
      var isOwnerVal = await isOwner()
      if (isOwnerVal) {
        navigate("/admin")
      }
      
      actor.get_my_invoices()
        .then((data) => {
          console.log("invoices", { data })

          if (data.status) {
            if ("success" in data.body) {
              setInvoices(data.body.success)
            }
            // toast.success(data.message)
          } else {
            toast.error(data.message)
          }
        })
        .catch((err) => {
          console.log("invoices err", { err })
          toast.error(err.message)
        })
    }

    isAuthenticated && actor && myInvoice()
  }, [isAuthenticated, actor])

  return (
    <>
      <Header />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div>
          <h2>My Invoices</h2>
        </div>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Invoice NO</th>
                <th>Amount</th>
                <th>currency</th>
                <th>Payment Method</th>
                <th>status</th>
                <th>Create At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => (
                <tr key={item.id}>
                  <td>{parseInt(item.id)}</td>
                  <td>{item.amount}</td>
                  <td>{item.currency}</td>
                  <td>{item.paymentMethod}</td>
                  <td>{item.status}</td>
                  <td>
                    {new Date(
                      parseInt(item.createdAt) / (1000 * 1000),
                    ).toLocaleString()}
                  </td>
                  <td
                    className="d-flex justify-content-center align-items-center gap-1"
                    style={{ flexDirection: "row" }}
                  >
                    {item.status == "Pending" ? (
                      <a
                        className="btn btn-warning"
                        href={item.paymentLink}
                        target="_blank"
                      >
                        Go To Pay
                      </a>
                    ) : (
                      ""
                    )}
                    <>
                      <Button
                        variant="primary"
                        onClick={() => handleShow(item)}
                      >
                        View
                      </Button>

                      <Modal
                        show={show}
                        onHide={handleClose}
                        style={{ width: "100%" }}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Invoice NO: {selectedInvoice?.id}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="d-flex gap-2 justify-content-around">
                            <p>
                              Total Amount: {selectedInvoice?.amount}{" "}
                              {selectedInvoice?.currency}
                            </p>
                            <p>
                              PaymentMethod: {selectedInvoice?.paymentMethod}
                            </p>
                            <p>Status: {selectedInvoice?.status}</p>
                          </div>
                          <div
                            className="table-container"
                            style={{ width: "100%" }}
                          >
                            <h3>Table Title</h3>
                            <table
                              className="styled-table"
                              style={{ overflowY: "scroll", width: "100%" }}
                            >
                              <thead>
                                <tr>
                                  <th>Product ID</th>
                                  <th>Product Name</th>
                                  <th>Quntity</th>
                                  <th>Price</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  selectedInvoice?.items.map((item) => (
                                    <tr>
                                      <td>{parseInt(item.id)}</td>
                                      <td>{item.name}</td>
                                      <td>{parseInt(item.quantity)}</td>
                                      <td>{parseFloat(item.price)}</td>
                                      <td>{parseFloat(item.price) * parseInt(item.quantity)} {selectedInvoice?.currency}</td>
                                    </tr>
                                  ))
                                }
                                
                                
                              </tbody>
                            </table>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
