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
import { Button } from "react-bootstrap";
import { useDeleteStoryMutation } from "../slices/storiesApiSlice";

const DashBoard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [getPersonalStories, { isLoading }] = useGetPersonalStoriesMutation();
  const [deleteStory, {isLoading2}] = useDeleteStoryMutation();

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
      await deleteStory({storyId}).unwrap();
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
      <p>Here are you stories</p>
      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {stories.map((story, index) => (
            <tr>
              <td>
                <div className="ms-3">
                  <a href={`/stories/${story._id}`}>
                    <p className="fw-bold mb-1">{story.title}</p>
                  </a>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{story.createdAt}</p>
              </td>
              <td>
                {story.status === "public" ? (
                  <MDBBadge color="success" pill>
                    {story.status}
                  </MDBBadge>
                ) : (
                  <MDBBadge color="primary" pill>
                    {story.status}
                  </MDBBadge>
                )}
              </td>
              <td>
                <a href={`/stories/edit/${story._id}`}>
                  <Button variant="primary">Edit</Button>
                </a>
                <Button variant="danger" onClick={() => handleDelete(story._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </>
  );
};

export default DashBoard;
