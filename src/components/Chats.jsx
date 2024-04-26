import React, { useEffect, useState } from "react";
import { useChatState } from "./context/ChatProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Skeleton, Space } from "antd";
import { getSender } from "../config/ChatLogic";
import { PlusOutlined } from "@ant-design/icons";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const Chats = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      console.log(data);
      setChats(data);
    } catch (error) {
      toast.error("Error occured", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          fontSize: "18px",
          fontFamily: "Work sans",
          width: "100%",
        }}
      >
        <span>Inbox</span>
        <GroupChatModal>
          <Button ghost style={{ fontSize: "15px" }} icon={<PlusOutlined />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </div>
      <div style={{ overflowY: "hidden", maxHeight: "calc(100vh - 150px)" }}>
        {chats ? (
          <Space direction="vertical" style={{ width: "100%" }}>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                style={{
                  cursor: "pointer",
                  background:
                    selectedChat === chat ? "rgb(0,0,0,62%)" : "white",
                  color: selectedChat === chat ? "white" : "black",
                  padding: "10px 16px",
                  borderRadius: "5px",
                }}
              >
                <span>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </span>
                {chat.latestMessage && (
                  <span style={{ fontSize: "12px" }}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </span>
                )}
              </div>
            ))}
          </Space>
        ) : (
          <Skeleton active />
        )}
      </div>
    </Space>
  );
};

export default Chats;
