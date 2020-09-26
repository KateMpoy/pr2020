var express = require("express");
var router = express.Router();
var md5 = require("md5");
var jwt = require("jsonwebtoken");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "password",
  database: "blog",
  insecureAuth: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connection Successful");
});

router.post("/register", async function (req, res, next) {
  try {
    let { username, email, password } = req.body;
    const hashed_password = md5(password.toString());
    const checkUsername = `Select username FROM users WHERE username = ?`;
    const checkId = `Select id FROM users WHERE username = ?`;

    con.query(checkUsername, [username], (err, result, fields) => {
      if (!result.length) {
        const sql = `Insert Into users (username, email, password) VALUES ( ?, ?, ? )`;
        con.query(
          sql,
          [username, email, hashed_password],
          (err, result, fields) => {
            if (err) {
              res.send({ status: 0, data: err });
            } else {
              let token = jwt.sign({ data: result }, "secret");
              res.send({ status: 1, data: result, token: token });
            }
          }
        );
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    const hashed_password = md5(password.toString());
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    con.query(sql, [username, hashed_password], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/addBlog", async function (req, res, next) {
  try {
    let { username, email, password, blogName } = req.body;
    const checkId = `Select id FROM users WHERE username = ?`;

    con.query(checkId, [username], (err, result, fields) => {
      if (result.length) {
        const sql = `Insert Into blogs (blogName, userId) VALUES ( ?, ?)`;
        con.query(sql, [blogName, result[0].id], (err, result, fields) => {
          if (err) {
            res.send({ status: 0, data: err });
          } else {
            let token = jwt.sign({ data: result }, "secret");
            res.send({ status: 1, data: result, token: token });
          }
        });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/getCategories", async function (req, res, next) {
  try {
    let { email, id, password, username } = req.body;
    const sql = `SELECT * FROM blogs WHERE userId = ?`;
    con.query(sql, [id], function (err, result, fields) {
      if (result.length) {
        const sql = `SELECT * FROM categories WHERE blogId = ?`;
        con.query(sql, [result[0].blogId], function (err, result, fields) {
          if (err) {
            res.send({ status: 0, data: err });
          } else {
            let token = jwt.sign({ data: result }, "secret");
            res.send({ status: 1, data: result, token: token });
          }
        });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/getBlog", async function (req, res, next) {
  try {
    let { email, id, password, username } = req.body;
    const sql = `SELECT * FROM blogs WHERE userId = ?`;
    con.query(sql, [id], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/addCategory", async function (req, res, next) {
  try {
    let { blogId, categoryName, description } = req.body;
    const checkId = `Select categoryName FROM categories WHERE categoryName = ? AND blogId = ?`;

    con.query(checkId, [categoryName, blogId], (err, result, fields) => {
      if (!result.length) {
        const sql = `Insert Into categories (categoryName, catDescription, blogId) VALUES ( ?, ?, ?)`;
        con.query(
          sql,
          [categoryName, description, blogId],
          (err, result, fields) => {
            if (err) {
              res.send({ status: 0, data: err });
            } else {
              let token = jwt.sign({ data: result }, "secret");
              res.send({ status: 1, data: result, token: token });
            }
          }
        );
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/deleteCategory", async function (req, res, next) {
  try {
    let { blogId, catDescription, categoryName, categoryid } = req.body;
    const sql = `DELETE FROM categories WHERE categoryid = ?`;
    con.query(sql, [categoryid], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/saveCategory", async function (req, res, next) {
  try {
    let { blogId, catDescription, categoryName, categoryid } = req.body;
    const sql = `UPDATE categories SET categoryName = ? , catDescription = ? WHERE categoryid = ?`;
    con.query(sql, [categoryName, catDescription, categoryid], function (
      err,
      result,
      fields
    ) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/getPosts", async function (req, res, next) {
  try {
    let { email, blogId, password, username } = req.body;

    const sql = `SELECT  * FROM posts WHERE blogId = ? ORDER BY postDate DESC limit 10`;
    con.query(sql, [blogId], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/addPost", async function (req, res, next) {
  try {
    let { body, title, selected, postDate, blogId } = req.body;
    console.log(selected);
    const sql = `Insert Into posts (title, body, postDate, blogId) VALUES ( ?, ?, ?, ?)`;
    con.query(sql, [title, body, postDate, blogId], (err, result, fields) => {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
        console.log(result.insertId);

        selected.forEach((element) => {
          const sql = `Insert Into posts_categories (postId, categoryId) VALUES ( ?, ?)`;
          con.query(sql, [result.insertId, element.categoryid], function (
            err,
            result2,
            fields
          ) {
            if (err) {
              res.send({ status: 0, data: err });
            } else {
              console.log("success");
            }
          });
        });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/deletePost", async function (req, res, next) {
  try {
    let { blogId, catDescription, categoryName, postId } = req.body;
    const sql = `DELETE FROM posts WHERE postId = ?`;
    con.query(sql, [postId], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/savePost", async function (req, res, next) {
  try {
    let { title, body, categoryName, postId } = req.body;
    const sql = `UPDATE posts SET title = ? , body = ? WHERE postId = ?`;
    con.query(sql, [title, body, postId], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/getCategoriesofPost", async function (req, res, next) {
  try {
    let { email, postId, password, username } = req.body;

    const sql = `SELECT  categoryId FROM posts_categories WHERE postId = ?`;
    con.query(sql, [postId], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/getCategories2", async function (req, res, next) {
  try {
    let { email, categoryId, password, username } = req.body;
    const sql = `SELECT * FROM categories WHERE categoryId = ?`;
    con.query(sql, [categoryId], function (err, result, fields) {
      if (result.length) {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post("/search", async function (req, res, next) {
  try {
    let { email, blogId, password, searchText } = req.body;

    const sql = `SELECT * FROM posts WHERE title LIKE '%${searchText}%'`;
    con.query(sql, [searchText], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

module.exports = router;
