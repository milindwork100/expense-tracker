import api from "./api";

export const getTransactions = () => api.get("/transactions");

export const createTransaction = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  return api.post("/transactions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
