import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from "../../App"
import { useNavigate } from "react-router-dom"
import Header from "../Header"
import Footer from "../Footer"
import { Col, Container, Row } from "react-bootstrap"
import "../success.css";
export interface ConfirmInvoiceBody {
  invoiceNo: number;
  paymentMethod: string;
  isSuccess: boolean;
}


export default function Success() {
  const { sessionId, invoiceNo } = useParams()
  const { isAuthenticated, actor } = useContext(AppContext)

  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    
    function confirm() {
      
      let data: ConfirmInvoiceBody = {
        invoiceNo: parseInt(invoiceNo),
        paymentMethod: window.location.pathname.startsWith("/stripe") ? "stripe" : "paypal",
        isSuccess: true,
      }
      console.log("data", data);
      actor.change_invoice_status(data)
        .then((data) => {
          console.log({ data })

          if (data.status) {
            toast.success(data.message)
            setMessage(data.message);
          } else {
            toast.error(data.message)
          }

        })
        .catch((err) => {
          console.log({ err })
          toast.error(err.message)
          // toast.error("Payload Too Large")
          // toast.error("Not Authorized to mint")
        })
    }

    // if (!isAuthenticated) {
    //   navigate("/auth/login")
    // }

    console.log("isAuthenticated", isAuthenticated)
    console.log("actor", actor)
    isAuthenticated && actor && confirm();

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
          <h2>Invoice Completed Successfully</h2>
        </Col>
        <Col md={12}>
          <Row className="justify-content-md-center">
          <Col md={5} className="iconStatusPaymen Success">
            <i className="bi bi-check-circle-fill"></i>
            <h1>
            Thank you for your payment! <br/>Your invoice has been processed <span>Successfully </span> 
            </h1>
          </Col>
          </Row>
        </Col>
        
      </Row>
      </Container>
     <Footer/>
    </>
  )
}
