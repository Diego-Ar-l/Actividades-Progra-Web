import type { Request, Response } from "express";
import pool from "../conf/dbConnection.ts";
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ProductController {

    async getAll(req: Request, res: Response) {
        try {
            const activeParam = req.query.active;
            if (String(activeParam).toLowerCase() !== "true") {
                res.status(400).json({ message: "Query param 'active=true' es requerido" });
                return;
            }

            const [rows] = await pool.execute<RowDataPacket[]>(
                "SELECT * FROM products WHERE active = TRUE"
            );
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = +req.params.id!;
            if (!Number.isSafeInteger(id) || id <= 0) {
                res.status(400).json({ message: "ID invalido" });
                return;
            }

            const [rows] = await pool.execute<RowDataPacket[]>(
                "SELECT * FROM products WHERE id = ? AND active = TRUE",
                [id]
            );

            if (rows.length === 0) {
                res.status(404).json({ message: "Product not found or inactive" });
                return;
            }
            res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async createProduct(req: Request, res: Response) {
        try {
            const { name, price, stock, description, brand, img } = req.body ?? {};
            const numPrice = +price;
            const numStock = +stock;

            if (!name || typeof name !== "string") {
                res.status(400).json({ message: "Name is required" });
                return;
            }
            if (typeof price !== "number" || !Number.isFinite(numPrice) || numPrice <= 0 || Math.round(numPrice * 100) / 100 !== numPrice) {
                res.status(400).json({ message: "Price must be a number greater than 0 with up to 2 decimals" });
                return;
            }
            if (!Number.isInteger(numStock) || numStock < 0) {
                res.status(400).json({ message: "Stock must be an integer greater or equal to 0" });
                return;
            }
            if (!description || typeof description !== "string") {
                res.status(400).json({ message: "Description is required" });
                return;
            }

            const [result] = await pool.execute<ResultSetHeader>(
                `INSERT INTO products (name, price, stock, description, brand, img, active)
                 VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
                [name, numPrice, numStock, description, brand || null, img || null]
            );

            res.status(201).json({ message: "Product created", id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateProductById(req: Request, res: Response) {
        try {
            const id = +req.params.id!;
            if (!Number.isSafeInteger(id) || id <= 0) {
                res.status(400).json({ message: "ID invalido" });
                return;
            }

            const { name, price, stock, description, brand, img } = req.body ?? {};
            const numPrice = +price;
            const numStock = +stock;

            if (!name || typeof name !== "string") {
                res.status(400).json({ message: "Name is required" });
                return;
            }
            if (typeof price !== "number" || !Number.isFinite(numPrice) || numPrice <= 0 || Math.round(numPrice * 100) / 100 !== numPrice) {
                res.status(400).json({ message: "Price must be a number greater than 0 with up to 2 decimals" });
                return;
            }
            if (!Number.isInteger(numStock) || numStock < 0) {
                res.status(400).json({ message: "Stock must be an integer greater or equal to 0" });
                return;
            }
            if (!description || typeof description !== "string") {
                res.status(400).json({ message: "Description is required" });
                return;
            }

            const [result] = await pool.execute<ResultSetHeader>(
                `UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ?
                 WHERE id = ? AND active = TRUE`,
                [name, numPrice, numStock, description, brand || null, img || null, id]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Product not found or inactive" });
                return;
            }
            res.status(200).json({ message: "Product updated" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const id = +req.params.id!;
            if (!Number.isSafeInteger(id) || id <= 0) {
                res.status(400).json({ message: "ID invalido" });
                return;
            }

            const [result] = await pool.execute<ResultSetHeader>(
                "UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE",
                [id]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Product not found or already inactive" });
                return;
            }
            res.status(200).json({ message: "Product logically deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async changePrice(req: Request, res: Response) {
        try {
            const id = +req.params.id!;
            const body = req.body ?? {};
            const price = +body.price;

            if (!Number.isSafeInteger(id) || id <= 0) {
                res.status(400).json({ message: "ID invalido" });
                return;
            }
            if (Object.keys(body).length !== 1 || !("price" in body)) {
                res.status(400).json({ message: "Body must contain only price" });
                return;
            }
            if (typeof body.price !== "number" || !Number.isFinite(price) || price <= 0 || Math.round(price * 100) / 100 !== price) {
                res.status(400).json({ message: "Price must be a number greater than 0 with up to 2 decimals" });
                return;
            }

            const [result] = await pool.execute<ResultSetHeader>(
                "UPDATE products SET price = ? WHERE id = ? AND active = TRUE",
                [price, id]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Product not found or inactive" });
                return;
            }
            res.status(200).json({ message: "Price updated" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}