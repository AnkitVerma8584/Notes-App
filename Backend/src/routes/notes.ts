import express from "express";
import * as NotesController from "../controllers/notes";

const router = express.Router();

router.get("/:noteId", NotesController.getNote);

router.get("/", NotesController.getNotes);

router.post("/", NotesController.createNotes);

router.patch("/:noteId", NotesController.updateNote);

router.delete("/:noteId", NotesController.deleteNote);

export default router;