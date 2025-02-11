const express = require("express");
const { Pool } = require("pg");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "",
  port: 5432,
});
app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/suppliers", (req, res) => {
  pool.query("SELECT * FROM suppliers", (error, result) => {
    res.json(result.rows);
  });
});
app.get("/products", (req, res) => {
  const price = req.query.unit_price;
  const nameContain = req.query.name;
  if (!price && !nameContain) {
    pool.query("SELECT * FROM products", (error, result) => {
      res.json(result.rows);
    });
  } else {
    let query = "SELECT * FROM products  ";
    priceQuery = `WHERE unit_price > ${price}`;
    nameQuery = `WHERE product_name LIKE '%${nameContain}%'`;
    lastFive = `ORDER BY unit_price DESC LIMIT 5`;
    if (nameContain && price) {
      query += `${priceQuery} AND ${nameQuery}`;
    } else {
      if (nameContain) query += nameQuery;
      if (price) query += priceQuery;
      if (!price) query += lastFive;
  'SELECT product_name, supplier_name, unit_price FROM products AS p INNER JOIN suppliers AS s ON s.id=p.suppliers_id;'

    }
    
    console.log(query);
    pool
    .query(query)
    .then((result) => {
      res.json(result.rows);
    })
    .catch((e) => console.error(e));
  }
});

//task
// 1,2,
app.get("/customers", (req, res) => {
  const country = req.query.country;
  if (!country) {
    pool.query("SELECT * FROM customers ORDER BY name", (error, result) => {
      res.json(result.rows);
    });
  } else {
    pool
    .query(
      `SELECT name, address FROM customers WHERE country='${country}'`,
      )
      .then((result) => {
        res.json(result.rows);
      })
      .catch((e) => console.error(e));
    }
  });
  
  app.listen(3000, () =>
  console.log("Server is up and running at http://127.0.0.1:3000")
  );
