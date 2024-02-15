import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

const AddIcon = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return null;
  }
  return (
    <LinkContainer to="/stories/add">
      <div className="fixed-action-btn">
        <a className="btn-floating btn-large waves-effect waves-light red">
          <i className="fas fa-plus"></i>
        </a>
      </div>
    </LinkContainer>
  );
};

export default AddIcon;
