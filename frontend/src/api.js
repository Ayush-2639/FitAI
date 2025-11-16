import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const chatWithAI = async (query) => {
  try {
    const response = await API.post("/ai/chat", { query });
    return response.data.response;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return "Server not responding. Please try again later.";
  }
};
