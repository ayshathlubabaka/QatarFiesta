import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";

const useStyles = styled({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

const leftChatBox = {
  backgroundColor: "#498dfc6e",
  padding: 2,
};

const rightChatBox = {
  backgroundColor: "#fcf1496e",
  padding: 2,
};

function ChatPage() {
  const { userId, eventId } = useParams();
  const navigate = useNavigate("");

  const [userChatHistory, setUserChatHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const classes = useStyles("div");
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const chatURL = process.env.REACT_APP_WS_BASE_URL;

  useEffect(() => {
    if (userId) {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        localStorage.setItem("redirect_url", window.location.href);
        navigate("/login", { replace: true });
      } else {
        const path = `${chatURL}/ws/chat/${userId}/${eventId}/?token=${access_token}`;
        const socket = new WebSocket(path);

        socket.onopen = () => {
          console.log("WebSocket open");
          setSocket(socket);
        };

        socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setChatMessages((prevChatMessages) => [...prevChatMessages, data]);
        };

        socket.onerror = (e) => {
          console.error(e);
        };

        socket.onclose = () => {
          console.log("WebSocket closed let's reopen");
        };
      }

      return () => {
        socket?.close();
        setChatMessages([]);
      };
    }
  }, [userId, eventId]);

  const getUserChatHistory = async (group_name = "", page = 1) => {
    try {
      const response = await fetch(
        `${baseURL}/api/chat/history/?group_name=${group_name}&page=${page}`
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData) {
          const reversedChatHistory = responseData.slice().reverse();
          console.log("Reversed Chat History:", reversedChatHistory);
          setUserChatHistory(reversedChatHistory);
          console.log("Updated userChatHistory:", userChatHistory);
        } else {
          console.error("Invalid chat history response:", responseData);
        }
      } else {
        console.error("Error fetching chat history:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);

      if (error.response?.status === 401) {
        // Handle unauthorized error
        console.log(error);
        return;
      }
    }
  };

  useEffect(() => {
    if (userId) {
      let group_name = `chat_${userId}-${eventId}`;
      getUserChatHistory((group_name = group_name));
    }
  }, [eventId]);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.send(
        JSON.stringify({
          message: message,
          current_user_id: userId,
          from_user: false,
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="row">
      <div className="col-md-2">
        <Sidebar />
      </div>

      {userId ? (
        <div
          className="container-fluid, border border-dark col-md-8"
          style={{ maxWidth: "60%", margin: "50px" }}
        >
          <ListItemText primary={userId.name}>{userId.name}</ListItemText>
          <Divider />
          <List
            className={classes.messageArea}
            sx={{ overflowY: "scroll", height: "50vh" }}
          >
            {userChatHistory.map((message, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={!message.from_user ? "right" : "left"}
                      primary={message.message}
                      sx={!message.from_user ? leftChatBox : rightChatBox}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={!message.from_user ? "right" : "left"}
                      secondary={message.timestamp}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}

            {chatMessages.map((message, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={!message.from_user ? "right" : "left"}
                      primary={message.message}
                      sx={!message.from_user ? leftChatBox : rightChatBox}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={!message.from_user ? "right" : "left"}
                      secondary={message.timestamp}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <IconButton
                color="primary"
                aria-label="add"
                onClick={sendMessage}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Box justifyContent={"center"}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR51aVXwnmZhzP_PZzW9IVQRMok5e5z4tUBQHfVPS0--Z_ADwV7NI2zB_f-QkPrpBKAJpE&usqp=CAU"
            alt=""
            style={{ maxWidth: "75%" }}
          />
        </Box>
      )}
    </div>
  );
}

export default ChatPage;
