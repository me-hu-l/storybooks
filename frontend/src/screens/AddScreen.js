import React, { useState } from "react";
import { useAddStoryMutation } from "../slices/storiesApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";


const AddScreen = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("public");
  const [body, setBody] = useState("");

  const [addStory, { isLoading }] = useAddStoryMutation();
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await addStory({
        title,
        status,
        body
      }).unwrap();
      navigate('/dashboard')
      toast.success("Story Posted");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div>
      <h3>Add Story</h3>
      <div className="row">
        <form onSubmit={handleSubmit} className="col s12">
          <div className="row">
            <div className="input-field">
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title">Title</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field">
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <label htmlFor="status">Status</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field">
              <h5>Tell Us Your Story:</h5>
              <textarea
                id="body"
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="row">
            <button type="submit" className="btn">
              Save
            </button>
            <a href="/dashboard" className="btn orange">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScreen;
