import Header from "@/components/base/Header";
import MessageDetail from "@/components/domain/Message/MessageDetail";
import Message from "@/components/domain/Message/Message";
import Nav from "@/components/base/Nav";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  getUserList,
  getMessageList,
  createContract,
  patchContract,
} from "@/api/services/chatting";

const MessagePage = () => {
  const jwt = localStorage.getItem("needit_access_token");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const { postId, postType, receiverId } = useParams();
  const socket = new SockJS(`${API_BASE_URL}/stomp-handshake`);
  const stompClient = Stomp.over(socket);
  const updateList = async () => {
    const nextList = await getMessageList(postId, postType, receiverId);
    setMessageList(nextList);
  };
  const connect = useCallback(() => {
    stompClient.connect({ Authorization: jwt }, function () {
      stompClient.subscribe("/user/topic/chats", async () => {
        updateList();
      });
    });
  });
  useEffect(() => {
    window.scroll({
      top: 10000000,
      behavior: "smooth",
    });
  }, [userList, messageList]);
  useEffect(async () => {
    const nextList = await getUserList();
    setUserList(nextList);
    if (postId) {
      updateList();
    }
  }, [postId]);
  useEffect(() => {
    connect();
  }, []);
  const sendMessage = (content, postId, postType, receiverId) => {
    stompClient.send(
      "/app/chat",
      { Authorization: jwt },
      JSON.stringify({
        content,
        postId,
        postType,
        receiverId,
      })
    );
  };
  return (
    <>
      <Header type="main" />
      {postId ? (
        <MessageDetail
          list={messageList}
          sendMessage={async (text) => {
            await sendMessage(text, postId, postType, receiverId);
            const nextList = await getMessageList(postId, postType, receiverId);
            setMessageList(nextList);
          }}
          reserveDonation={async (date) => {
            await createContract(date, postId, postType, receiverId);
            const nextList = await getMessageList(postId, postType, receiverId);
            setMessageList(nextList);
          }}
          contract={async (id, contractStatus) => {
            await patchContract(id, contractStatus);
            const nextList = await getMessageList(postId, postType, receiverId);
            setMessageList(nextList);
          }}
        />
      ) : (
        <Message list={userList} />
      )}

      {postId ? "" : <Nav />}
    </>
  );
};

export default MessagePage;
