import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { API_BASE_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faTrash,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: new Date().toISOString().slice(0, 10),
    customerName: "",
    items: [
      {
        productName: "",
        qty: "",
        rate: "",
        amount: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const storedInvoiceNumber = localStorage.getItem("currentInvoiceNumber");
    if (storedInvoiceNumber) {
      setCurrentInvoiceNumber(parseInt(storedInvoiceNumber));
    }
    fetchCustomers();
    fetchProducts();
    fetchStockEntries();
    fetchInvoices();
    //console.log(`${API_BASE_URL}/invoice`);
  }, []);

  const handlePreviewClick = () => {
    setShowPreview(true);
    document.getElementById("invoice-details").style.display = "none";
    document.getElementById("invoice-preview").style.display = "block";
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    document.getElementById("invoice-details").style.display = "block";
    document.getElementById("invoice-preview").style.display = "none";
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
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

  const fetchStockEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stock`);
      setStockEntries(response.data);
    } catch (error) {
      console.error("Error fetching stock entries", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoice`);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          productName: "",
          qty: "",
          rate: "",
          amount: 0,
        },
      ],
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems[index][name] = value;

      if (name === "productName") {
        const selectedProduct = products.find(
          (product) => product.ProductName === value
        );
        if (selectedProduct) {
          updatedItems[index].rate = selectedProduct.Rate;
          updatedItems[index].productId = selectedProduct.ProductId; // Add productId to item
        }
      }

      if (name === "qty" || name === "rate") {
        const qty = parseInt(updatedItems[index].qty) || 0;
        const rate = parseFloat(updatedItems[index].rate) || 0;
        updatedItems[index].amount = (qty * rate).toFixed(2);
      }

      return {
        ...prevData,
        items: updatedItems,
      };
    });

    calculateTotal();
  };

  const handleRemoveItem = (index, e) => {
    e.preventDefault();
    setInvoiceData((prevData) => {
      if (prevData.items.length > 1) {
        const updatedItems = [...prevData.items];
        updatedItems.splice(index, 1);
        return {
          ...prevData,
          items: updatedItems,
        };
      } else {
        return {
          ...prevData,
          items: [
            {
              productName: "",
              qty: "",
              rate: "",
              amount: 0,
            },
          ],
        };
      }
    });

    calculateTotal();
  };

  const calculateTotal = () => {
    setInvoiceData((prevData) => {
      const subtotal = prevData.items.reduce(
        (acc, item) => acc + parseFloat(item.amount),
        0
      );
      const tax = (subtotal * 0.08).toFixed(2);
      const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
      return {
        ...prevData,
        subtotal: subtotal.toFixed(2),
        tax: parseFloat(tax),
        total: parseFloat(total),
      };
    });
  };

  // State for the current invoice number
  //const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState(1001); // Initial invoice number

  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState(() => {
    const storedInvoiceNumber = localStorage.getItem("currentInvoiceNumber");
    return storedInvoiceNumber ? parseInt(storedInvoiceNumber) : 1001;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateValue = invoiceData.date;
      if (!dateValue || !/\d{4}-\d{2}-\d{2}/.test(dateValue)) {
        alert(
          "Invalid date format. Please enter a valid date in the format yyyy-mm-dd."
        );
        return;
      }
      const date = new Date(dateValue);
      const isoDate = date.toISOString();
      const data = {
        ...invoiceData,
        date: isoDate,
        invoiceNumber: `INV-${currentInvoiceNumber}`,
      };
      console.log("Data being sent:", data);
      const response = await axios.post(`${API_BASE_URL}/invoice`, data);
      if (response.status === 201) {
        setCurrentInvoiceNumber(currentInvoiceNumber + 1);
        localStorage.setItem("currentInvoiceNumber", currentInvoiceNumber + 1);
        alert("Invoice added successfully");
        fetchInvoices();
      } else {
        console.error("Error adding invoice:", response);
        alert(`Failed to add invoice: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Failed to add invoice: ${error.response.data.message}`);
      } else {
        alert("Failed to add invoice due to an unexpected error.");
      }
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById("invoice-pdf");
    html2pdf(element, {
      filename: "invoice.pdf",
      margin: 2,
      image: { type: "jpeg", quality: 0.9 },
      jsPDF: { format: "letter", orientation: "portrait" },
    });
  };

  return (
    <>
      <div className="app-title">
        <div>
          <h1>
            <i className="bi bi-ui-checks"></i> Invoice Form
          </h1>
        </div>
      </div>

      <div id="invoice-details">
        <div className="row">
          <div className="col-md-12">
            <div className="tile">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="tile-title mb-0">Invoice Details</h3>
                <div>
                  <button
                    className="btn btn-primary me-2"
                    onClick={handlePreviewClick}
                  >
                    Preview Invoice
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Add Invoice
                  </button>
                </div>
              </div>
              <div className="tile-body">
                <form className="form-horizontal" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          <b>Bill to</b>
                        </label>
                        <select
                          className="form-control"
                          name="customerName"
                          value={invoiceData.customerName}
                          onChange={handleChange}
                        >
                          <option value="">Select Customer</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.name}>
                              {customer.name}
                            </option>
                          ))}
                        </select>
                        {invoiceData.customerName && (
                          <div>
                            <label className="form-label mt-3">
                              <b>Address:</b>
                            </label>
                            {(() => {
                              const customer = customers.find(
                                (customer) =>
                                  customer.name === invoiceData.customerName
                              );
                              return customer ? (
                                <p>
                                  {`${customer.address}, ${customer.district}, ${customer.state}`}
                                </p>
                              ) : null;
                            })()}

                            <p>
                              <b>Mobile:</b>{" "}
                              {
                                customers.find(
                                  (customer) =>
                                    customer.name === invoiceData.customerName
                                )?.mobile
                              }
                            </p>
                            <p>
                              <b>Email:</b>{" "}
                              {
                                customers.find(
                                  (customer) =>
                                    customer.name === invoiceData.customerName
                                )?.email
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          <b>Invoice Number</b>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="invoiceNumber"
                          value={`INV-${currentInvoiceNumber}`} // Display formatted invoice number
                          onChange={handleChange}
                          placeholder="Enter Invoice Number"
                          readOnly // Prevents manual editing
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <b>Date</b>
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          name="date"
                          value={invoiceData.date}
                          onChange={handleChange}
                          placeholder="Enter Date"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <b>Items</b>
                    </label>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Rate</th>
                            <th>Qty</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceData.items.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <select
                                  className="form-control"
                                  name="productName"
                                  value={item.productName}
                                  onChange={(e) => handleItemChange(index, e)}
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
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="number"
                                  name="rate"
                                  value={item.rate}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="number"
                                  name="qty"
                                  value={item.qty}
                                  onChange={(e) => handleItemChange(index, e)}
                                />
                              </td>
                              <td>{item.amount}</td>
                              <td>
                                <button
                                  className="btn btn-danger me-1"
                                  onClick={(e) => handleRemoveItem(index, e)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button
                                  className="btn btn-primary w-md"
                                  onClick={handleAddItem}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end">
                              <b>Subtotal:</b>
                            </td>
                            <td colSpan="2">{invoiceData.subtotal}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end">
                              <b>Tax (8%):</b>
                            </td>
                            <td colSpan="2">{invoiceData.tax}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end">
                              <b>Total:</b>
                            </td>
                            <td colSpan="2">{invoiceData.total}</td>
                          </tr>
                        </tfoot>
                      </table>

                      {/* <div className="d-flex justify-content-end mt-3">
                        <div className="totals">
                          <p className="total-line">
                            <span className="label">Subtotal:</span>
                            <span className="value">
                              {invoiceData.subtotal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </p>
                          <p className="total-line">
                            <span className="label">Tax (8%):</span>
                            <span className="value">
                              {invoiceData.tax.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </p>
                          <p className="total-line">
                            <span className="label">Total:</span>
                            <span className="value">
                              {invoiceData.total.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="invoice-preview" style={{ display: "none" }}>
        <div>
          {/* <button
                    className="btn btn-primary me-2"
                    onClick={handleClosePreview}
                  >
                    Close Preview
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleDownloadPdf}
                  >
                    Download PDF
                  </button> */}
          <div className="d-print-none mt-4">
            <div className="float-end">
              <a
                // href="javascript:window.print()"
                className="btn btn-success me-1"
                onClick={handleDownloadPdf}
              >
                <FontAwesomeIcon icon={faPrint} />
              </a>
              <a className="btn btn-primary w-md" onClick={handleClosePreview}>
                <FontAwesomeIcon icon={faXmark} />
              </a>
            </div>
          </div>
        </div>

        <div id="invoice-pdf">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="tile">
                  <div className="invoice-title">
                    <h4 className="float-end font-size-15">
                      Invoice {`#${currentInvoiceNumber}`}
                      <span className="badge bg-success font-size-12 ms-2">
                        Paid
                      </span>
                    </h4>
                    <div className="mb-4">
                      <h2 className="mb-1 text-muted">Abc Technology</h2>
                    </div>
                    <div className="text-muted">
                      <p className="mb-1">
                        2nd Floor, abc Complex, Abc Road, Delhi, New Delhi
                        110025
                      </p>
                      <p className="mb-1">
                        <FontAwesomeIcon icon={faEnvelope} className="me-1" />{" "}
                        care@abctechnology.com
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faPhone} className="me-1" />{" "}
                        +91-8002333556
                      </p>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="row">
                    <div className="col-sm-6">
                      <div className="text-muted">
                        <h5 className="font-size-16 mb-3">Billed To:</h5>
                        <h5 className="font-size-15 mb-2">
                          {invoiceData.customerName}
                        </h5>
                        <p className="mb-1">
                          {(() => {
                            const customer = customers.find(
                              (customer) =>
                                customer.name === invoiceData.customerName
                            );
                            return customer ? (
                              <p className="mb-1">
                                {`${customer.address}, ${customer.district}, ${customer.state}`}
                              </p>
                            ) : null;
                          })()}
                        </p>
                        <p className="mb-1">
                          {
                            customers.find(
                              (customer) =>
                                customer.name === invoiceData.customerName
                            )?.email
                          }
                        </p>
                        <p>
                          {
                            customers.find(
                              (customer) =>
                                customer.name === invoiceData.customerName
                            )?.mobile
                          }
                        </p>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-sm-6">
                      <div className="text-muted text-sm-end">
                        <div>
                          <h5 className="font-size-15 mb-1">Invoice No:</h5>
                          <p>{`INV-${currentInvoiceNumber}`}</p>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-size-15 mb-1">Invoice Date:</h5>
                          <p>{invoiceData.date}</p>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-size-15 mb-1">Order No:</h5>
                          <p>#1123456</p>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}

                  <div className="py-2">
                    <h5 className="font-size-15">Order Summary</h5>

                    <div className="table-responsive">
                      <table className="table align-middle table-nowrap table-centered mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: "70px" }}>No.</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th className="text-end" style={{ width: "120px" }}>
                              Total
                            </th>
                          </tr>
                        </thead>
                        {/* end thead */}
                        <tbody>
                          {invoiceData.items.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                <h5 className="text-truncate font-size-14 mb-1">
                                  {item.productName}
                                </h5>
                              </td>

                              <td>₹{item.rate}</td>
                              <td>{item.qty}</td>
                              <td className="text-end">₹{item.amount}</td>
                            </tr>
                          ))}
                          {/* end tr */}
                          <tr>
                            <th scope="row" colSpan="4" className="text-end">
                              Sub Total
                            </th>
                            <td className="text-end">
                              ₹
                              {invoiceData.subtotal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                          {/*end tr */}

                          <tr>
                            <th
                              scope="row"
                              colSpan="4"
                              className="border-0 text-end"
                            >
                              Tax(8%)
                            </th>
                            <td className="border-0 text-end">
                              ₹
                              {invoiceData.tax.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                          {/* end tr */}
                          <tr>
                            <th
                              scope="row"
                              colSpan="4"
                              className="border-0 text-end"
                            >
                              Total
                            </th>
                            <td className="border-0 text-end">
                              <h4 className="m-0 fw-semibold">
                                ₹
                                {invoiceData.total.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </h4>
                            </td>
                          </tr>
                          {/* end tr */}
                        </tbody>
                        {/* end tbody */}
                      </table>
                      {/* end table */}
                    </div>
                    {/* end table responsive */}
                  </div>
                </div>
              </div>
              {/* end col */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
