import express from "express";
import * as db from "./util/database.js";
import cors from 'cors'
import bodyParser from 'body-parser';

const PORT = 3000;
const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json())

app.get("/blog", (req, res) => {
	try {
		const blogs = db.getAllBlog();
		res.status(200).json(blogs);
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.get("/blog/:id", (req, res) => {
	try {
		const blog = db.getBlogById(req.params.id);
		if (!blog) {
			return res.status(404).json({ message: "Blog is not found" });
		}
		res.status(200).json(blog);
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.post("/blog", (req, res) => {
	try {
		const { szerzo, cim, kategoria, content } = req.body;
		if (!szerzo || !cim || !kategoria || !content) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const savedBlog = db.createBlog(szerzo, cim, kategoria, content);
		if (savedBlog.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(201).json({ id: savedBlog.lastInsertRowid, szerzo, cim, kategoria, content });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.put("/blog/:id", (req, res) => {
	try {
		const { szerzo, cim, kategoria, content } = req.body;
		if (!szerzo || !cim || !kategoria || !content) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const id = req.params.id;
		const updatedBlog = db.updateBlog(id, szerzo, cim, kategoria, content);
		if (updatedBlog.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(200).json({ szerzo, cim, kategoria, content });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.delete("/blog/:id", (req, res) => {
	try {
		const deletedBlog = db.deleteBlog(req.params.id);
		if (deletedBlog.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(200).json({ message: "Delete successful" });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));