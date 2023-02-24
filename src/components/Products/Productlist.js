import React, { useContext, useEffect, useRef, useState } from "react";
import ProductContext from "../../context/products/ProductContext";
import Productitem from "./Productitem";
// import ListProductItem from "./Listproductitem";
import ReactPaginate from "react-paginate";

export default function Productlist(props) {
  const context = useContext(ProductContext);
  const { products, getProducts, editProduct, getCategory, categories, deletemultiple } =
    context;

  useEffect(() => {
    getCategory();
    getProducts();
    // eslint-disable-next-line
  }, []);

  const [product, setProduct] = useState({
    id: "",
    ecategory: "sel",
    esku: "",
    ebarcode: "",
    eprice: "",
    emarket_price: "",
    epname: "",
    eshortname: "",
    egstrate: ""
  });


  const [currentPage, setCurrentPage] = useState(0);

  const updateProduct = (prod) => {
    ref.current.click();
    setProduct({
      id: prod._id,
      ecategory: prod.category,
      esku: prod.sku,
      ebarcode: prod.barcode,
      eprice: prod.price,
      emarket_price: prod.market_price,
      epname: prod.pname,
      eshortname: prod.shortname,
      egstrate: prod.gstrate
    });
  };

  const ref = useRef(null);
  const refClose = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClick = (e) => {
    e.preventDefault();
    // let present = false;
    // let mess = "";

    // for (let index = 0; index < products.length; index++) {
    //   const element = products[index];
    //   if ((element.barcode === product.ebarcode ) && (element._id !== product.id )) {
    //     present = true;
    //     mess = "Product with same barcode already exists";
    //     break;
    //   }
    //   if (element.sku === product.esku && (element._id !== product.id )) {
    //     present = true;
    //     mess = "Product with same SKU already exists";
    //     break;
    //   }
    //   if (element.pname === product.epname && (element._id !== product.id )) {
    //     present = true;
    //     mess = "Product with same name already exists";
    //     break;
    //   }
    // }

    // if (present) {
    //     props.showAlert(mess, "danger");
    //   } else {

        editProduct(
            product.id, 
            product.ecategory,
            product.esku,
            product.ebarcode,
            product.eprice,
            product.emarket_price,
            product.epname,
            product.eshortname,
            product.egstrate);

            props.showAlert("Product Updated!", "success");

      // }

      refClose.current.click();

  };

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // const handlePageClick = (e) =>{
  //   setCurrentPage(e);
  // };

  const [selectedProds, setSelectedProds] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const handleSelect = (prod, toggle) => {
    if(!toggle){
      setSelectedIds(oldArray => [...oldArray, prod._id]);
      setSelectedProds(oldArray => [...oldArray, prod])
    }
    else{
      let newArray = selectedIds.filter((id)=>id!==prod._id);
      let newProds = selectedProds.filter((product)=>product!==prod)
      setSelectedIds(newArray); 
      setSelectedProds(newProds);
    }
  }

  const handlemultipledelete =(e)=>{
    e.preventDefault()
    if(!window.confirm(`Are You Sure you want to these ${selectedIds.length} delete?`))
    {
      props.showAlert("Operation Cancelled!", "danger")
    }

    else{
      deletemultiple(selectedIds)
      setSelectedIds([])
      props.showAlert("Product Deleted!", "success");}
  }

  const clearselectedids = (e)=>{
    e.preventDefault();
    setSelectedIds([]);
    setSelectedProds([]);
  }


  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const PER_PAGE = 12;
  const offset = currentPage*PER_PAGE;
  const currentPageData = products.slice(offset, offset + PER_PAGE).map((product) => {
    return (
      <>
      {selectedIds.includes(product._id)?(null):      
      (<Productitem
        key={product._id}
        selectedIds={selectedIds}
        updateProduct={updateProduct}
        handleSelect={handleSelect}
        product={product}
        showAlert={props.showAlert}
      />)}

      </>
    );
  })  
  const pageCount = Math.ceil(products.length / PER_PAGE);  

  return (
    <>
      <div className="container">
        {products.length === 0 && "No Product Found."}
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
                Edit Product
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
                <label htmlFor="category" className="form-label">
                Category Name
                </label>
                  <select
                    className="form-select"
                    id="ecategory"
                    name="ecategory"
                    onChange={onChange}
                    aria-label="Category select"
                  >
                  {categories.map((category) => {
                  return (
                    <option key={category._id} value={category._id} selected={product.ecategory === category._id ? "selected" : ''} >
                      {category.name}
                    </option>
                  );
                })}

                </select>

                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="epname"
                    name="epname"
                    value={product.epname}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="sku" className="form-label">
                  SKU
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="esku"
                    name="esku"
                    value={product.esku}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="barcode" className="form-label">
                  Barcode
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ebarcode"
                    name="ebarcode"
                    value={product.ebarcode}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                  Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="eprice"
                    name="eprice"
                    value={product.eprice}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="market_price" className="form-label">
                    MRP
                  </label>
                  <input 
                    type="number" 
                    className="form-control"
                    id="emarket_price"
                    name="emarket_price"
                    value={product.emarket_price}
                    onChange={onChange} 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="gstrate" className="form-label">
                  GST Percent
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="egstrate"
                    name="egstrate"
                    value={product.egstrate}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="shortname" className="form-label">
                  Short Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="eshortname"
                    name="eshortname"
                    value={product.eshortname}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>

              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                // disabled={product.epname.length < 3 ||
                //   product.eshortname.length < 3 ||
                //   product.ebarcode.length < 3 ||
                //   product.esku.length < 3 ||
                //   product.eprice < 0 ||
                //   product.ecategory === "sel" ||
                //   product.eprice.toString().length < 1}
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

      {/* <div className="row my-3">
        <h2>Saved Products</h2> <br />
        <br />
        <ul className="list-group">
        {products.map((product) => {
          return (
            <ListProductItem
              key={product._id}
              updateProduct={updateProduct}
              handleSelect={handleSelect}
              product={product}
              showAlert={props.showAlert}
            />
          );
        })}
        </ul>
      </div> */}

      <div className="row my-3">
        <h1 className="my-3">Products</h1>      
        {selectedIds.length>0?(<p><button className="badge bg-primary rounded mx-1" onClick={handlemultipledelete}>Delete Selected</button> <button className="badge bg-primary rounded mx-1" onClick={clearselectedids}>Clear Selected</button> <span className="mx-3">{selectedIds.length}</span></p>):null}
        <ul className="list-group" style={{width:"60rem"}}>
        {selectedProds.slice(offset, offset + PER_PAGE).map((product) =>{
          return( 
            <>
            <Productitem
              key={product._id}
              selectedIds={selectedIds}
              updateProduct={updateProduct}
              handleSelect={handleSelect}
              product={product}
              showAlert={props.showAlert}
            />
            </>
            );
        })}
        {currentPageData}
        </ul>
        <span className="my-4">
          <ReactPaginate
            previousLabel="← Previous"
            nextLabel="Next →"
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </span>
    </div>
    </>
  );
}
