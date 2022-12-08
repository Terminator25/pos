import ProductContext from "./ProductContext";
import React, { useState } from "react";

const ProductState = (props)=>{

  const host = "http://localhost:5000"

  const categoriesInitial = [];

  const [categories, setCategories] = useState(categoriesInitial);

  const productsinitial = [];

  const [products, setProducts] = useState(productsinitial);

  // Get all products

  const getProducts = async ()=>{

    const response = await fetch(`${host}/api/product/view`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json  = await response.json();

    setProducts(json)

  }

    // Get all categories

    const getCategory = async ()=>{

      const response = await fetch(`${host}/api/category/view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const json  = await response.json();
  
      setCategories(json)
  
    }

      // Add a product

  const addProduct = async (category,sku,barcode,price,pname,shortname)=>{

    const response = await fetch(`${host}/api/product/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({category,sku,barcode,price,pname,shortname})
    });
    const json  = await response.json();
    setProducts(products.concat(json))
  }

  
  // Edit a product
  const editProduct = async (id,category,sku,barcode,price,pname,shortname)=>{

    const response = await fetch(`${host}/api/product/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({id,category,sku,barcode,price,pname,shortname})
    });
    const json  = response.json();
    console.log(json);

    let newproduct= JSON.parse(JSON.stringify(products))
    for(let index=0;index<newproduct.length;index++)
    {
      const element = newproduct[index];
      if(element._id===id)
      {
        newproduct[index].category = category;
        newproduct[index].sku = sku;
        newproduct[index].barcode = barcode;
        newproduct[index].price = price;
        newproduct[index].pname = pname;
        newproduct[index].shortname = shortname;
        break;
      }
    }

    setProducts(newproduct);
    
  }

  // Delete a category

  const deleteProduct = async (id)=>{

    const response = await fetch(`${host}/api/product/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json  = response.json();
    console.log(json);

    let newprods = products.filter((prod)=>{return prod._id!==id})
    setProducts(newprods)
  }


    
    return (
        <ProductContext.Provider value={{products, setProducts, categories, addProduct, getProducts, getCategory, editProduct, deleteProduct}}>
            {props.children}
        </ProductContext.Provider>
    )
}

export default ProductState;