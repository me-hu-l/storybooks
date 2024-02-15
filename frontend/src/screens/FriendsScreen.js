import React, { useEffect, useState } from "react";
import { Tab, Tabs, Container } from "react-bootstrap";
import Followers from "../components/Followers";
import Following from "../components/Following";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FriendsScreen = () => {
  const [key, setKey] = useState("followers");
  const { userId } = useParams();
  return (
    <Container>
      <h2>Friends</h2>
      <Tabs
        id="friends-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="followers" title="Followers">
          <Followers userId={userId} />
        </Tab>
        <Tab eventKey="following" title="Following">
          <Following userId={userId}/>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default FriendsScreen;
