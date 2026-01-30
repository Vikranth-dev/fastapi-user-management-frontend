
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginRegister from "../../pages/LoginRegister";
import * as API from "../../services/api";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../services/api"); // Mock the API module

describe("LoginRegister Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login/register headings and buttons", () => {
    render(
      <MemoryRouter>
        <LoginRegister />
      </MemoryRouter>
    );

    // Target headings specifically
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();

    // Target the submit buttons specifically
    expect(screen.getByRole("button", { name: /^Login$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Register$/i })).toBeInTheDocument();
  });

  test("calls API.login on form submit", async () => {
    API.login.mockResolvedValue({ data: { token: "123" } });

    render(
      <MemoryRouter>
        <LoginRegister />
      </MemoryRouter>
    );

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });

    // Submit the login form
    const submitButton = screen.getByRole("button", { name: /^Login$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(API.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password",
      });
    });
  });
});
