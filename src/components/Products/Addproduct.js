import React, { useContext, useState, useEffect } from "react";
import ProductContext from "../../context/products/ProductContext";

export default function Addproduct(props) {
  const context = useContext(ProductContext);
  const { products, addProduct, categories, getProducts, getCategory } =
    context;

  const [product, setProduct] = useState({
    category: "sel",
    sku: "",
    barcode: "",
    price: "",
    pname: "",
    shortname: "",
  });

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
    getCategory();
    // eslint-disable-next-line
  }, []);

  const handleClick = (e)=> {
    e.preventDefault();
    let present = false;
    let mess = "";

    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      if (element.barcode === product.barcode) {
        present = true;
        mess = "Product with same barcode already exists";
        break;
      }
      if (element.sku === product.sku) {
        present = true;
        mess = "Product with same SKU already exists";
        break;
      }
      if (element.pname === product.pname) {
        present = true;
        mess = "Product with same name already exists";
        break;
      }
    }

    if (present) {
      props.showAlert(mess, "danger");
    } else {
      addProduct(
        product.category,
        product.sku,
        product.barcode,
        product.price,
        product.pname,
        product.shortname
      );
     // console.log(product);
      setProduct({
        category: "sel",
        sku: "",
        barcode: "",
        price: "",
        pname: "",
        shortname: "",
      });
     // console.log(product);
      props.showAlert("Product Added!", "success");
    }
  };

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container my-3">
        <h2>Add a Product</h2>
        <form className="my-3">
          <label htmlFor="name" className="form-label">
            Select Product Category
          </label>

          <div className="mb-2">
            {
              <select
                id="category"
                name="category"
                className="form-select"
                aria-label="Category select"
                onChange={onChange}
              >
                {/* selected={product.category === "sel" ? "selected" : ''} */}
                <option key="sel" value="sel" selected={product.category === "sel" ? "selected" : ''}>
                  Select Category
                </option>
                {categories.map((category) => {
                  return (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            }
          </div>
          <div className="row">
            <div className="col-sm-8 mb-2">
              <label htmlFor="name" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="pname"
                name="pname"
                onChange={onChange}
                value={product.pname}
                required
              />
            </div>

            <div className="col-sm-4 mb-2">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="price"
                name="price"
                onChange={onChange}
                value={product.price}
                required
              />
            </div>
          </div>  
          <div className="row">
            <div className="col-sm-4 mb-2">
              <label htmlFor="shortname" className="form-label">
                Short Name
              </label>
              <input
                type="text"
                className="form-control"
                id="shortname"
                name="shortname"
                onChange={onChange}
                value={product.shortname}
                required
              />
            </div>

            <div className="col-sm-4 mb-2">
              <label htmlFor="sku" className="form-label">
                SKU
              </label>
              <input
                type="text"
                className="form-control"
                id="sku"
                name="sku"
                onChange={onChange}
                value={product.sku}
                required
              />
            </div>

            <div className="col-sm-4 mb-2">
              <label htmlFor="barcode" className="form-label">
                Barcode
              </label>
              <input
                type="text"
                className="form-control"
                id="barcode"
                name="barcode"
                onChange={onChange}
                value={product.barcode}
                required
              />
            </div>
          </div>

          <button
            disabled={
              product.pname.length < 3 ||
              product.shortname.length < 3 ||
              product.barcode.length < 3 ||
              product.sku.length < 3 ||
              product.price < 0 ||
              product.category === "sel" ||
              product.price.toString().length < 1
            }
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
