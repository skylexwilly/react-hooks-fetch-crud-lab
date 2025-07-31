 // src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:4000/questions", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          prompt: "Lorem Testum 1",
          answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
          correctIndex: 1
        },
        {
          id: 2,
          prompt: "Lorem Testum 2",
          answers: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
          correctIndex: 2
        }
      ])
    );
  }),

  rest.post("http://localhost:4000/questions", async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(201), ctx.json({ ...body, id: Date.now() }));
  }),

  rest.delete("http://localhost:4000/questions/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.patch("http://localhost:4000/questions/:id", async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(200), ctx.json(body));
  }),
];
