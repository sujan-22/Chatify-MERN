import { Box, FormControl, Modal } from "@mui/material";
import { Button, Input, Space } from "antd";
import React, { useState } from "react";
import { useChatState } from "../context/ChatProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import UserListItem from "../UserAvatar/UserListItem";

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

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, children }) => {
  const { setSelectedChat, user, selectedChat } = useChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setsearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRemove = async (delUser) => {
    if (selectedChat.groupAdmin._id !== user._id && delUser._id !== user._id) {
      toast.error("Only group admin can remove someone", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: delUser._id,
        },
        config
      );
      setLoading(false);
      delUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error("Failed to remove user!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occured!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
    setIsEditingName(false);
  };

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

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already in group", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only group admin can add someone", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error("Failed to add searched user!", {
        position: "bottom-center",
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
            <Box style={{ display: "flex", alignItems: "center" }}>
              <h1
                style={{
                  marginRight: "10px",
                  outline: "none",
                  cursor: "text",
                  maxWidth: "80%",
                }}
              >
                {selectedChat.chatName}
              </h1>
            </Box>

            <Box>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  rowGap: 5,
                }}
              >
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
            </Box>
            <FormControl>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Chat Name"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  type="outlined"
                  onClick={handleRename}
                  loading={renameloading}
                >
                  Update
                </Button>
              </Space.Compact>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: John Doe, Jane..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: 2,
              }}
            ></div>
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
                    handleFunction={() => handleAddUser(users)}
                  />
                </div>
              ))
            )}
            <Button ghost>Leave Group</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;
