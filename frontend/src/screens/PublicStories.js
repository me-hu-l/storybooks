import React from "react";
import { useSelector } from "react-redux";
import { useGetPersonalStoriesMutation } from "../slices/rootApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
// import { Button } from "react-bootstrap";
import { useGetPublicStoriesMutation } from "../slices/storiesApiSlice";
import EditIcon from "../components/EditIcon";
import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const PublicStories = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [getPublicStories, { isLoading }] = useGetPublicStoriesMutation();

  const navigate = useNavigate();
  const [stories, setStories] = useState();

  useEffect(() => {
    const getStories = async () => {
      try {
        const res = await getPublicStories().unwrap();
        setStories(res.stories);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };
    // toast.success('helo from public stories')
    getStories();
  }, []);

  if (!stories) {
    return <Loader />;
  }

  return (
    <>
      <h1>Stories</h1>
      {stories.length ? (
        <div className="row">
          {stories.map((story, index) => (
            <div key={index} className="col-sm-12 col-md-4">
              <Card>
                {/* <Card.Img variant="top" src={story.image} alt="Story Image" /> */}
                <div className="position-relative">
                  <EditIcon
                    storyUser={story.user}
                    loggedUser={userInfo}
                    storyId={story._id}
                    floating={true}
                  />
                </div>
                <Card.Body>
                  <Card.Title>
                    <h3>{story.title}</h3>
                  </Card.Title>
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: story.body.substring(0, 50) + "...",
                    }}
                  />
                  <div className="chip">
                    <LinkContainer to={`/stories/user/${story.user._id}`}>
                      <Link>{story.user.name}</Link>
                    </LinkContainer>
                  </div>
                </Card.Body>
                <Card.Footer className="text-center">
                  <LinkContainer to={`/stories/${story._id}`}>
                    <Button variant="outline-secondary">Read More</Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No stories to display</p>
      )}
    </>
  );
};

export default PublicStories;
