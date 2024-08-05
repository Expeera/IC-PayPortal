import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import { toast } from "react-toastify"
import "../invoices.css";
import Header from "../Header"
import { Button, Col, Container, Row, Table } from "react-bootstrap"
import Footer from "../Footer";
export interface ConfirmInvoiceAdminBody {
  invoiceNo: number;
  paymentMethod: string;
  isCompleted: boolean;
}


export default function Admin() {
  const [invoices, setInvoices] = useState([])
  const navigate = useNavigate()
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)

  useEffect(() => {
    const checkIsOwner = async () => {
      const ownerValue = await isOwner()
      if (!ownerValue) {
        navigate("/checkout")
      }
    }
    checkIsOwner()
  }, [isOwner, navigate])

  async function invoicesFun() {

    actor.get_all_invoices_to_admin()
      .then((data) => {
        if (data.status) {
          if ("success" in data.body) {
            setInvoices(data.body.success)
          }
        } else {
          toast.error(data.message)
        }
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  useEffect(() => {
    isAuthenticated && actor && invoicesFun()
  }, [isAuthenticated, actor])
  const handleStatusChange = async (index, item, status) => {
    const confirmed = window.confirm(
      `Do you want to change the status of Invoice ID ${item.id} to: ${status}?`,
    );
  
    if (confirmed) {
      let data = {
        invoiceNo: parseInt(item.id),
        paymentMethod: item.paymentMethod,
        isCompleted: status === "Completed",
      };
  
      try {
        const response = await actor.change_invoice_status_to_admin(data);
        if (response.status) {
          toast.success(response.message);
          document.getElementById('status-buttons' + index).innerHTML = status === "Completed" ? "Completed" : "Cancelled by admin";
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        console.log({ err });
        toast.error(err.message);
      }
    }
  };
  
  // const handleStatusChange = async (index, item, e) => {
  //   const confirmed = window.confirm(
  //     `Do you want to change the status of Invoice ID ${item.id} to: ${e.target.value}?`,
  //   )

  //   if (confirmed) {
  //     let data: ConfirmInvoiceAdminBody = {
  //       invoiceNo: parseInt(item.id),
  //       paymentMethod: item.paymentMethod,
  //       isCompleted: e.target.value === "Completed",
  //     }
  //     actor.change_invoice_status_to_admin(data)
  //       .then((data) => {
  //         if (data.status) {
  //           toast.success(data.message)
  //           e.target.remove();
  //           document.getElementById('td-status' + index).innerHTML = e.target.value === "Completed" ? "Completed" : "Cancelled by admin	";
  //         } else {
  //           toast.error(data.message)
  //         }
  //       })
  //       .catch((err) => {
  //         console.log({ err })
  //         toast.error(err.message)
  //       })

  //   } else {
  //     document.getElementById("select" + index).selectedIndex = 0;
  //   }
  // }

  return (
     <>
        <Header isAdmin={true}/>
        <Container className="my-5">
      <Row className="mb-5 pb-5">
        <Col md={12} className="TitleCheckOut mb-5"> 
          <h2 className="ml-0">All Invoices</h2>
        </Col>
        
        <Col md={12}>
          <Table responsive striped className="customeTable">
            <thead>
              <tr>
                <th>Invoice NO</th>
                <th>Owner</th>
                <th>Amount</th>
                <th>currency</th>
                <th>Payment Method</th>
                <th>status</th>
                <th>Create At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item, index) => (
                <tr  key={item.id}>
                  <td>{parseInt(item.id)}</td>
                  <td>{item.owner.toString()}</td>
                  <td>{parseFloat(item.amount).toFixed(2)}</td>
                  <td>{item.currency}</td>
                  <td>{item.paymentMethod}</td>
                  <td id={'td-status' + index}>
                    <span className={
                    item.status === 'Pending' ? 'pending' :
                    item.status === 'Completed' ? 'completed' :
                    item.status === 'Cancelled' ? 'cancelled' : 
                    item.status === 'Cancelled by system' ? 'cancelledSystemA' :''
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
                      {item.status === "Pending" ? (
                        <div id={'status-buttons' + index} className="ButtonsAction">
                          <Button variant="success"
                            className="status-button"
                            onClick={() => handleStatusChange(index, item, "Completed")}
                          >
                            Completed
                          </Button>
                           <Button variant="danger"
                            className="status-button"
                            onClick={() => handleStatusChange(index, item, "Canceled")}
                          >
                            Canceled
                          </Button>
                        </div>
                      ) : (
                        ''
                      )}
                    </td>

                  {/* <td>
                    {item.status == "Pending" ?
                        <select
                          id = {'select' + index}
                          className="table-select"
                          onChange={(e) =>
                            handleStatusChange(index ,item, e)
                          }
                        >
                          <option>Change Status</option>
                          <option value="Completed">Completed</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      : ''
                    }
                  </td> */}

                </tr>
              ))}
            </tbody>
            </Table>
            </Col>
            </Row></Container>
            <Footer/>
    </>
  )
}
