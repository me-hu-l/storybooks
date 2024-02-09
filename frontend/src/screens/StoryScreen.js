import React from "react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { Button } from "react-bootstrap";
import { useGetSpecificStoryMutation } from "../slices/storiesApiSlice";
import { useParams } from "react-router-dom";
import EditIcon from "../components/EditIcon";

const StoryScreen = () => {
  const [getSpecificStory, { isLoading }] = useGetSpecificStoryMutation();

  const { userInfo } = useSelector((state) => state.auth);


  const [story, setStory] = useState();

  const { id } = useParams();

  useEffect(() => {
    const getStory = async () => {
      try {
        const res = await getSpecificStory({ id }).unwrap();
        setStory(res.stories);
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
      <div class="row">
        <div class="col s12 m8">
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
          <div class="card story">
            <div class="card-content">
              <span class="card-title">{story.createdAt}</span>
              {story.body}
            </div>
          </div>
        </div>
        <div class="col s12 m4">
          <div class="card center-align">
            <div class="card-content">
              <span class="card-title">{story.user.name}</span>
              <img src="logo512.png" class="circle responsive-img img-small" />
            </div>
            <div class="card-action">
              <a href={`/stories/user/${story.user._id}`}>
                More From {story.user.name}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryScreen;
