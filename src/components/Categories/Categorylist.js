import React, { useContext, useEffect, useRef, useState } from "react";
import CategoryContext from "../../context/categories/CategoryContext";
import Categoryitem from "./Categoryitem";

export default function Categorylist(props) {
  const context = useContext(CategoryContext);
  const { categories, getCategory, editCategory, getProducts} = context;

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line
    getProducts();
    // eslint-disable-next-line
  }, []);



  const [category, setCategory] = useState({id:"", ename: "" });

  const updateCategory = (category) => {
    ref.current.click();
    setCategory({ id:category._id, ename: category.name });
  };

  const ref = useRef(null);
  const refClose = useRef(null);

  const handleSubmit = (e)=>
  {
    e.preventDefault();
  }

  const handleClick = (e) => {
    e.preventDefault();
    let present = false

    for(let index=0;index<categories.length;index++)
    {
      const element = categories[index];
      if(element.name===category.ename)
      {
        present = true;
        break;
      }
    }

    if(!present)
    {editCategory(category.id, category.ename)
    props.showAlert("Category Updated!", "success");}
    else{
      props.showAlert("Category Already exists!", "danger")
    }
    refClose.current.click();
  };

  const onChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  return (
    <>
  <div className="container">
    {categories.length===0 && 'No Category Found.'}
    </div>
      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ename"
                    name="ename"
                    value={category.ename}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button" ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
              disabled={category.ename.length<3}
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Saved Categories</h2> <br />
        <br />
        {categories.map((category) => {
          return (
            <Categoryitem
              key={category._id}
              updateCategory={updateCategory}
              category={category}
              showAlert={props.showAlert}
            />
          );
        })}
      </div>
    </>
  );
}
