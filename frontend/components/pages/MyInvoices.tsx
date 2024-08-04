import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import React, { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import Header from "../Header"
import Footer from "../Footer"
import "../invoices.css";
import { Col, Container, Row, Table } from "react-bootstrap"
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
      <Container className="my-5">
      <Row className="mb-5 pb-5">
        <Col md={12} className="TitleCheckOut mb-5"> 
          <span
            className="id_BackBtn"
            id="id_BackBtn" >
              <Link className="nav-link" to="/checkout" ><i className="bi bi-arrow-left"></i></Link>
          </span>
          <h2>Invoices</h2>
        </Col>
        <Col md={12}>
          <Table responsive striped className="customeTable">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Payment Methoda</th>
                <th>Status</th>
                <th>Create At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {invoices.map((item) => (
                <tr key={item.id}>
                  <td>{parseInt(item.id)}</td>
                  <td>{parseFloat(item.amount).toFixed(2)}</td>
                  <td>{item.currency}</td>
                  <td>{item.paymentMethod}</td>
                  <td>
                    <span className={
                    item.status === 'pending' ? 'pending' :
                    item.status === 'completed' ? 'completed' :
                    item.status === 'cancelled' ? 'cancelled' : ''
                  }>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {new Date(
                      parseInt(item.createdAt) / (1000 * 1000),
                    ).toLocaleString()}
                  </td>
                  <td>
                      <span className="view" onClick={() => handleShow(item)}>
                        <i className="bi bi-eye-fill ml-0"></i>
                      </span>
                      {item.status == "Pending" && (
                        <span className="view ml-2">
                        <a className="w-100" href={item.paymentLink} target="_blank" >
                          <i className="bi bi-wallet2"></i>
                        </a>
                      </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Modal show={show}  onHide={handleClose} style={{ width: "100%" }} >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Invoice NO: {selectedInvoice?.id}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="d-flex gap-2 justify-content-around">
                            <p>
                              Total Amount: {parseFloat(selectedInvoice?.amount).toFixed(2)}{" "}
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
                            <h3>Items</h3>
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
      </Row>
      </Container>
      <Footer/>
    </>
  )
}
