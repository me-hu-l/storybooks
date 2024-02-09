import React from "react";
import { useSelector } from "react-redux";
import { useGetPersonalStoriesMutation } from "../slices/rootApiSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { Button } from "react-bootstrap";
import { useGetPublicStoriesMutation } from "../slices/storiesApiSlice";
import EditIcon from "../components/EditIcon";

const PublicStories = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [getPublicStories, { isLoading }] = useGetPublicStoriesMutation();

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
        <div class="row">
          {stories.map((story, index) => {
            return (
              <div class="col s12 m4">
                <div class="card">
                  <div class="card-image">
                    <EditIcon
                      storyUser={story.user}
                      loggedUser={userInfo}
                      storyId={story._id}
                      floating={true}
                    />
                  </div>
                  <div class="card-content center-align">
                    <h5>{story.title}</h5>
                    <br />
                    <div class="chip">
                      <p>{story.body}</p>
                      <a href={`/stories/user/${story.user._id}`}>
                        {story.user.name}
                      </a>
                    </div>
                  </div>
                  <div class="card-action center-align">
                    <a href={`/stories/${story._id}`} class="btn grey">
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No stories to display</p>
      )}
    </>
  );
};

export default PublicStories;
