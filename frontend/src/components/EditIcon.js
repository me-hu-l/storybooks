import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const EditIcon = ({ storyUser, loggedUser, storyId, floating }) => {
  if (storyUser._id.toString() === loggedUser._id.toString()) {
    if (floating) {
      return (
        <LinkContainer to={`/stories/edit/${storyId}`}>
          <Link>
            <a className="btn-floating halfway-fab blue">
              <i className="fas fa-edit fa-small"></i>
            </a>
          </Link>
        </LinkContainer>
      );
    } else {
      return (
        <LinkContainer to={`/stories/edit/${storyId}`}>
          <Link>
            <i className="fas fa-edit"></i>
          </Link>
        </LinkContainer>
      );
    }
  } else {
    return null; // or an empty string, depending on your preference
  }
};

export default EditIcon;
