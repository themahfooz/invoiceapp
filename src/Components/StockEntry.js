import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const StockEntry = () => {
  const [stockData, setStockData] = useState({
    date: new Date().toISOString().substr(0, 10),
    product: "",
    qty: "",
  });

  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchStocks();
    fetchProducts();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stock`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock entries", error);
      setError("Failed to fetch stocks");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData({
      ...stockData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { product, qty, date } = stockData;
      if (!product || !qty) {
        throw new Error("Product and Qty are required");
      }

      const dataToSend = {
        ProductName: product,
        qty: parseInt(qty),
        date,
      };

      await axios.post(`${API_BASE_URL}/stock`, dataToSend);
      alert("Stock added successfully");
      fetchStocks();
    } catch (error) {
      console.error("Error adding stock", error);
      alert("Failed to add stock");
    }
  };

  return (
    <>
      <div className="app-title">
        <div>
          <h1>
            <i className="bi bi-ui-checks"></i> Stock Entry Form
          </h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title">Stock Entry</h3>
            <div className="tile-body">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <div className="mb-3 row">
                  <label className="form-label col-md-3">Date</label>
                  <div className="col-md-8">
                    <input
                      className="form-control"
                      type="date"
                      name="date"
                      value={stockData.date}
                      onChange={handleChange}
                      max={new Date().toISOString().substr(0, 10)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="form-label col-md-3">Product</label>
                  <div className="col-md-8">
                    <select
                      className="form-control"
                      name="product"
                      value={stockData.product}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option
                          key={product.ProductId}
                          value={product.ProductName}
                        >
                          {product.ProductName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="form-label col-md-3">Qty</label>
                  <div className="col-md-8">
                    <input
                      className="form-control"
                      type="number"
                      name="qty"
                      value={stockData.qty}
                      onChange={handleChange}
                      placeholder="Enter Qty"
                      required
                    />
                  </div>
                </div>
                <div className="tile-footer">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-3">
                      <button className="btn btn-primary" type="submit">
                        <i className="bi bi-check-circle-fill me-2"></i> Submit
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button className="btn btn-secondary" type="button">
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
            <h3 className="tile-title">Stock Entries</h3>
            <div className="tile-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Stock ID</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((entry) => (
                      <tr key={entry.StockId}>
                        <td>{entry.StockId}</td>
                        <td>{entry.ProductName}</td>
                        <td>{entry.Qty}</td>
                        <td>{entry.Date}</td>
                      </tr>
                    ))}
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

export default StockEntry;
