import React from "react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
// import { Button } from "react-bootstrap";
import { useGetSpecificStoryMutation } from "../slices/storiesApiSlice";
import { useParams } from "react-router-dom";
import EditIcon from "../components/EditIcon";
import { Button, Card, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const StoryScreen = () => {
  const [getSpecificStory, { isLoading }] = useGetSpecificStoryMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [story, setStory] = useState();

  const { id } = useParams();

  useEffect(() => {
    const getStory = async () => {
      try {
        const res = await getSpecificStory({ id }).unwrap();
        setStory(res.stories[0]);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };
    getStory();
  }, []);

  if (!story) {
    return <Loader />;
  }

  return (
    <>
      <Row>
        <Col sm={12} md={8}>
          <h3>
            {story.title}
            <small>
              <EditIcon
                storyUser={story.user}
                loggedUser={userInfo}
                storyId={story._id}
                floating={false}
              />
            </small>
          </h3>
          <Card className="story">
            <Card.Body>
              <Card.Title>{story.createdAt}</Card.Title>
              <Card.Text dangerouslySetInnerHTML={{ __html: story.body }} />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{story.user.name}</Card.Title>
              <Card.Img
                src="logo512.png"
                className="rounded-circle responsive-img img-small"
              />
            </Card.Body>
            <Card.Footer>
              <LinkContainer to={`/stories/user/${story.user._id}`}>
                <Card.Link>More From {story.user.name}</Card.Link>
              </LinkContainer>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StoryScreen;
