import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Product = () => {
  const [productData, setProductData] = useState({
    Date: new Date().toISOString().substr(0, 10),
    ProductName: "",
    Rate: "",
    Description: "",
    HsnCode: "",
    Igst: "",
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productDataToSend = {
        ...productData,
        Rate: parseFloat(productData.Rate),
        Igst: parseFloat(productData.Igst),
        HsnCode: productData.HsnCode,
      };

      // Add a check to ensure ProductName is not empty
      if (
        !productDataToSend.ProductName ||
        productDataToSend.ProductName.trim() === ""
      ) {
        alert("Product name is required");
        return;
      }

      console.log("Product data to send:", productDataToSend); // Add this line for debugging
      await axios.post(`${API_BASE_URL}/products`, productDataToSend);
      alert("Product added successfully");
      fetchProducts();
      setProductData({
        Date: new Date().toISOString().substr(0, 10),
        ProductName: "",
        Rate: "",
        Description: "",
        HsnCode: "",
        Igst: "",
      });
    } catch (error) {
      console.error("Error adding product", error);
      alert(`Failed to add product: ${error.response?.data || error.message}`);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      console.log("Fetched products:", response.data); // Debugging log
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching products", error);
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="app-title">
        <div>
          <h1>
            <i className="bi bi-ui-checks"></i> Product Form
          </h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title">Register Product</h3>
            <div className="tile-body">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                {Object.keys(productData).map((field) => (
                  <div className="mb-3 row" key={field}>
                    <label className="form-label col-md-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="col-md-8">
                      {field === "Date" ? (
                        <input
                          className="form-control"
                          type="date"
                          name={field}
                          value={productData[field]}
                          onChange={handleChange}
                          max={new Date().toISOString().substr(0, 10)}
                          required
                        />
                      ) : (
                        <input
                          className="form-control"
                          type={
                            field === "Rate" || field === "Igst"
                              ? "number"
                              : "text"
                          }
                          name={field}
                          value={productData[field]}
                          onChange={handleChange}
                          placeholder={`Enter ${field}`}
                          required
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="tile-footer">
                  <div className="row">
                    <div className="col-md-10 col-md-offset-2">
                      <button className="btn btn-primary" type="submit">
                        <i className="bi bi-check-circle-fill me-2"></i>{" "}
                        Register
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() =>
                          setProductData({
                            Date: new Date().toISOString().substr(0, 10),
                            ProductName: "",
                            Rate: "",
                            Description: "",
                            HsnCode: "",
                            Igst: "",
                          })
                        }
                      >
                        <i className="bi bi-x-circle-fill me-2"></i> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Registered Products</h3>
            <div className="tile-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Rate</th>
                      <th>Description</th>
                      <th>HSN Code</th>
                      <th>IGST</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.ProductId}>
                          <td>{product.ProductName}</td>
                          <td>{product.Rate}</td>
                          <td>{product.Description}</td>
                          <td>{product.HsnCode}</td>
                          <td>{product.Igst}</td>
                          <td>{product.Date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No products available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
