// src/data.js
export const initialData = {
    tasks: [
      { id: "1", title: "Task 1", description: "Description 1", dueDate: "2023-11-30", priority: "High" },
      { id: "2", title: "Task 2", description: "Description 2", dueDate: "2023-12-05", priority: "Medium" },
      { id: "3", title: "Task 3", description: "Description 3", dueDate: "2023-12-10", priority: "Low" },
      { id: "4", title: "Task 4", description: "Description 4", dueDate: "2023-12-15", priority: "High" },
    ],
    columns: {
      "1": {
        title: "TO DO",
        taskIds: ["1", "2"],
      },
      "2": {
        title: "DONE",
        taskIds: ["3"],
      },
      "3": {
        title: "IN REVIEW",
        taskIds: [],
      },
      "4": {
        title: "BACKLOG",
        taskIds: ["4"],
      },
    },
    columnOrder: ["1", "2", "3", "4"],
  };
  