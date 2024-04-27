import React, { useState } from "react";
import { useChatState } from "./context/ChatProvider";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
} from "@mui/material";
import { LeftOutlined, EyeOutlined, SendOutlined } from "@ant-design/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import { senderFullName } from "../config/ChatLogic";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useChatState("");
  const [message, setMessage] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const handleBack = () => {};

  const handleToggleVisibility = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleMessageSend = async () => {};

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width={"100%"}
            p={2}
            borderBottom={"1px dashed black"}
          >
            {isSmallScreen && (
              <IconButton
                onClick={handleBack}
                style={{
                  marginRight: "auto",
                  display: !isSmallScreen ? "" : "none",
                }}
              >
                <LeftOutlined />
              </IconButton>
            )}
            {!selectedChat.isGroupChat ? (
              <Typography
                variant="h6"
                align="center"
                style={{ flexGrow: 1, fontWeight: "bold" }}
              >
                {senderFullName(user, selectedChat.users).name}
              </Typography>
            ) : (
              <>
                {
                  <Typography
                    variant="h6"
                    align="center"
                    style={{ flexGrow: 1, fontWeight: "bold" }}
                  >
                    {selectedChat.chatName.toUpperCase()}
                  </Typography>
                }
              </>
            )}
            {selectedChat.isGroupChat ? (
              <>
                <UpdateGroupChatModal>
                  <IconButton style={{ marginLeft: "auto" }}>
                    <EyeOutlined />
                  </IconButton>
                </UpdateGroupChatModal>
              </>
            ) : (
              <IconButton
                onClick={handleToggleVisibility}
                style={{ marginLeft: "auto" }}
              >
                <EyeOutlined />
              </IconButton>
            )}
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography textAlign="center" variant="h5">
            Click on user to start chatting!
          </Typography>
        </Box>
      )}
      {selectedChat && (
        <ProfileModal
          user={senderFullName(user, selectedChat.users)}
          visible={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
};

export default SingleChat;
