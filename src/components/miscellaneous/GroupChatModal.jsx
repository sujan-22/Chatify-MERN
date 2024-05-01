import * as React from "react";
import Box from "@mui/material/Box";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatState } from "../context/ChatProvider";
import { FormControl, Input } from "@mui/material";
import axios from "axios";
import { Button } from "antd";
import { Triangle } from "react-loader-spinner";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const style = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgb(255,255,255,0.8)",
  boxShadow: 24,
  borderRadius: 2,
  p: 0,
  padding: "10px 0",
  gap: 2,
};

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setsearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user, chats, setChats } = useChatState();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${searchQuery}`,
        config
      );
      setLoading(false);
      setsearchResults(data);
    } catch (error) {
      toast.error("Failed to load searched user(s)!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("User already added", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemove = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handlSubmit = async () => {
    if (!groupChatName) {
      toast.warning("Please fill all the feilds", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast.warning("Please select at least 2 user", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      handleClose();
      toast.success("New group chat has been successfully created!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      setsearchResults([]);
      setSearchQuery("");
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to create chat", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ zIndex: 1000 }}
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 15,
              width: "80%",
            }}
          >
            <h2>Create Group Chat</h2>
            <FormControl>
              <Input
                placeholder="Group name"
                style={{ marginBottom: 3 }}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: John Doe, Jane..."
                style={{ marginBottom: 1 }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: 5,
              }}
            >
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Triangle
                  visible={true}
                  height="20"
                  width="20"
                  color="black"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            ) : (
              searchResults?.slice(0, 4).map((users) => (
                <div>
                  <UserListItem
                    key={users._id}
                    user={users}
                    handleFunction={() => handleGroup(users)}
                  />
                </div>
              ))
            )}
            <Button ghost onClick={handlSubmit}>
              Create Chat
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
