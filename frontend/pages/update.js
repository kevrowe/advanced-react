import React from "react";
import UpdateItem from "../components/UpdateItem";

export default props => {
  return (
    <div>
      <UpdateItem id={props.query.id} />
    </div>
  );
};
