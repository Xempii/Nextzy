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
   createAnimeValidation,
   updateAnimeValidation,
} = require("../utils/validationAnime.js");

router.get("/", async function (req, res) {
   try {
      const animes = await pool.query(`
         SELECT * 
         FROM animes
         ORDER BY id ASC;
      `);
      if (animes.rowCount == 0) return res.sendStatus(404);
      return res.status(200).json({
         anime: animes.rows,
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
      const anime = await pool.query(
         `
         SELECT * FROM animes
         WHERE id = $1;
      `,
         [id]
      );
      if (anime.rowCount == 0) return res.sendStatus(404);
      return res.status(200).json({
         anime: anime.rows,
      });
   } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

router.post("/", checkSchema(createAnimeValidation), async function (req, res) {
   try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
         return res.status(400).send({
            errors: result.array(),
         });
      }
      const { name, year } = matchedData(req);
      await pool.query(
         `
         INSERT INTO animes (
            id,
            name,
            year,
            studioid
         )
         VALUES (
            $1,$2,$3,$4
         );
      `,
         [uuidv4(), name, year, null]
      );
      return res.sendStatus(201);
   } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK");
      return res.status(500).json({
         status: 500,
         message: "Internal Server Error",
      });
   }
});

router.put(
   "/:id",
   checkSchema(updateAnimeValidation),
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
         const { name, year, studioid } = matchedData(req);
         const anime = await pool.query(
            `
         UPDATE animes
         SET
            name = $1,
            year = $2,
            studioid = $3
         WHERE id = $4;
      `,
            [name, year, studioid, id]
         );
         if (anime.rowCount == 0) return res.sendStatus(404);
         return res.sendStatus(200);
      } catch (error) {
         console.log(error);
         await pool.query("ROLLBACK");
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
      const deleteAnime = await pool.query(
         `
         DELETE FROM animes 
         WHERE id = $1;
      `,
         [id]
      );
      if (deleteAnime.rowCount == 0) return res.sendStatus(404);
      await pool.query(
         `
         UPDATE chapters
         SET 
            animeid = NULL
         WHERE animeid = $1
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
