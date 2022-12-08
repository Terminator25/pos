import React, { useContext} from "react";
import ProductContext from "../../context/products/ProductContext";

export default function Productitem(props) {

    const context = useContext(ProductContext);
  const { product, updateProduct } = props;
  const { deleteProduct, categories} = context;

  const handleClick = (e)=>{

    if(!window.confirm("Are You Sure you want to delete?"))
    {
      props.showAlert("Operation Cancelled!", "danger")
    }

    else{

    
        deleteProduct(product._id); 
      props.showAlert("Product Deleted!", "success");}

  }

  return (
    <div className="col-md-3">
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{product.pname}</h5>
        <p className="card-text">Price: Rs. {product.price}
        <br/>Category: {
          categories.map((category)=>{
            return (category._id===product.category)?category.name:""
          })
}
<br/>SKU: {product.sku}<br/>Barcode: {product.barcode}
        {/* <p className="card-text"></p> */}
        <br/>ShortName: {product.shortname}</p>
        <i className="fas fa-edit mx-2" onClick={()=>{updateProduct(product)}}></i>
        <i className="fa fa-trash mx-2" aria-hidden="true" onClick={handleClick}></i>
      </div>
    </div>
  </div>
  )
}
