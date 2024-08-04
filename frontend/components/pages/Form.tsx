import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import { toast } from "react-toastify"
import "./table.css" // Import the CSS file
import { Invoice } from "../../Hooks/UseAuthClient"

import product1 from "../../assets/art1.jpg"
import product2 from "../../assets/art2.jpg"
import product3 from "../../assets/art3.jpg"
import product4 from "../../assets/art4.jpg"
import product5 from "../../assets/art5.jpg"
import product6 from "../../assets/art6.jpg"

import { Row, Col, Container } from "react-bootstrap"
import Navbar from "../Navbar"
import Header from "../Header"
import ProductCard from "../ProductCard"
import CheckOut from "../CheckOut"
import Footer from "../Footer"
// import Header from "../Navbar"
export interface Item {
  id: number
  name: string
  quantity: number
  price: number
}

export interface CreateInvoiceBody {
  amount: number
  paymentMethod: string
  currency: string
  items: Array<Item>
}

export default function Form() {
  const [currency, setCurrency] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // Default to stripe
  const [loading, setLoading] = useState(false);
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)
  const [pageView, setPageView] = useState("products");
  const handlePageView = (page) => {
    setPageView(page);
  };
  const [formData, setFormData] = useState({
    paymentMethod: paymentMethod,
    amount: "",
    currency: currency,
  })
  const navigate = useNavigate()
  const sessionId = 1000

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product1,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 2,
      name: "Product 2",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product2,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

    },
    {
      id: 3,
      name: "Product 10000",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product3,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

    },
    {
      id: 4,
      name: "Product 4",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product4,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

    },
    {
      id: 5,
      name: "Product 5",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product5,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

    },
    {
      id: 6,
      name: "Product 6",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product6,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",

    },
  ])

  const [cart, setCart] = useState({
    products: [], // Array to store the products with ID, quantity, and total price
    totalPrice: 0, // Total cart price
  })

  const addToCart = (product) => {
    const existingProduct = cart.products.find((item) => item.id === product.id)

    if (existingProduct) {
      // If the product already exists in the cart, update its quantity
      existingProduct.quantity++
      existingProduct.totalPrice = (
        existingProduct.price * existingProduct.quantity
      ).toFixed(2)
      setCart((prevCart) => ({
        ...prevCart,
        totalPrice: (
          parseFloat(prevCart.totalPrice) + parseFloat(existingProduct.price)
        ).toFixed(2),
      }))
    } else {
      // Product does not exist in the cart, add it with a quantity property set to 1
      const newProduct = {
        ...product,
        quantity: 1,
        totalPrice: product.price,
      }
      setCart((prevCart) => ({
        ...prevCart,
        products: [...prevCart.products, newProduct],
        totalPrice: (
          parseFloat(prevCart.totalPrice) + parseFloat(newProduct.price)
        ).toFixed(2),
      }))
    }

    toast.success(`${product.name} added successfully.`)
  }

  const decreaseQuantityInCart = (productId) => {
    const updatedCart = { ...cart }

    const existingProduct = updatedCart.products.find(
      (item) => item.id === productId,
    )
    if (existingProduct && existingProduct.quantity > 0) {
      existingProduct.quantity--
      existingProduct.totalPrice = (
        existingProduct.price * existingProduct.quantity
      ).toFixed(2)
      updatedCart.totalPrice = (
        parseFloat(updatedCart.totalPrice) - parseFloat(existingProduct.price)
      ).toFixed(2)

      setCart(updatedCart)

      toast.success(`Quantity of Product with ID ${productId} decreased by 1.`)
    } else {
      toast.error(
        `Quantity of Product with ID ${productId} cannot be decreased further.`,
      )
    }
  }

  const getQuantityInCart = (productId) => {
    const product = cart.products.find((item) => item.id === productId)
    return product ? product.quantity : 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    if (name == "currency") {
      setCurrency(value)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let amount = 0;
    const carts = cart.products.map((item) => {
      amount += parseFloat(item.price) * item.quantity;
      return {
        id: parseInt(item.id),
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
      };
    });

    const data = {
      amount: amount,
      paymentMethod: formData.paymentMethod,
      currency: formData.currency,
      items: carts,
    };

    actor.create_invoice(data)
      .then((data) => {
        setLoading(false);
        console.log({ data });
        if (data.status) {
          if ('success' in data.body) {
            window.open(data.body.success.payment.redirectUrl, '_blank');
          }
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log({ err });
        toast.error(err.message);
      });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault()

  //   var amount = 0
  //   var carts = cart.products.map((item) => {
  //     amount += parseFloat(item.price) * item.quantity
  //     return {
  //       id: parseInt(item.id),
  //       name: item.name,
  //       quantity: item.quantity,
  //       price: parseFloat(item.price),
  //     }
  //   })

  //   console.log(carts)

  //   let data: CreateInvoiceBody = {
  //     amount: amount,
  //     paymentMethod: formData.paymentMethod,
  //     currency: formData.currency,
  //     items: carts,
  //   }
  //   console.log(data)

  //   actor
  //     .create_invoice(data)
  //     .then((data) => {
  //       console.log({ data })

  //       if (data.status) {
  //         if ("success" in data.body) {
  //           window.open(data.body.success.payment.redirectUrl, "_blank")
  //         }
  //         toast.success(data.message)
  //       } else {
  //         toast.error(data.message)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log({ err })
  //       toast.error(err.message)
  //     })
  // }

  useEffect(() => {
    async function myInvoice() {
      var isOwnerVal = await isOwner()
      if (isOwnerVal) {
        navigate("/admin")
      }
    }

    isAuthenticated && actor && myInvoice()
  }, [isAuthenticated, actor])

  console.log("isAuthenticated222",isAuthenticated);
  
  if (!isAuthenticated) {
    navigate("/auth/login")
  }

  return (
    <>
      {/* <Header isAdmin={false} /> */}
      <Header handlePageView={handlePageView} />
      <Container className="my-5">

        <Row className="justify-content-center">
        {pageView === "products" && (
          <Col lg={12}>
             <Row>
                {products.map((product) => (
                <Col key={product.id} md={4}>
                    <ProductCard
                    product={product}
                    handlePageView={handlePageView}
                    addToCart={addToCart}
                    decreaseQuantityInCart={decreaseQuantityInCart}
                    getQuantityInCart={getQuantityInCart}
                  />       
                </Col>     
              ))}
              </Row>
          </Col>)}
          {pageView === "checkout" && (
          <CheckOut  handlePageView={handlePageView} cart={cart}  addToCart={addToCart} decreaseQuantityInCart={decreaseQuantityInCart} getQuantityInCart={getQuantityInCart} setFormData={setFormData} handleSubmit={handleSubmit} setPaymentMethod={setPaymentMethod} setCurrency={setCurrency} loading={loading}/>
          )}
                
          {/* <Col lg={4} className="d-flex align-items-center">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <h2>Checkout</h2>
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
                  value={cart.totalPrice}
                  onChange={handleChange}
                  placeholder="Amount"
                  disabled
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
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
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
            </div>
          </Col> */}
        </Row>
      </Container>
      <Footer />
    </>
  )
}
