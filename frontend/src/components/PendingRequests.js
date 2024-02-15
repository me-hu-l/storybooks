import React from "react";
import { useState, useEffect } from "react";
import {
  useGetPendingRequestsMutation,
  useAcceptFollowRequestMutation,
  useRejectFollowRequestMutation
} from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  //   const { userId } = useParams();

  const [getPendingRequests, { isLoading }] = useGetPendingRequestsMutation();
  const [acceptFollowRequest] = useAcceptFollowRequestMutation();
  const [rejectFollowRequest] = useRejectFollowRequestMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // toast.success(userId);
        const res = await getPendingRequests({ userId:userInfo._id }).unwrap();
        setPendingRequests(res.pendingRequests);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (followerUserId) => {
    try {
      await acceptFollowRequest({ followerUserId }).unwrap();
      const res = await getPendingRequests({ userId: userInfo._id }).unwrap();
      setPendingRequests(res.pendingRequests);
      toast.success("requests accepted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleReject = async (followerUserId) => {
    try {
      await rejectFollowRequest({ followerUserId }).unwrap();
      const res = await getPendingRequests({ userId: userInfo._id }).unwrap();
      setPendingRequests(res.pendingRequests);
      toast.success("requests rejected successfully!");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (!pendingRequests) {
    return <Loader />;
  }

  return (
    <Container>
      {pendingRequests.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request._id}>
                <LinkContainer to={`/stories/user/${request._id}`}>
                  <Link>
                    <td>{request.name}</td>
                  </Link>
                </LinkContainer>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAccept(request._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No pending requests</div>
      )}
    </Container>
  );
}

export default PendingRequests