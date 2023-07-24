import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import "./table.css" // Import the CSS file
import { toast } from "react-toastify"

import Header from "../Navbar"

export interface ConfirmInvoiceAdminBody {
  invoiceNo: number;
  paymentMethod: string;
  isCompleted: boolean;
}


export default function Admin() {
  const navigate = useNavigate()
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)

  useEffect(() => {
    const checkIsOwner = async () => {
      const ownerValue = await isOwner()
      console.log(ownerValue)

      if (!ownerValue) {
        navigate("/checkout")
      }
    }

    checkIsOwner()
  }, [isOwner, navigate])


  const [invoices, setInvoices] = useState([])

  async function invoicesFun() {

    actor.get_all_invoices_to_admin()
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

  useEffect(() => {
    

    isAuthenticated && actor && invoicesFun()
  }, [isAuthenticated, actor])

  // const handleClickLogout = () => {
  //   logout()
  //   navigate("/auth/login")
  // }

  const handleStatusChange = async (index, item, e) => {
    const confirmed = window.confirm(
      `Do you want to change the status of Invoice ID ${item.id} to: ${e.target.value}?`,
    )

    if (confirmed) {
      console.log(`Invoice ID ${item.id} status changed to: ${e.target.value}`)

      let data: ConfirmInvoiceAdminBody = {
        invoiceNo: parseInt(item.id),
        paymentMethod: item.paymentMethod,
        isCompleted: e.target.value === "Completed",
      }

      console.log("data", data);
      actor.change_invoice_status_to_admin(data)
        .then((data) => {
          console.log({ data })

          if (data.status) {
            toast.success(data.message)
            e.target.remove();
            document.getElementById('td-status' + index).innerHTML = e.target.value === "Completed" ? "Completed" : "Cancelled by admin	";
          } else {
            toast.error(data.message)
          }

        })
        .catch((err) => {
          console.log({ err })
          toast.error(err.message)
        })

      // if (selectedValue === "Pending") {
      //   toast.error(`Invoice ID ${id} status changed to: ${selectedValue}`)
      // } else if (selectedValue === "Completed") {
      //   toast.success(`Invoice ID ${id} status changed to: ${selectedValue}`)
      // }


    } else {
      document.getElementById("select" + index).selectedIndex = 0;
    }
  }

  return (
     <>
      <Header isAdmin={true}/>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <button
        onClick={handleClickLogout}
        style={{
          padding: "15px 20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px",
          fontSize: "18px",
        }}
      >
        Logout
      </button> */}
      <h1>All Invoices</h1>
      <div>
        <div className="table-container">
          <table className="styled-table">
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
                  <td id={'td-status' + index}>{item.status}</td>
                  <td>
                    {new Date(
                      parseInt(item.createdAt) / (1000 * 1000),
                    ).toLocaleString()}
                  </td>
                  <td>
                    {
                      item.status == "Pending" ?
                   
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
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  )
}
