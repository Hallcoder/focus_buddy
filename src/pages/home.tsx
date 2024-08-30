import { useState } from "react";
import Navbar from "../components/navbar";
import Tab from "../components/tab";
import Tabs from "../components/tabs";
import ListingComponent from "../components/ListingComponent";
import FloatingActionButton from "../components/floatingActionButton";
import { useNavigate } from "react-router-dom";

function Home() {
  const [blackListedUrls, setBlackListedUrls] = useState([
    {
      id: "unique-id",
      url: "https://example.com",
      domain: "example.com",
      createdAt: "2024-08-13T12:34:56Z",
      updatedAt: "2024-08-13T12:34:56Z",
      active: true,
      notes: "Avoid visiting this site during work hours.",
    },
    {
      id: "unique-id",
      url: "https://example.com",
      domain: "example.com",
      createdAt: "2024-08-13T12:34:56Z",
      updatedAt: "2024-08-13T12:34:56Z",
      active: true,
      notes: "Avoid visiting this site during work hours.",
    },
  ]);
  const [chosenBuddies, setChosenBuddies] = useState([
    {
      id: "unique-buddy-id",
      userId: "unique-user-id",
      buddyId: "unique-buddy-id",
      buddyName: "John Doe",
      buddyEmail: "john.doe@example.com",
      addedAt: "2024-08-13T14:00:00Z",
      status: "active",
      permissions: {
        viewBlacklist: true,
        receiveAlerts: true,
        editBlacklist: false,
      },
      notificationSettings: {
        email: true,
        sms: false,
        frequency: "immediate",
      },
      relationshipNotes:
        "John is my best friend, and he agreed to help me stay focused.",
    },
    {
      id: "unique-buddy-id",
      userId: "unique-user-id",
      buddyId: "unique-buddy-id",
      buddyName: "John Doe",
      buddyEmail: "john.doe@example.com",
      addedAt: "2024-08-13T14:00:00Z",
      status: "active",
      permissions: {
        viewBlacklist: true,
        receiveAlerts: true,
        editBlacklist: false,
      },
      notificationSettings: {
        email: true,
        sms: false,
        frequency: "immediate",
      },
      relationshipNotes:
        "John is my best friend, and he agreed to help me stay focused.",
    },
  ]);
 
  return (
    <div className="flex flex-col border-4 h-full">
      <Navbar />
      <Tabs>
        <Tab label="Blacklisted URLs">
          {blackListedUrls.map((url) => {
            return <ListingComponent title={url.domain} subTitle={url.url} />;
          })}
        </Tab>
        <Tab label="Chosen Buddies">
          {chosenBuddies.map((buddy) => {
            return (
              <ListingComponent
                title={buddy.buddyName}
                subTitle={buddy.buddyEmail}
              />
            );
          })}
        </Tab>
      </Tabs>
    </div>
  );
}

export default Home;
