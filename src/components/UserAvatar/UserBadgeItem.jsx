import { Chip, Stack } from "@mui/material";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Stack direction="row" spacing={1}>
      <Chip label={user.name} onDelete={handleFunction} variant="filled" />
    </Stack>
  );
};

export default UserBadgeItem;
