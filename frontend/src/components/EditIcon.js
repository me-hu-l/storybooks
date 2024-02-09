import React, { useEffect } from 'react';
import { toast } from "react-toastify";


const EditIcon = ({ storyUser, loggedUser, storyId, floating }) => {

        
  if (storyUser._id.toString() === loggedUser._id.toString()) {
    if (floating) {
      return (
        <a href={`/stories/edit/${storyId}`} className="btn-floating halfway-fab blue">
          <i className="fas fa-edit fa-small"></i>
        </a>
      );
    } else {
      return (
        <a href={`/stories/edit/${storyId}`}>
          <i className="fas fa-edit"></i>
        </a>
      );
    }
  } else {
    return null; // or an empty string, depending on your preference
  }
};

export default EditIcon;