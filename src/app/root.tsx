import GlobalStyles from "@/styles/global-styles";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import VesselTrackerPage from "@/pages/vessel-tracker/page";
import QueryProvider from "./providers/query-client";

function App() {
  return (
    <QueryProvider>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          <Route Component={VesselTrackerPage} path="/" />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
