const pool = require("../db.js");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { isValidUUID } = require("../checkUUID.js");
const {
   validationResult,
   matchedData,
   checkSchema,
} = require("express-validator");
const { createUserValidation } = require("../utils/validationUsers");

router.get("/", async function (req, res) {
   try {
      const user = await pool.query(`
         SELECT id,login 
         FROM users
         ORDER BY id ASC;
      `);
      return res.status(200).json({
         user: user.rows,
      });
   } catch (error) {
      console.log(`${error}`);
      await pool.query("ROLLBACK;");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

router.get("/:id", async function (req, res) {
   const id = req.params.id;
   try {
      if (isValidUUID(id) == false) return res.sendStatus(400);
      const user = await pool.query(
         `
         SELECT id,login
         FROM users 
         WHERE id = $1;
      `,
         [id]
      );
      if (user.rowCount == 0) return res.sendStatus(404);
      return res.status(200).json({
         user: user.rows,
      });
   } catch (error) {
      console.log(`${error}`);
      await pool.query("ROLLBACK;");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

router.post("/", checkSchema(createUserValidation), async function (req, res) {
   try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
         return res.status(400).send({
            errors: result.array(),
         });
      }
      const { login, password } = matchedData(req);
      await pool.query(
         `
         INSERT INTO users (
            id,
            login,
            password
         )
         VALUES (
            $1, $2, $3
         );
      `,
         [uuidv4(), login, password]
      );
      return res.sendStatus(201);
   } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK;");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id;
   try {
      if (isValidUUID(id) == false) return res.sendStatus(400);
      const deleteUser = await pool.query(
         `
         DELETE FROM users
         WHERE id = $1;
      `,
         [id]
      );
      if (deleteUser.rowCount == 0) return res.sendStatus(404);
      return res.sendStatus(204);
   } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

module.exports = router;
