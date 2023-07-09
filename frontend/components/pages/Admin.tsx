import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import "./table.css" // Import the CSS file

export default function Admin() {
  const navigate = useNavigate()
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)

  useEffect(() => {
    const checkIsOwner = async () => {
      const ownerValue = await isOwner()
      console.log(ownerValue)

      if (!ownerValue) {
        navigate("/invoice")
      }
    }

    checkIsOwner()
  }, [isOwner, navigate])

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {

    async function invoices() {

      actor
        .get_all_invoices_to_admin()
        .then(async (data) => {
          console.log("woened ", { data })
          setInvoices(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    isAuthenticated && actor && invoices();

  }, [isAuthenticated, actor])

  const handleClickLogout = () => {
    logout()
    navigate("/auth/login")
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <button
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
      </button>
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
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => (
                <tr key={item.id}>
                  <td>{parseInt(item.id)}</td>
                  <td>{item.amount}</td>
                  <td>{item.amount}</td>
                  <td>{item.currency}</td>
                  <td>{item.paymentMethod}</td>
                  <td>{item.status}</td>
                  <td>{new Date(parseInt(item.createdAt) / (1000 * 1000)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
