import React, { useContext } from "react";
import CategoryContext from "../../context/categories/CategoryContext";

export default function Categoryitem(props) {
  const context = useContext(CategoryContext);
  const { category, updateCategory } = props;
  const { deleteCategory, products } = context;
  //eslint-disable-next-line

  // useEffect(() => {
  //   getProducts();
  //   // eslint-disable-next-line
  // }, []);
  
  const handleClick = (e)=>{

    if(!window.confirm("Are You Sure you want to delete?"))
    {
      props.showAlert("Operation Cancelled!", "danger")
    }

    else{

      // getProducts();
      // console.log("hi2")
    // eslint-disable-next-line

   // console.log(products);

    let present = false

    for(let index=0;index<products.length;index++)
    {
      const element = products[index];
      if(element.category===category._id)
      {
        present = true;
        break;
      }
    }

    if(!present)
    {
      deleteCategory(category._id); 
      props.showAlert("Category Deleted!", "success");}
    else{
      props.showAlert("Products exists for this category!", "danger")
    }

  }

  }

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{category.name}</h5>
          <i className="fas fa-edit mx-2" onClick={()=>{updateCategory(category)}}></i>
          <i className="fa fa-trash mx-2" aria-hidden="true" onClick={handleClick}></i>
        </div>
      </div>
    </div>
  );
}
