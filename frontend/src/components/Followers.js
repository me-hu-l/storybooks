import React from "react";
import { useState, useEffect } from "react";
import {
  useGetFollowersMutation,
  useUnfollowUserMutation,
} from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const Followers = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  //   const { userId } = useParams();

  const [getFollowers, { isLoading }] = useGetFollowersMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // toast.success(userId);
        const res = await getFollowers({ userId }).unwrap();
        setFollowers(res.followers);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

    fetchData();
  }, []);

  if (!followers) {
    return <Loader />;
  }

  return (
    <Container>
      {followers.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {followers.map((follower) => (
              <tr key={follower._id}>
                <LinkContainer to={`/stories/user/${follower._id}`}>
                  <Link>
                    <td>{follower.name}</td>
                  </Link>
                </LinkContainer>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No followers</div>
      )}
    </Container>
  );
};

export default Followers;
