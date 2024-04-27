import React, { useState } from "react";
import { Layout } from "antd";
import Chats from "../components/Chats";
import ChatBox from "../components/ChatBox";
import { useChatState } from "../components/context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";

const { Header, Content, Sider } = Layout;

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChatState();
  const theme = useTheme();
  const borderRadiusLG = theme.spacing(3);
  const colorBgContainer = "rgba(255,255,255,0.4)";

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Layout style={{ background: "transparent" }}>
      {user && <SideDrawer />}
      <Content style={{ margin: "16px 16px 16px", display: "flex" }}>
        <div
          style={{
            flex: "40%",
            height: "88vh",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {user && <Chats fetchAgain={fetchAgain} />}
        </div>
        {isLargeScreen && (
          <div
            style={{
              flex: "60%",
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              marginLeft: 16,
            }}
          >
            {user && (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ChatPage;
