import CategoryContext from "./CategoryContext";
import React, { useState } from "react";
import axios from "axios";

const CategoryState = (props) => {

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

    //console.log("hi1")

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

  // Add a category

  const addCategory = async (name)=>{

    const response = await fetch(`${host}/api/category/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({name})
    });
    const json  = await response.json();
    setCategories(categories.concat(json))
  }

  // Delete a category

  // const deleteCategory = async (id)=>{

  //   const response = await fetch(`${host}/api/category/delete/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'auth-token': localStorage.getItem('token')
  //     },
  //   });
  //   const json  = response.json();
  //   console.log(json);
  //   let newCategories = categories.filter((category)=>{return category._id!==id})
  //   setCategories(newCategories)
  // }
  const deleteCategory = (id) => {
    const option = {
      method: 'PUT', headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      url: `${host}/api/category/delete/${id}`
    };
    axios(option)
    .then((e) => {
      console.log(e,'e112');
      if (e?.data?.found?._id) {
        getCategory();
      }
    })
    .catch((err) => {
      console.log(err,'err');
    })
  }

  // Edit a category
  const editCategory = async (id,name)=>{

    const response = await fetch(`${host}/api/category/edit/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({name})
    });
    const json  = response.json();
    console.log(json);
    
    let newcategory= JSON.parse(JSON.stringify(categories))
    for(let index=0;index<newcategory.length;index++)
    {
      const element = newcategory[index];
      if(element._id===id)
      {
        newcategory[index].name = name;
        break;
      }
    }

    setCategories(newcategory);
    
  }


  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory, editCategory, setCategories, getCategory, products, getProducts }}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
