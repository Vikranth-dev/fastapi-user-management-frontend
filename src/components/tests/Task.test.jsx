import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Task from "../Task"; // adjust path if needed
import * as API from "../../services/api";

jest.mock("../../services/api");

const mockTasks = [
  { id: 1, title: "Test Task 1", completed: false },
  { id: 2, title: "Test Task 2", completed: true },
];

describe("Task Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    API.get.mockResolvedValue({ data: mockTasks });
  });

  test("renders tasks from API", async () => {
    render(<Task type="all" />);

    // If tasks are rendered as <option> in a <select>, query by role
    for (let task of mockTasks) {
      await waitFor(() => {
        expect(screen.getByText(task.title)).toBeInTheDocument();
      });
    }
  });

  test("marks a task complete", async () => {
    render(<Task type="all" />);

    // Find the checkbox by label (assuming <label>{task.title}</label> exists)
    const taskCheckbox = await screen.findByLabelText(/Test Task 1/i);
    fireEvent.click(taskCheckbox);

    expect(taskCheckbox.checked).toBe(true);
  });

  test("deletes a task", async () => {
    render(<Task type="all" />);

    // Find the delete button by accessible name
    const deleteButton = await screen.findByRole("button", { name: /delete task/i });
    fireEvent.click(deleteButton);

    // Optionally wait for UI update after deletion
    await waitFor(() => {
      expect(screen.queryByText("Test Task 1")).not.toBeInTheDocument();
    });
  });
});
