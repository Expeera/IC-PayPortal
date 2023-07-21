import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import { toast } from "react-toastify"
import "./table.css" // Import the CSS file
import { Invoice } from "../../Hooks/UseAuthClient"

export interface CreateInvoiceBody {
  amount: number
  paymentMethod: string
  currency: string
}


export default function Form() {
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)
  const [formData, setFormData] = useState({
    paymentMethod: "",
    amount: '',
    currency: "",
  })
  const navigate = useNavigate()
  const sessionId = 1000

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let data: CreateInvoiceBody = {
      amount: parseFloat(formData.amount.toString()),
      paymentMethod: formData.paymentMethod,
      currency: formData.currency,
    }

    actor.create_invoice(data)
      .then((data) => {
        console.log({ data })

        if (data.status) {
          if ("success" in data.body) {
            window.open(data.body.success.payment.redirectUrl, '_blank');
          }
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      })
      .catch((err) => {
        console.log({ err })
        toast.error(err.message)
      })

   
  }

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {

    async function myInvoice() {

      var isOwnerVal = await isOwner();
      if (isOwnerVal) {
        navigate("/admin");
      }

      actor
        .get_my_invoices()
        .then(async (data) => {
          console.log("woened ", { data })
          setInvoices(data)
        })
        .catch((err) => {
          console.log(err)
        })
      

    }


    isAuthenticated && actor && myInvoice();

  }, [isAuthenticated, actor])

  const handleClickLogout = () => {
    logout()
    navigate("/auth/login")
  }

  if (!isAuthenticated) {
    navigate("/auth/login")
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // height: "700px",
        justifyContent: "center",
      }}
    > 
      <h2>Create New Invoice</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          padding: "10px",
        }}
      >
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          style={{
            marginBottom: "10px",
            padding: "5px 10px",
            width: "100%",
            height: "50px",
            borderRadius: "8px",
          }}
        >
          <option value="default">Select payment method</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
        </select>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          style={{
            marginBottom: "10px",
            padding: "5px 2px",
            width: "100%",
            height: "50px",
            borderRadius: "8px",
            border: "1px solid #888",
          }}
        />
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          style={{
            marginBottom: "10px",
            padding: "5px 10px",
            width: "100%",
            height: "50px",
            borderRadius: "8px",
          }}
        >
          <option value="default">Select currency</option>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>
        <button
          type="submit"
          style={{
            padding: "15px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            background: "#007bff",
            borderRadius: "8px",
            fontSize: "18px",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
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

      <h2>My Invoices</h2>

      <div>
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
                  <td>{new Date(parseInt(item.createdAt) / (1000 * 1000)).toLocaleString()}</td>
                  <td>{item.status == 'Pending' ? <a href={item.paymentLink} target="_blank">Go To Pay</a> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
