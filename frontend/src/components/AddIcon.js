import React from "react";
import { useDispatch, useSelector } from "react-redux";

const AddIcon = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return null;
  }
  return (
    <div class="fixed-action-btn">
      <a
        href="/stories/add"
        class="btn-floating btn-large waves-effect waves-light red"
      >
        <i class="fas fa-plus"></i>
      </a>
    </div>
  );
};

export default AddIcon;
