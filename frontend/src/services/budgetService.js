import api from "./api";

export const getBudgets = (month, year) =>
  api.get(`/budgets?month=${month}&year=${year}`);
export const setBudget = (data) => api.post("/budgets", data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);
