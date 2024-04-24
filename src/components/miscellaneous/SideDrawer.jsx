import {
  Button,
  Layout,
  Tooltip,
  Avatar,
  Row,
  Col,
  Dropdown,
  Menu,
} from "antd";
import { SearchOutlined, BellOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal"; // Importing the ProfileModal component

const SideDrawer = () => {
  const { user } = useChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingchat, setLoadingchat] = useState(null);

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setProfileModalVisible(true)}>
        My Profile
      </Menu.Item>
      <Menu.Item key="2">Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header style={{ background: "rgba(255, 255, 255, 0.4)" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Tooltip placement="bottom" title="Search for user" color="black">
              <Button ghost icon={<SearchOutlined />}>
                Search
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <h1 style={{ textAlign: "center", margin: 0 }}>CHATIFY</h1>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BellOutlined style={{ marginRight: 10, fontSize: 20 }} />
              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar
                  size="large"
                  style={{ cursor: "pointer" }}
                  src={user.data.profilePic}
                />
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Header>
      <ProfileModal
        user={user}
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </>
  );
};

export default SideDrawer;
