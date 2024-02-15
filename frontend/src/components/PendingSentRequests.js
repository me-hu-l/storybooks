import React from "react";
import { useState, useEffect } from "react";
import {
  useGetPendingSentRequestsMutation,
  useUnfollowUserMutation,
} from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const PendingSentRequests = () => {
  const [pendingSentRequests, setPendingSentRequests] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  //   const { userId } = useParams();

  const [getPendingSentRequests, { isLoading }] = useGetPendingSentRequestsMutation();
  // const [unfollowUser] = useUnfollowUserMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // toast.success(userId);
        const res = await getPendingSentRequests({ userId: userInfo._id }).unwrap();
        setPendingSentRequests(res.pendingSentRequests);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

    fetchData();
  }, []);

  if (!pendingSentRequests) {
    return <Loader />;
  }

  return (
    <Container>
      {pendingSentRequests.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {pendingSentRequests.map((request) => (
              <tr key={request._id}>
                <LinkContainer to={`/stories/user/${request._id}`}>
                  <Link>
                    <td>{request.name}</td>
                  </Link>
                </LinkContainer>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No pending sent requests</div>
      )}
    </Container>
  );
}

export default PendingSentRequests