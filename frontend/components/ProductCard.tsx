import React from "react"
import "./ProductCard.css" // Importing the CSS file for styling the component

/**
 * ProductCard Component
 *
 * Displays product information in a card format and provides controls
 * for adding/removing the product from the cart and viewing the cart.
 *
 * Props:
 * - product: Object containing the product details (name, image, description, price, id).
 * - handlePageView: Function to navigate to a different page view.
 * - addToCart: Function to add the product to the cart.
 * - decreaseQuantityInCart: Function to decrease the quantity of the product in the cart.
 * - getQuantityInCart: Function to get the current quantity of the product in the cart.
 */
const ProductCard = ({
  product,
  handlePageView,
  addToCart,
  decreaseQuantityInCart,
  getQuantityInCart,
}) => {
  return (
    <div className="card" style={{ width: "100%", marginBottom: "20px" }}>
      {/* Product image */}
      <img className="card-img-top" src={product.image} alt={product.name} />

      <div className="card-body">
        {/* Product name */}
        <h5 className="card-title">{product.name}</h5>

        {/* Product description */}
        <p className="card-text">{product.description}</p>

        {/* Product price */}
        <div className="priceLable">${product.price}</div>

        <div className="CartControll">
          {/* Button to view the product in the cart if it has been added */}
          {getQuantityInCart(product.id) != 0 && (
            <button
              className="btn btn-light AddToCart mr-5"
              onClick={() => handlePageView("checkout")}
            >
              <i className="bi bi-bag-heart-fill"></i> View In Cart
            </button>
          )}

          <div className="actionControlCart">
            {/* Button to increase the quantity of the product in the cart */}
            <i
              className="bi bi-plus-circle-fill"
              onClick={() => addToCart(product)}
            ></i>

            {/* Displays the current quantity of the product in the cart */}
            <span>{getQuantityInCart(product.id)}</span>

            {/* Button to decrease the quantity of the product in the cart */}
            <i
              className="bi bi-dash-circle-fill"
              onClick={() => decreaseQuantityInCart(product.id)}
            ></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
