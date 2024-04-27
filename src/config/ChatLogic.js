export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[0].name : users[1].name;
};

export const senderFullName = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
