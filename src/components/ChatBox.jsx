import React from "react";
import Box from "@mui/material/Box";
import { useChatState } from "./context/ChatProvider";
import SingleChat from "./SingleChat";
// import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, user } = useChatState();

  return (
    <Box
      display={{ xs: selectedChat ? "flex" : "none", sm: "flex" }}
      alignItems="center"
      flexDirection="column"
      bgcolor="white"
      width={{ xs: "100%", md: "100%" }}
      borderRadius={4}
      height={{ xs: "100%", md: "100%" }}
    >
      {user && (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </Box>
  );
};

export default Chatbox;
