import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { makeStyles } from '@mui/styles';
import { Container, Paper, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  paper: {
    width: '100%',
    maxWidth: '600px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'row',
    height: '500px',
  },
  memberList: {
    width: '200px',
  },
  chatContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatMessages: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  messageInput: {
    display: 'flex',
  },
  messageField: {
    flexGrow: 1,
  },
  selfMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
}));

let stompClient = null;

const ChatRoom = () => {
  const classes = useStyles();
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState('CHATROOM');
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: '',
    accessToken: '', // Added accessToken to userData
  });

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect(
      { Authorization: `Bearer ${loginInfo.accessToken}` }, // Added Authorization header
      onConnected,
      onError
    );
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(
      '/chatroom/public',
      onMessageReceived,
      { Authorization: `Bearer ${loginInfo.accessToken}` } // Added Authorization header
    );
    stompClient.subscribe(
      '/user/' + userData.username + '/private',
      onPrivateMessage,
      { Authorization: `Bearer ${loginInfo.accessToken}` } // Added Authorization header
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: 'JOIN',
    };
    stompClient.send(
      '/app/message',
      { Authorization: `Bearer ${loginInfo.accessToken}` }, // Added Authorization header
      JSON.stringify(chatMessage)
    );
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'JOIN':
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case 'MESSAGE':
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
      };
      console.log(chatMessage);
      stompClient.send(
        '/app/message',
        { Authorization: `Bearer ${loginInfo.accessToken}` }, // Added Authorization header
        JSON.stringify(chatMessage)
      );
      setUserData({ ...userData, message: '' });
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: 'MESSAGE',
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send(
        '/app/private-message',
        { Authorization: `Bearer ${loginInfo.accessToken}` }, // Added Authorization header
        JSON.stringify(chatMessage)
      );
      setUserData({ ...userData, message: '' });
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const handleToken = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, accessToken: value });
  };

  const registerUser = () => {
    connect();
  };

  return (
    <Container className={classes.container}>
      {userData.connected ? (
        <Paper className={classes.paper}>
          <Box className={classes.chatBox}>
            <Box className={classes.memberList}>
              <List>
                <ListItem button onClick={() => setTab('CHATROOM')} selected={tab === 'CHATROOM'}>
                  <ListItemText primary="Chatroom" />
                </ListItem>
                {[...privateChats.keys()].map((name, index) => (
                  <ListItem button key={index} onClick={() => setTab(name)} selected={tab === name}>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box className={classes.chatContent}>
              <List className={classes.chatMessages}>
                {tab === 'CHATROOM'
                  ? publicChats.map((chat, index) => (
                      <ListItem
                        key={index}
                        className={chat.senderName === userData.username ? classes.selfMessage : classes.otherMessage}
                      >
                        {chat.senderName !== userData.username && (
                          <ListItemAvatar>
                            <Avatar>{chat.senderName.charAt(0)}</Avatar>
                          </ListItemAvatar>
                        )}
                        <ListItemText primary={chat.message} />
                        {chat.senderName === userData.username && (
                          <ListItemAvatar>
                            <Avatar>{chat.senderName.charAt(0)}</Avatar>
                          </ListItemAvatar>
                        )}
                      </ListItem>
                    ))
                  : privateChats.get(tab).map((chat, index) => (
                      <ListItem
                        key={index}
                        className={chat.senderName === userData.username ? classes.selfMessage : classes.otherMessage}
                      >
                        {chat.senderName !== userData.username && (
                          <ListItemAvatar>
                            <Avatar>{chat.senderName.charAt(0)}</Avatar>
                          </ListItemAvatar>
                        )}
                        <ListItemText primary={chat.message} />
                        {chat.senderName === userData.username && (
                          <ListItemAvatar>
                            <Avatar>{chat.senderName.charAt(0)}</Avatar>
                          </ListItemAvatar>
                        )}
                      </ListItem>
                    ))}
              </List>
              <Box className={classes.messageInput}>
                <TextField
                  variant="outlined"
                  fullWidth
                  className={classes.messageField}
                  placeholder="Enter your message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <Button variant="contained" color="primary" onClick={tab === 'CHATROOM' ? sendValue : sendPrivateValue}>
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Box className={classes.form}>
            <TextField
              id="user-name"
              label="Enter your name"
              name="userName"
              value={userData.username}
              onChange={handleUsername}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={registerUser}>
              Connect
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ChatRoom;
