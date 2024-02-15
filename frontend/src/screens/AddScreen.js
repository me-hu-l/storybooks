import React, { useState, useEffect } from "react";
import { useAddStoryMutation } from "../slices/storiesApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { Form, Button } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { LinkContainer } from "react-router-bootstrap";

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
        body,
      }).unwrap();
      navigate("/dashboard");
      toast.success("Story Posted");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div>
      <h3>Add Story</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="body">
          <Form.Label>Tell Us Your Story:</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={body}
            onChange={(event, editor) => setBody(editor.getData())}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save
        </Button>
        <LinkContainer to="/dashboard">
          <Button variant="danger" className="ml-2">
            Cancel
          </Button>
        </LinkContainer>
      </Form>
    </div>
  );
};

export default AddScreen;
