import React from "react";
import { Layout, Menu, theme } from "antd";
import Chats from "../components/Chats";
import ChatBox from "../components/ChatBox";
import { useChatState } from "../components/context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";

const { Header, Content, Sider } = Layout;

const ChatPage = () => {
  const { user } = useChatState();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const colorBgContainer = "rgba(255,255,255,0.4)";
  return (
    <Layout style={{ background: "transparent" }}>
      <SideDrawer />
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
          {user && <Chats />}
        </div>
        <div
          style={{
            flex: "60%",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginLeft: 16,
          }}
        >
          {user && <ChatBox />}
        </div>
      </Content>
    </Layout>
  );
};

export default ChatPage;
