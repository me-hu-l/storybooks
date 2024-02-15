import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetSpecificStoryMutation } from "../slices/storiesApiSlice";
import { useUpdateStoryMutation } from "../slices/storiesApiSlice";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { LinkContainer } from "react-router-bootstrap";

const EditScreen = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("public");
  const [body, setBody] = useState("");

  const [getSpecificStory, { isLoading1 }] = useGetSpecificStoryMutation();
  const [updateStory, { isLoading2 }] = useUpdateStoryMutation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await getSpecificStory({ id }).unwrap();
        res = res.stories[0];
        setTitle(res.title);
        setStatus(res.status);
        setBody(res.body);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await updateStory({
        title,
        status,
        body,
        id,
      }).unwrap();
      navigate("/dashboard");
      toast.success("Story Updated");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (isLoading1) {
    return <Loader />;
  }

  return (
    <div>
      <h3>Edit Story</h3>
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

export default EditScreen;
