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
const {
   createStudioValidation,
   updateStudioValidation,
} = require("../utils/validationStudio");

router.get("/", async function (req, res) {
   try {
      const stuidos = await pool.query(`
         SELECT * 
         FROM studios
         ORDER BY id ASC;
      `);
      if (stuidos.rowCount == 0) return res.sendStatus(404);
      return res.status(200).json({
         studio: stuidos.rows,
      });
   } catch (error) {
      console.log(error);
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
      const stuido = await pool.query(
         `
         SELECT * FROM studios
         WHERE id = $1;
      `,
         [id]
      );
      if (stuido.rowCount == 0) return res.sendStatus(404);
      return res.status(200).json({
         studio: stuido.rows,
      });
   } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK;");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

router.post(
   "/",
   checkSchema(createStudioValidation),
   async function (req, res) {
      try {
         const result = validationResult(req);
         if (!result.isEmpty()) {
            return res.status(400).send({
               errors: result.array(),
            });
         }
         const { name, website } = matchedData(req);
         await pool.query(
            `
            INSERT INTO studios (
               id,
               name,
               website
            )
            VALUES (
               $1,$2,$3
            );
         `,
            [uuidv4(), name, website]
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
   }
);

router.put(
   "/:id",
   checkSchema(updateStudioValidation),
   async function (req, res) {
      const id = req.params.id;
      try {
         if (isValidUUID(id) == false) return res.sendStatus(400);
         const result = validationResult(req);
         if (!result.isEmpty()) {
            return res.status(400).send({
               errors: result.array(),
            });
         }
         const { name, website } = matchedData(req);
         const studio = await pool.query(
            `
            UPDATE studios
            SET 
               name = $1,
               website = $2
            WHERE id = $3
      `,
            [name, website, id]
         );
         if (studio.rowCount == 0) return res.sendStatus(404);
         return res.sendStatus(200);
      } catch (error) {
         console.log(error);
         await pool.query("ROLLBACK;");
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         });
      }
   }
);

router.delete("/:id", async function (req, res) {
   const id = req.params.id;
   try {
      if (isValidUUID(id) == false) return res.sendStatus(400);
      const deleteChapter = await pool.query(
         `
         DELETE FROM studios 
         WHERE id = $1;
      `,
         [id]
      );
      if (deleteChapter.rowCount == 0) return res.sendStatus(404);
      await pool.query(
         `
         UPDATE animes
         SET 
            studioid = NULL
         WHERE studioid = $1
      `,
         [id]
      );
      await pool.query(
         `
         UPDATE chapters
         SET 
            studioid = NULL
         WHERE studioid = $1
      `,
         [id]
      );
      return res.sendStatus(204);
   } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK;");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

module.exports = router;
