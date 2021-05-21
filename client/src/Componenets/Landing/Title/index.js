import React from "react";

import "./styles.css";

export default function Title({ name, title, style }) {
  return (
    <div className="row">
      <div className="col-10 mx-auto my-2 text-center text-title">
        <h1 className="text-capitalize font-weight-bold" style={style? style : {fontSize: "2.4rem"}}>
          {name} <strong className="text-red">{title}</strong>
        </h1>
      </div>
    </div>
  );
}