import { BrowserRouter, Route, Routes } from "react-router-dom";
import TransactionPage from "./TransactionPage";
import EasyMode from "./EasyMode";
import WrongSite from "./ErrorPage";

export default function PagesRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EasyMode />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="*" element={<WrongSite />} />
      </Routes>
    </BrowserRouter>
  );
}
