import moment from "moment";

const TOKEN_NAME = "j-challenge-auth-token";

export const getToken = () => {
  const item = localStorage.getItem(TOKEN_NAME);
  console.log("getToken", item);
  if (!item) return null;

  const record = JSON.parse(item);
  if (
    !record.timestamp ||
    !record.token ||
    moment(record.timestamp) - moment() < 0
  )
    return null;

  return record.token;
};

export const setToken = token => {
  console.log("setToken", token);
  const record = {
    token,
    timestamp: moment()
      .add({ days: 30 })
      .toJSON()
  };
  localStorage.setItem(TOKEN_NAME, JSON.stringify(record));
};

export const removeToken = () => {
  console.log("removeToken");
  localStorage.removeItem(TOKEN_NAME);
};
