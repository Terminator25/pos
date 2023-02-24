import React, { useContext, useState, useEffect } from "react";
import ProductContext from "../../context/products/ProductContext";
import Papa from "papaparse";

export default function Addproduct(props) {
  const context = useContext(ProductContext);
  const { products, addProduct, categories, getProducts, getCategory, addmultiple } =
    context;

  const [product, setProduct] = useState({
    category: "sel",
    sku: "",
    barcode: "",
    price: "",
    market_price: "",
    pname: "",
    shortname: "",
    gstrate:""
  });

  // const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    getProducts();
    getCategory();
  },//eslint-disable-next-line
   []);
  

  const handleParse = (e) =>{
    Papa.parse(e.target.files[0],{
      header:true,
      dynamicTyping:true,
      skipEmptyLines: true,
      complete:results=> {
        setParsedData(results.data);
        // for(let i=0; i < parsedData.length;i++)
        // {
        //   categories.map((category)=>{return(category.name===parsedData[i].category)?setParsedData({...parsedData, parsedData[i]:category._id})})
        // }
      }
    });
  };

  console.log(parsedData, 'bigfile');

  useEffect(()=>{
    for(let i=0; i<parsedData.length; i++)
    {
      for(let j=0; j<products.length; j++)
      {
        if(products[j].pname===parsedData[i].pname)
        {
          let new_data=parsedData.filter((data)=>data.pname!==parsedData[i].pname);
          setParsedData(new_data);
          break;
        }
      }
    }
  },//eslint-disable-next-line
  [parsedData]);

  const handleMultiple =(e)=>{
    parsedData.map((data)=>{
      return(categories.map((categor)=>{
        return(categor.name===data.category)?(data.category=categor._id):null;
      }));
    })

    addmultiple(parsedData);
    setParsedData([]);
  }

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
        product.market_price,
        product.pname,
        product.shortname,
        product.gstrate
      );
     // console.log(product);
      setProduct({
        category: "sel",
        sku: "",
        barcode: "",
        price: "",
        market_price: "",
        pname: "",
        shortname: "",
        gstrate: ""
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

            <div className="col-sm-2 mb-2">
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

            <div className="col-sm-2 mb-2">
              <label htmlFor="market_price" className="form-label">
                MRP
              </label>
              <input 
                type="number"
                className="form-control"
                id="market_price"
                name="market_price"
                onChange={onChange}
                value={product.market_price}  
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3 mb-2">
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

            <div className="col-sm-3 mb-2">
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

            <div className="col-sm-3 mb-2">
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

            <div className="col-sm-3 mb-2">
              <label htmlFor="gstrate" className="form-label">
                GST On Product
              </label>
              <input
                type="text"
                className="form-control"
                id="gstrate"
                name="gstrate"
                onChange={onChange}
                value={product.gstrate}
                required
              />
            </div>
          </div>

          <button
            disabled={
              product.pname.length < 3 ||
              product.price.toString().length < 1
            }
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Add
          </button>
        </form>
        <form className="my-3">
          <input type="file"
          className="form-control"
          id="import"
          name="import"
          onChange={handleParse}
          />
          <button type="submit" className="btn btn-primary my-3" onClick={handleMultiple}>Import Data</button>
        </form>
      </div>
    </div>
  );
}
