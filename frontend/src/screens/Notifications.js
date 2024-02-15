import React, { useState } from "react";
import { Tab, Tabs, Container } from "react-bootstrap";
import PendingRequests from "../components/PendingRequests";
import PendingSentRequests from "../components/PendingSentRequests";

const Notifications = () => {
  const [key, setKey] = useState("received");

  return (
    <Container>
      <h2>Notifications</h2>
      <Tabs
        id="notifications-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="received" title="Received">
          <PendingRequests />
        </Tab>
        <Tab eventKey="sent" title="Sent">
          <PendingSentRequests />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Notifications;