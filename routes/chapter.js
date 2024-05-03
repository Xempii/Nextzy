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
   createChapterValidation,
   updateChapterValidation,
} = require("../utils/validationChapter.js");

router.get("/", async function (req, res) {
   try {
      const chapters = await pool.query(`
         SELECT * 
         FROM chapters
         ORDER BY id ASC;
      `);

      return res.status(200).json({
         chapter: chapters.rows,
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
      const chapter = await pool.query(
         `
         SELECT * 
         FROM chapters
         WHERE id = $1;
      `,
         [id]
      );
      if (chapter.rowCount == 0) return res.sendStatus(404);
      return res.status(200).json({
         chapter: chapter.rows,
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
   checkSchema(createChapterValidation),
   async function (req, res) {
      try {
         const result = validationResult(req);
         if (!result.isEmpty()) {
            return res.status(400).send({
               errors: result.array(),
            });
         }
         const { name, duration } = matchedData(req);
         await pool.query(
            `
         INSERT INTO chapters (
            id,
            name,
            studioid,
            animeid,
            duration
         )
         VALUES (
            $1,$2,$3,$4,$5
         )
      `,
            [uuidv4(), name, null, null, duration]
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
   }
);

router.put(
   "/:id",
   checkSchema(updateChapterValidation),
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
         const { name, studioid, animeid, duration } = matchedData(req);
         const chapter = await pool.query(
            `
         UPDATE chapters
         SET 
            name = $1, 
            studioid = $2,
            animeid = $3,
            duration = $4
         WHERE id = $5;
      `,
            [name, studioid, animeid, duration, id]
         );
         if (chapter.rowCount == 0) return res.sendStatus(404);
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
         DELETE FROM chapters 
         WHERE id = $1;
      `,
         [id]
      );
      if (deleteChapter.rowCount == 0) return res.sendStatus(404);
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
