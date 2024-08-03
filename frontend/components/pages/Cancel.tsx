import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from "../../App"
import { useNavigate } from "react-router-dom"

export interface ConfirmInvoiceBody {
  invoiceNo: number
  paymentMethod: string
  isSuccess: boolean
}

export default function Cancel() {
  const { invoiceNo } = useParams()
  const { isAuthenticated, actor } = useContext(AppContext)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    function confirm() {
      let data: ConfirmInvoiceBody = {
        invoiceNo: parseInt(invoiceNo),
        paymentMethod: window.location.pathname.startsWith("/stripe")
          ? "stripe"
          : "paypal",
        isSuccess: false,
      }
      console.log("data", data)
      actor
        .change_invoice_status(data)
        .then((data) => {
          console.log({ data })

          if (data.status) {
            toast.success(data.message)
            setMessage(data.message)
          } else {
            toast.error(data.message)
          }
        })
        .catch((err) => {
          console.log({ err })
          toast.error(err.message)
        })
    }
    isAuthenticated && actor && confirm()
  }, [isAuthenticated, actor])

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{message}</h1>
    </div>
  )
}
