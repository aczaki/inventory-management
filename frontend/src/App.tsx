import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await api.get("/dashboard");

        console.log("Dashboard API:", response.data);

        setStatus("API Connected");
      } catch (error) {
        console.error("API Error:", error);

        setStatus("API Connection Failed");
      }
    };

    testApi();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory Management System
        </h1>

        <p className="mt-2 text-gray-600">
          API Status:{" "}
          <span className="font-medium text-gray-900">{status}</span>
        </p>
      </div>
    </div>
  );
}

export default App;