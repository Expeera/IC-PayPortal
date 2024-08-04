import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProductCard.css";
const ProductCard = ({ product, handlePageView,addToCart,decreaseQuantityInCart ,getQuantityInCart}) => {
  return (
    <div className="card" style={{ width: "100%", marginBottom: "20px" }}>
  <img className="card-img-top" src={product.image} alt={product.name} />
  <div className="card-body">
    <h5 className="card-title">{product.name}</h5>
    <p className="card-text">{product.description}</p>
    <div className="priceLable">${product.price}</div>
    <div className="CartControll">
    {getQuantityInCart(product.id) != 0 &&  
    <button
      className="btn btn-light AddToCart mr-5"
      onClick={() => handlePageView("checkout")}
    >
      <i className="bi bi-bag-heart-fill"></i> View In Cart
    </button>}
    <div className="actionControlCart">
    <i className="bi bi-plus-circle-fill" onClick={(e) => addToCart(product)}></i>
      <span>{getQuantityInCart(product.id)}</span>
      <i className="bi bi-dash-circle-fill" onClick={(e) => decreaseQuantityInCart(product.id)}></i>
    </div>
    </div>

    {/* <div
                        className="d-flex "
                        style={{ flexDirection: "column" }}
                      >
                        <button
                          onClick={(e) => addToCart(product)}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            background: "#28a745",
                            borderRadius: "8px",
                            fontSize: "14px",
                            margin: "5px",
                          }}
                        >
                          Add To Cart
                        </button>
                        <button
                          onClick={(e) => decreaseQuantityInCart(product.id)}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            background: "#dc3545",
                            borderRadius: "8px",
                            fontSize: "14px",
                            margin: "5px",
                          }}
                        >
                          Remove From Cart
                        </button>
                        Quntity: {getQuantityInCart(product.id)}
                      </div> */}
  </div>
</div>

  );
};

export default ProductCard;
