import { Route, Routes } from "react-router-dom";
import JiraAuthLoading from "../pages/JiraAuthLoading";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/redirect" element={<JiraAuthLoading />} />
    </Routes>
  );
}
