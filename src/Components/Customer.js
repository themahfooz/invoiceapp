import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Customer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    mobile: "",
    address: "",
    district: "",
    state: "",
    email: "",
    whatsapp: "",
  });
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, mobile, address, district, state, email, whatsapp } =
        customerData;
      if (
        !name ||
        !mobile ||
        !address ||
        !district ||
        !state ||
        !email ||
        !whatsapp
      ) {
        throw new Error("All fields are required");
      }
      await axios.post(`${API_BASE_URL}/customers`, customerData);
      alert("Customer added successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer", error);
      alert("Failed to add customer");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
      setError("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="app-title">
        <div>
          <h1>
            <i className="bi bi-ui-checks"></i> Customer Form
          </h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title">Register Customer</h3>
            <div className="tile-body">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                {Object.keys(customerData).map((field) => (
                  <div className="mb-3 row" key={field}>
                    <label className="form-label col-md-3">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="col-md-8">
                      <input
                        className="form-control"
                        type="text"
                        name={field}
                        value={customerData[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  </div>
                ))}
                <div className="tile-footer">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-3">
                      <button className="btn btn-primary" type="submit">
                        <i className="bi bi-check-circle-fill me-2"></i>{" "}
                        Register
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <a className="btn btn-secondary" href="#">
                        <i className="bi bi-x-circle-fill me-2"></i> Cancel
                      </a>
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
            <h3 className="tile-title">Registered Customers</h3>
            <div className="tile-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Address</th>
                      <th>District</th>
                      <th>State</th>
                      <th>Email</th>
                      <th>WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.name}</td>
                        <td>{customer.mobile}</td>
                        <td>{customer.address}</td>
                        <td>{customer.district}</td>
                        <td>{customer.state}</td>
                        <td>{customer.email}</td>
                        <td>{customer.whatsapp}</td>
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

export default Customer;
