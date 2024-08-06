import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import { toast } from "react-toastify"
import product1 from "../../assets/art1.jpg"
import product2 from "../../assets/art2.jpg"
import product3 from "../../assets/art3.jpg"
import product4 from "../../assets/art4.jpg"
import product5 from "../../assets/art5.jpg"
import product6 from "../../assets/art6.jpg"
import { Row, Col, Container } from "react-bootstrap"
import Header from "../Header"
import ProductCard from "../ProductCard"
import CheckOut from "../CheckOut"
import Footer from "../Footer"

// Interface defining the structure of an item in the invoice
export interface Item {
  id: number
  name: string
  quantity: number
  price: number
}

// Interface defining the structure of the request body for creating an invoice
export interface CreateInvoiceBody {
  amount: number
  paymentMethod: string
  currency: string
  items: Array<Item>
}

export default function Form() {
  // State variables for currency, payment method, and loading status
  const [currency, setCurrency] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("stripe") // Default to stripe
  const [loading, setLoading] = useState(false)

  // Destructuring the context values from AppContext
  const { logout, isAuthenticated, actor, isOwner } = useContext(AppContext)

  // State for controlling the current page view (either 'products' or 'checkout')
  const [pageView, setPageView] = useState("products")

  // Function to change the current page view
  const handlePageView = (page) => {
    setPageView(page)
  }

  // State for storing form data including payment method, amount, and currency
  const [formData, setFormData] = useState({
    paymentMethod: paymentMethod,
    amount: "",
    currency: currency,
  })

  // Hook for programmatic navigation
  const navigate = useNavigate()
  const sessionId = 1000 // Placeholder session ID

  // Initial product data to display
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product1,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 2,
      name: "Product 2",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product2,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 3,
      name: "Product 3",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product3,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 4,
      name: "Product 4",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product4,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 5,
      name: "Product 5",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product5,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 6,
      name: "Product 6",
      price: (10 + Math.random() * 190).toFixed(2),
      image: product6,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ])

  // State to manage the shopping cart containing selected products and the total price
  const [cart, setCart] = useState({
    products: [], // Array to store the products with ID, quantity, and total price
    totalPrice: 0, // Total cart price
  })

  // Function to add a product to the cart
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

  // Function to decrease the quantity of a product in the cart
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

  // Function to get the quantity of a product in the cart
  const getQuantityInCart = (productId) => {
    const product = cart.products.find((item) => item.id === productId)
    return product ? product.quantity : 0
  }

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    if (name === "currency") {
      setCurrency(value)
    }
  }

  // Function to handle form submission for creating an invoice
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    let amount = 0
    const carts = cart.products.map((item) => {
      amount += parseFloat(item.price) * item.quantity
      return {
        id: parseInt(item.id),
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
      }
    })

    const data = {
      amount: amount,
      paymentMethod: formData.paymentMethod,
      currency: formData.currency,
      items: carts,
    }

    // Sending the request to create an invoice
    actor
      .create_invoice(data)
      .then((data) => {
        setLoading(false)
        if (data.status) {
          if ("success" in data.body) {
            window.open(data.body.success.payment.redirectUrl, "_blank")
          }
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log({ err })
        toast.error(err.message)
      })
  }

  // Effect to check if the user is an owner and redirect them to the admin page
  useEffect(() => {
    async function myInvoice() {
      var isOwnerVal = await isOwner()
      if (isOwnerVal) {
        navigate("/admin")
      }
    }

    isAuthenticated && actor && myInvoice()
  }, [isAuthenticated, actor])

  // Effect to redirect unauthenticated users to the login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login")
    }
  }, [isAuthenticated])

  return (
    <>
      {/* Rendering the header with a handlePageView prop */}
      <Header handlePageView={handlePageView} />
      <Container className="my-5">
        <Row className="justify-content-center">
          {pageView === "products" && (
            <Col lg={12}>
              <Row>
                {/* Rendering product cards */}
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
            </Col>
          )}
          {pageView === "checkout" && (
            <CheckOut
              handlePageView={handlePageView}
              cart={cart}
              addToCart={addToCart}
              decreaseQuantityInCart={decreaseQuantityInCart}
              getQuantityInCart={getQuantityInCart}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              setPaymentMethod={setPaymentMethod}
              setCurrency={setCurrency}
              loading={loading}
            />
          )}
        </Row>
      </Container>
      {/* Rendering the footer */}
      <Footer />
    </>
  )
}
