import { Box, FormControl, Modal } from "@mui/material";
import { Button, Input } from "antd";
import React, { useState } from "react";
import { useChatState } from "../context/ChatProvider";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import {
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

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
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRemove = (delUser) => {};

  const handleRename = async () => {
    console.log("called");
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

      console.log(data._id);
      // setSelectedChat("");
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
              {isEditingName ? (
                <>
                  <h1
                    style={{
                      marginRight: "10px",
                      outline: "none",
                      cursor: "text",
                      maxWidth: "80%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    contentEditable
                    onBlur={(e) => {
                      setIsEditingName(false);
                      setGroupChatName(e.target.textContent);
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {selectedChat.chatName}
                  </h1>
                  <CloseCircleOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      setIsEditingName(false);
                      setGroupChatName(selectedChat.chatName);
                    }}
                  />
                  <CheckCircleOutlined
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename();
                    }}
                  />
                </>
              ) : (
                <>
                  <h1
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => setIsEditingName(true)}
                  >
                    {selectedChat.chatName.toUpperCase()}
                  </h1>
                  <EditOutlined onClick={() => setIsEditingName(true)} />
                </>
              )}
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
              <Input
                placeholder="Group name"
                style={{ marginBottom: 3 }}
                // onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: John Doe, Jane..."
                style={{ marginBottom: 1 }}
                // onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: 5,
              }}
            >
              {/* {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))} */}
            </div>
            {/* {loading ? (
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
            )} */}
            <Button ghost>Create Chat</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;
