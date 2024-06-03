import React from "react";
import "../styles/PageInfo.css";

let title = "Checkings Account";

function PageTitle({ title }, { amount }) {
  return (
    <div className="title-region">
      <div className="page-title">{title}</div>
      <div className="amount">{amount}</div>
    </div>
  );
}

export default PageTitle;
