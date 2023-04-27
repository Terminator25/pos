import React, { useContext, useState, useEffect} from "react";
// import Bill from "../../../backend/models/Bill";
import ProductContext from "../../context/products/ProductContext";
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';  

export default function Productitem(props) {

  const context = useContext(ProductContext);
  const { product, updateProduct, handleSelect, selectedIds, updateInventory } = props;
  const { deleteProduct} = context;

  const selectCard = (e)=>{
    e.preventDefault();
    if(selectedIds.length<10 || (selectedIds.includes(product._id)))
    {clickCard();}
  }

  const handleClick = (e)=>{

    if(!window.confirm("Are You Sure you want to delete?"))
    {
      props.showAlert("Operation Cancelled!", "danger")
    }

    else{
        deleteProduct(product._id); 
      props.showAlert("Product Deleted!", "success");}

  }

  const [use, setUse]= useState(false);

  useEffect(()=>{  
    if(selectedIds.length>9 && !(selectedIds.includes(product._id)))
    {
      setUse(true);
    }
    else
    {
      setUse(false);
    }
  }, // eslint-disable-next-line
  [selectedIds]);

  const [toggle, setToggle] = useState();
  useEffect(()=>{  

    if(selectedIds.includes(product._id)){
      setToggle(true);
    }
    else{
      setToggle(false);
    }
  }, // eslint-disable-next-line
  [selectedIds]);
  // eslint-disable-next-line


  const clickCard = (e)=>{
    handleSelect(product, toggle);
    setToggle(!toggle);
  }
  return (
    <li className="list-group-item my-2 d-flex justify-content-between">
        <div className="position-relative">
          <OverlayTrigger overlay={(selectedIds.length>9?(<Tooltip id="tooltip-disabled">Atmost 10 items can be deleted at a time</Tooltip>):<span></span>)}>
          {/* eslint-disable-next-line  */}
          <a href="#" 
          disabled={use} 
          className="stretched-link text-decoration-none text-black" onClick={selectCard}><h5 className="card-title">{product.pname}</h5></a>
          </OverlayTrigger>
          <p>Price: Rs. {product.price}</p>
        </div>
        <div>
            
              <OverlayTrigger placement="left" overlay={(selectedIds.length>9?(<Tooltip id="tooltip-disabled">Atmost 10 items can be deleted at a time</Tooltip>):<span></span>)}><span>
              <Form>
              <Form.Check
                disabled={use}
                type="checkbox"
                id="switch-default"
                value={toggle}
                onChange={clickCard}
                checked={toggle}
              />
              </Form>
              </span>
              </OverlayTrigger>
            
            <i className="fa fa-edit my-3" onClick={()=>{updateProduct(product)}}></i>
            <i className="fa fa-trash my-3 mx-2" aria-hidden="true" onClick={handleClick}></i>
            <i className="fa fa-folder-open my-3" aria-hidden="true" onClick={()=>{updateInventory(product)}}></i>
        </div>
        {/* <p className="card-text mx-3 position-relative">Price: Rs. {product.price}
            {product.category!==undefined?(<><br/>Category: {
              categories.map((category)=>{
                return (category._id===product.category)?category.name:""
              })
              }</>):null}
            {product.sku!==undefined?(<><br/>SKU: {product.sku}</>):null}
            {product.barcode!==undefined?(<><br/>Barcode: {product.barcode}</>):null}
            {product.shortname!==undefined?(<><br/>ShortName: {product.shortname}</>):null}
            {product.gstrate!==null?(<><br/>GST: {product.gstrate}</>):null}
            </p> */}
    </li>
  )
}
