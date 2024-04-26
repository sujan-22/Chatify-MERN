import { Avatar, Card, Skeleton } from "antd";

const UserListItem = ({ user, handleFunction, loading }) => {
  return (
    <Card
      onClick={handleFunction}
      hoverable
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
        borderRadius: "8px",
        height: 60,
      }}
    >
      {loading ? (
        <Skeleton.Avatar active size="medium" shape="circle" />
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar size="medium" src={user.profilePic} />
          <div style={{ marginLeft: "10px" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>{user.name}</p>{" "}
            <p style={{ margin: 0 }}>{user.email}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserListItem;
