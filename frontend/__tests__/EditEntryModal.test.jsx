import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditEntryModal from "../src/components/EditEntryModal";
import api from "../src/utils/api";
import toast from "react-hot-toast";
import { vi } from "vitest";

// Mock the api and toast modules
vi.mock("../src/utils/api");
vi.mock("react-hot-toast");

const mockEntry = {
  id: 1,
  title: "Inception",
  type: "Movie",
  director: "Christopher Nolan",
  year: "2010",
  budget: "160000000",
  location: "Hollywood",
  image: "",
};

describe("EditEntryModal", () => {
  const onClose = vi.fn();
  const refreshEntries = vi.fn();
  const fetchUserMovies = vi.fn(); // mock function passed as prop

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders modal with pre-filled form data", () => {
    render(
      <EditEntryModal
        entry={mockEntry}
        onClose={onClose}
        refreshEntries={refreshEntries}
        fetchUserMovies={fetchUserMovies}
      />
    );

    expect(screen.getByDisplayValue("Inception")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Movie")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Christopher Nolan")).toBeInTheDocument();
  });

  test("shows error toast if required fields are empty", async () => {
    render(
      <EditEntryModal
        entry={mockEntry}
        onClose={onClose}
        refreshEntries={refreshEntries}
        fetchUserMovies={fetchUserMovies}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "" },
    });

    fireEvent.submit(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Title and Type are required!");
    });
  });

  test("calls API on submit and closes modal", async () => {
    api.put.mockResolvedValue({ data: {} });

    render(
      <EditEntryModal
        entry={mockEntry}
        onClose={onClose}
        refreshEntries={refreshEntries}
        fetchUserMovies={fetchUserMovies}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Interstellar" },
    });

    fireEvent.submit(screen.getByText("Save"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        `/movies/1`,
        expect.any(FormData),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      expect(toast.success).toHaveBeenCalledWith("Movie updated successfully!");
      expect(onClose).toHaveBeenCalled();
      expect(refreshEntries).toHaveBeenCalled();
      expect(fetchUserMovies).toHaveBeenCalled(); // verifies prop function is called
    });
  });

  test("shows error toast if API fails", async () => {
    api.put.mockRejectedValue(new Error("API failed"));

    render(
      <EditEntryModal
        entry={mockEntry}
        onClose={onClose}
        refreshEntries={refreshEntries}
        fetchUserMovies={fetchUserMovies}
      />
    );

    fireEvent.submit(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update movie");
    });
  });
});
