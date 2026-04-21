import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for the demo, would be a DB or file in production
  // We'll use a local data.json file to persist data if we wanted, 
  // but for AI Studio simplicity and the "React Only" hint, 
  // I'll stick to a robust client-side storage + back-end skeleton.
  // Actually, I'll implement a real JSON-based storage on the server to fulfill "Full-Stack".
  
  const DATA_PATH = path.join(__dirname, "data.json");

  // Ensure data.json exists
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, JSON.stringify([], null, 2));
  }

  // API Routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const data = await fs.readFile(DATA_PATH, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const data = await fs.readFile(DATA_PATH, "utf-8");
      const invoices = JSON.parse(data);
      const newInvoice = { ...req.body, id: Math.random().toString(36).substr(2, 6).toUpperCase() };
      invoices.push(newInvoice);
      await fs.writeFile(DATA_PATH, JSON.stringify(invoices, null, 2));
      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const data = await fs.readFile(DATA_PATH, "utf-8");
      let invoices = JSON.parse(data);
      invoices = invoices.map((inv: any) => inv.id === id ? { ...inv, ...req.body } : inv);
      await fs.writeFile(DATA_PATH, JSON.stringify(invoices, null, 2));
      res.json({ message: "Updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update data" });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const data = await fs.readFile(DATA_PATH, "utf-8");
      let invoices = JSON.parse(data);
      invoices = invoices.filter((inv: any) => inv.id !== id);
      await fs.writeFile(DATA_PATH, JSON.stringify(invoices, null, 2));
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
