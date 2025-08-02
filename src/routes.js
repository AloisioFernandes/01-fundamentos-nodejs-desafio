import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { search } = req.query;

      const tasks = await database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      if (!req.body || !req.body.title || !req.body.description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({
              message: "Provide a title and description for the task",
            })
          );
      }
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;

      if (!req.body || (!req.body.title && !req.body.description)) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Provide a title or description for the task",
          })
        );
      }

      const { title = "", description = "" } = req.body;

      const tasks = await database.select("tasks", { id });

      if (tasks.length === 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }

      database.update("tasks", id, {
        ...tasks[0],
        title: title || tasks[0].title,
        description: description || tasks[0].description,
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;

      const tasks = await database.select("tasks", { id });

      if (tasks.length === 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;

      const tasks = await database.select("tasks", { id });

      if (tasks.length === 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }

      database.update("tasks", id, {
        ...tasks[0],
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    }
  }
];
