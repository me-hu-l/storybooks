import React from 'react'
import { useState, useEffect } from "react";
import {
  useGetFollowingMutation,
  useUnfollowUserMutation,
} from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const Following = ({ userId }) => {
  const [following, setFollowing] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  //   const { userId } = useParams();

  const [getFollowing, { isLoading }] = useGetFollowingMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // toast.success(userId);
        const res = await getFollowing({ userId }).unwrap();
        setFollowing(res.following);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

    fetchData();
  }, []);

  const handleUnfollow = async (followingId) => {
    try {
      await unfollowUser({ targetUserId: followingId }).unwrap();
      const res = await getFollowing({ userId }).unwrap();
      setFollowing(res.following);
      toast.success("User unfollowed successfully!");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (!following) {
    return <Loader />;
  }

  return (
    <Container>
      {following.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unfollow</th>
            </tr>
          </thead>
          <tbody>
            {following.map((following) => (
              <tr key={following._id}>
                <LinkContainer to={`/stories/user/${following._id}`}>
                  <Link>
                    <td>{following.name}</td>
                  </Link>
                </LinkContainer>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUnfollow(following._id)}
                  >
                    'Unfollow'
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No following</div>
      )}
    </Container>
  );
}

export default Following