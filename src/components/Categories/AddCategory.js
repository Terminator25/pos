import React, { useContext ,useState} from "react";
import CategoryContext from "../../context/categories/CategoryContext";

export default function AddCategory(props) {
  const context = useContext(CategoryContext);
  const { categories, addCategory } = context;

  const [category, setCategory] = useState({name:""})
  

  const handleClick = (e)=>{
    e.preventDefault();

    let present = false

    for(let index=0;index<categories.length;index++)
    {
      const element = categories[index];
      if(element.name===category.name)
      {
        present = true;
        break;
      }
    }

    if(!present)
    {addCategory(category.name);
    setCategory({name:""});
    props.showAlert("Category Added!", "success");}
    else{
      props.showAlert("Category Already exists!", "danger");}

}

const onChange = (e)=>{
    setCategory({...category, [e.target.name]: e.target.value})
}

  return (
    <div>
      <div className="container my-3">
        <h2>Add a Category</h2>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              onChange={onChange}
              minLength={3}
              value={category.name}
              required
            />
          </div>
          
          <button
            disabled={category.name.length<3}
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
