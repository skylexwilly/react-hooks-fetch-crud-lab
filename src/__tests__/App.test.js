 import '@testing-library/jest-dom';

 import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
 import App from "../components/App"; // ✅ correct


beforeEach(() => {
  // Mock fetch for all API calls
  global.fetch = jest.fn((url, options) => {
    // GET all questions
    if (url === "http://localhost:4000/questions" && !options) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              prompt: "Mock Question 1?",
              answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
              correctIndex: 0,
            },
          ]),
      });
    }

    // POST new question
    if (url === "http://localhost:4000/questions" && options.method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            ...JSON.parse(options.body),
          }),
      });
    }

    // DELETE a question
    if (url === "http://localhost:4000/questions/1" && options.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }

    // PATCH correct answer
    if (url === "http://localhost:4000/questions/1" && options.method === "PATCH") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            prompt: "Mock Question 1?",
            answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
            correctIndex: 1,
          }),
      });
    }

    return Promise.reject("Unhandled request: " + url);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("Add Question"));

  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "New Question?" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "Option A" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "Option B" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: "Option C" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: "Option D" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "2" },
  });

  fireEvent.click(screen.getByText("Submit"));

  // Wait until the Add Question page returns
 await screen.findByText("Add Question");


  fireEvent.click(screen.getByText("View Questions"));

  // Ensure new question appears
  expect(await screen.findByText("New Question?")).toBeInTheDocument();
});
 
test("deletes the question when the delete button is clicked", async () => {
  render(<App />);

  const question = await screen.findByText("Mock Question 1?");
  expect(question).toBeInTheDocument();

  const deleteButton = screen.getByText("Delete Question"); // Make sure this line exists
  fireEvent.click(deleteButton);

  await waitFor(() =>
    expect(screen.queryByText("Mock Question 1?")).not.toBeInTheDocument()
  );
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));

  const dropdowns = await screen.findAllByRole("combobox");
  expect(dropdowns.length).toBeGreaterThan(0);

  fireEvent.change(dropdowns[0], { target: { value: "1" } });

  await waitFor(() => expect(dropdowns[0].value).toBe("1"));
});
