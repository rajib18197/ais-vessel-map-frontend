import GlobalStyles from "@/styles/global-styles";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import VesselTrackerPage from "@/pages/vessel-tracker/page";
import QueryProvider from "./providers/query-client";
import PageNotFound from "@/pages/page-not-found";

function App() {
  return (
    <QueryProvider>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          <Route Component={VesselTrackerPage} path="/" />
          <Route path="*" Component={PageNotFound} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
