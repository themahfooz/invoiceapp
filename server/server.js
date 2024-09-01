const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();
const moment = require("moment-timezone");
const { API_BASE_URL, PORT } = require("../src/config");

app.use(bodyParser.json());
app.use(cors());

const config = {
  // host: "193.203.184.38",
  // database: "u258795027_bill",
  // user: "u258795027_bill",
  // password: "_Mahfooz_1590",

  host: "127.0.0.1",
  database: "eduappdb",
  user: "root",
  password: "Samsung@2024",
  port: 3306,
};

const pool = mysql.createPool(config);

pool
  .getConnection()
  .then((conn) => {
    conn.release();
    console.log("Connected to MySQL");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

const localTimeZone = "Asia/Kolkata";

function getCurrentDateTime() {
  return moment().tz(localTimeZone).format("YYYY-MM-DD HH:mm:ss");
}

app.get("/", async (req, res) => {
  res.send("Bill API");
});

app.get("/customers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Customers");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching customers", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/customers", async (req, res) => {
  const { name, mobile, address, district, state, email, whatsapp } = req.body;

  if (
    !name ||
    !mobile ||
    !address ||
    !district ||
    !state ||
    !email ||
    !whatsapp
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO Customers (name, mobile, address, district, state, email, whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, mobile, address, district, state, email, whatsapp]
    );
    res.json({ message: "Customer added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error adding customer", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Products");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).send(err.message);
  }
});

const createTrigger = async () => {
  const triggerScript = `
    CREATE TRIGGER trg_InsertInvoiceItem
    ON [u258795027_bill].[dbo].[InvoiceItems]
    AFTER INSERT
    AS
    BEGIN
      UPDATE ii
      SET ii.ProductCode = p.ProductCode
      FROM [u258795027_bill].[dbo].[InvoiceItems] ii
      INNER JOIN inserted i ON ii.InvoiceItemId = i.InvoiceItemId
      INNER JOIN [u258795027_bill].[dbo].[Products] p ON i.ProductName = p.ProductName
    END
  `;

  try {
    const request = pool.query(triggerScript);
    await request;
    console.log("Trigger created successfully");
  } catch (err) {
    console.error("Error creating trigger:", err);
  }
};

pool.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  createTrigger();
});

app.post("/products", async (req, res) => {
  const { ProductName, Rate, Description, HsnCode, Igst } = req.body;

  if (!ProductName || !Rate || !HsnCode || !Igst) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await pool.query(
      `
      INSERT INTO Products (ProductName, Rate, Description, HsnCode, Igst, Date)
      VALUES (?, ?, ?, ?, ?, ?);`,
      [ProductName, Rate, Description, HsnCode, Igst, currentDate]
    );

    const productId = result.insertId; // Get the last inserted ID

    // Insert into Stocks table
    await pool.query(
      `
      INSERT INTO Stocks (ProductId, ProductName, Qty, Date)
      VALUES (?, ?, 0, ?)`,
      [productId, ProductName, currentDate]
    );

    res.send("Product added successfully");
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send(err.message);
  }
});

app.get("/stock", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM stocks");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching stock entries", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/stock", async (req, res) => {
  const { ProductName, qty, date } = req.body;

  try {
    if (!ProductName || !qty || !date) {
      throw new Error("ProductName, qty, and date are required");
    }

    const [productRows] = await pool.query(
      "SELECT ProductId FROM products WHERE ProductName = ?",
      [ProductName]
    );

    if (productRows.length === 0) {
      throw new Error("Product not found");
    }

    const productId = productRows[0].ProductId;
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const [stockRows] = await pool.query(
      "SELECT * FROM stocks WHERE ProductId = ?",
      [productId]
    );

    if (stockRows.length > 0) {
      await pool.query(
        "UPDATE stocks SET Qty = Qty + ?, Date = ? WHERE ProductId = ?",
        [qty, currentDate, productId]
      );
    } else {
      await pool.query(
        "INSERT INTO stocks (ProductId, ProductName, Qty, Date) VALUES (?, ?, ?, ?)",
        [productId, ProductName, qty, currentDate]
      );
    }

    res.json({ message: "Stock added successfully" });
  } catch (err) {
    console.error("Error adding stock", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/invoice", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Invoices");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching invoices", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/invoice", async (req, res) => {
  try {
    const { invoiceNumber, date, customerName, items } = req.body;

    // Validate input
    if (
      !invoiceNumber ||
      !date ||
      !customerName ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const momentDate = moment(date, "YYYY-MM-DD");
    if (!momentDate.isValid()) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const sqlDate = momentDate.format("YYYY-MM-DD");

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const currentDate = getCurrentDateTime();
      const [invoiceResult] = await conn.query(
        "INSERT INTO Invoices (InvoiceNumber, Date, CustomerName) VALUES (?, ?, ?)",
        [invoiceNumber, currentDate, customerName]
      );

      const invoiceId = invoiceResult.insertId;

      let subtotal = 0;
      for (const item of items) {
        const [productResult] = await conn.query(
          "SELECT ProductId FROM Products WHERE ProductName = ?",
          [item.productName]
        );

        const productId = productResult[0]?.ProductId;
        if (!productId) {
          throw new Error(
            `Product Id not found for product: ${item.productName}`
          );
        }

        const amount = item.qty * item.rate;
        subtotal += amount;

        await conn.query(
          `INSERT INTO InvoiceItems (InvoiceId, ProductName, ProductId, Qty, Rate, Amount, Total)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            invoiceId,
            item.productName,
            productId,
            item.qty,
            item.rate,
            amount,
            subtotal,
          ]
        );

        await conn.query(
          `UPDATE Stocks SET Qty = Qty - ? WHERE ProductId = ?`,
          [item.qty, productId]
        );
      }

      const tax = (subtotal * 0.08).toFixed(2);
      const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

      await conn.query(
        `UPDATE InvoiceItems SET Total = ? WHERE InvoiceId = ?`,
        [total, invoiceId]
      );

      await conn.commit();
      res
        .status(201)
        .json({ message: `Invoice created successfully with ID ${invoiceId}` });
    } catch (innerError) {
      await conn.rollback();
      console.error("Transaction error creating invoice:", innerError.message);
      res.status(500).json({ message: innerError.message });
    } finally {
      conn.release();
    }
  } catch (outerError) {
    console.error("Error creating invoice:", outerError.message);
    res.status(500).json({ message: outerError.message });
  }
});
