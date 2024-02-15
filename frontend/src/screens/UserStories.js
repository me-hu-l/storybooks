import React from "react";
import { useSelector } from "react-redux";
import { useGetPersonalStoriesMutation } from "../slices/rootApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
// import { Button } from "react-bootstrap";
import { useGetPublicStoriesMutation } from "../slices/storiesApiSlice";
import { useGetUserStoriesMutation } from "../slices/storiesApiSlice";
import EditIcon from "../components/EditIcon";
import { useParams } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

const UserStories = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { userId } = useParams();

  const [getUserStories, { isLoading }] = useGetUserStoriesMutation();

  const [stories, setStories] = useState();

  useEffect(() => {
    const getStories = async () => {
      try {
        const res = await getUserStories({ userId }).unwrap();
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

  const storyUser = stories.length > 0 ? stories[0].user : null;

  return (
    <>
      <h1>Stories</h1>
      <Row>
        <Col sm={12} md={8}>
          <div className="row">
            {stories.map((story, index) => (
              <div key={index} className="col-sm-12 col-md-4">
                <Card>
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
        </Col>
        {storyUser && (
          <Col sm={12} md={4} className="d-none d-md-block">
            <Card>
              <Card.Body>
                <Card.Title>{storyUser.name}</Card.Title>
                <Card.Img
                  src="logo512.png"
                  className="rounded-circle responsive-img img-small"
                />
              </Card.Body>
              <Card.Footer>
                <LinkContainer to={`/stories/user/${storyUser._id}`}>
                  <Link>
                    <Card.Link>More from {storyUser.name}</Card.Link>
                  </Link>
                </LinkContainer>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
      {!storyUser && <p>No stories to display</p>}
    </>
  );
};

export default UserStories;
