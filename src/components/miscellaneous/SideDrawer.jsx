import {
  Button,
  Tooltip,
  Avatar,
  Row,
  Col,
  Dropdown,
  Menu,
  Drawer,
  Input,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserListItem from "../UserAvatar/UserListItem";
import { Triangle } from "react-loader-spinner";

const SideDrawer = () => {
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = useChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingchat, setLoadingchat] = useState(null);
  const navigate = useNavigate();

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);

  const logoutUser = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      message.warning("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast.error("Error occured while fetching users!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoadingchat(false);
      setSelectedChat(data);
      setDrawerVisible(false);
    } catch (error) {
      toast.error("Error occured while fetching the chat!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <Menu.Item key="1" onClick={() => setProfileModalVisible(true)}>
          <UserOutlined /> My Profile
        </Menu.Item>
      ),
    },
    {
      key: "2",
      label: (
        <Menu.Item key="2" onClick={logoutUser}>
          <LogoutOutlined /> Logout
        </Menu.Item>
      ),
    },
  ];

  return (
    <>
      <Header style={{ background: "rgba(255, 255, 255, 0.4)" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Tooltip placement="bottom" title="Search for user" color="black">
              <Button
                ghost
                icon={<SearchOutlined />}
                onClick={() => setDrawerVisible(true)}
              >
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
              <Dropdown menu={{ items }} placement="bottom" arrow>
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
      <Drawer
        title="Search Users"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Row gutter={[16, 0]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Search user by name or email"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </Col>
          <Col>
            <Button onClick={handleSearch}>GO</Button>
          </Col>
        </Row>
        {searchResults?.map((searchUser) => (
          <UserListItem
            key={searchUser._id}
            user={searchUser}
            handleFunction={() => accessChat(searchUser._id)}
            loading={loading}
          />
        ))}
        {loadingchat && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Triangle
              visible={true}
              height="40"
              width="40"
              color="black"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
      </Drawer>
    </>
  );
};

export default SideDrawer;
