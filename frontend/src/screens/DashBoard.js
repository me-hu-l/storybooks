import React from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { useGetPersonalStoriesMutation } from "../slices/rootApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
// import { Button } from "react-bootstrap";
import { useDeleteStoryMutation } from "../slices/storiesApiSlice";
import { Button, Badge, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

const DashBoard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [getPersonalStories, { isLoading }] = useGetPersonalStoriesMutation();
  const [deleteStory, { isLoading2 }] = useDeleteStoryMutation();

  const [stories, setStories] = useState();

  useEffect(() => {
    const getStories = async () => {
      try {
        const res = await getPersonalStories().unwrap();
        setStories(res.stories);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

    getStories();
  }, []);

  const handleDelete = async (storyId) => {
    try {
      await deleteStory({ storyId }).unwrap();
      toast.success("Story deleted successfully");
      // After successful deletion, fetch stories again or update state accordingly
      // Here, I'm refetching the stories for simplicity
      const res = await getPersonalStories().unwrap();
      setStories(res.stories);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (!stories) {
    return <Loader />;
  }

  return (
    <>
      <h6>Dashboard</h6>
      <h3>Welcome {userInfo.name}</h3>
      <p>Here are your stories</p>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story, index) => (
            <tr key={index}>
              <td>
                <div className="ms-3">
                  <LinkContainer to={`/stories/${story._id}`}>
                    <Link>
                      <p className="fw-bold mb-1">{story.title}</p>
                    </Link>
                  </LinkContainer>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{story.createdAt}</p>
              </td>
              <td>
                {story.status === "public" ? (
                  <Badge bg="success" style={{ color: "white" }}>
                    {story.status}
                  </Badge>
                ) : (
                  <Badge bg="primary" style={{ color: "white" }}>
                    {story.status}
                  </Badge>
                )}
              </td>
              <td>
                <LinkContainer to={`/stories/edit/${story._id}`}>
                  <Link>
                  <Button variant="primary">Edit</Button>
                  </Link>
                </LinkContainer>
                
                <Button
                  variant="danger"
                  onClick={() => handleDelete(story._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default DashBoard;
