import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders My App", () => {
  render(<App />);
  const linkElement = screen.getByText(/My App/i);
  expect(linkElement).toBeInTheDocument();
});
