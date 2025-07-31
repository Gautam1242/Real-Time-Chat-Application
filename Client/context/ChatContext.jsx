import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios,authUser } = useContext(AuthContext);

  // function to get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to get the messages for the selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        console.log(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        const newMsg = {
        ...data.newMessage,
        senderId: authUser._id, // ✅ Force senderId to be current user
        seen: true,
      };
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to subscribe to messages to selected user
  // const subscribeToMessages=async()=>{
  //     if(!socket) return;

  //     socket.on("newMessage",(newMessage)=>{
  //         if(selectedUser && newMessage.senderId === selectedUser._id){
  //             newMessage.seen=true;
  //             setMessages((prevMessages)=>[...prevMessages,newMessage]);
  //             axios.put(`/api/messages/mark/${newMessage._id}`)
  //         }else{
  //             setUnseenMessages((prevUnseenMessages)=>({
  //                 ...prevUnseenMessages,[newMessage.senderId]:prevUnseenMessages[newMessage.senderId]?prevUnseenMessages[newMessage.senderId]+1:1
  //             }))
  //         }
  //     })
  // }
  //   const subscribeToMessages = async () => {
  //     if (!socket) return;

  //     socket.on("newMessage", (newMessage) => {
  //       // Show in current chat if it's to or from the selected user
  //       if (
  //         selectedUser &&
  //         (newMessage.senderId === selectedUser._id ||
  //           newMessage.receiverId === selectedUser._id)
  //       ) {
  //         newMessage.seen = true;
  //         setMessages((prevMessages) => [...prevMessages, newMessage]);

  //         // Only mark as seen if it's from the selected user (i.e., you received it)
  //         if (String(newMessage.senderId) === String(selectedUser._id)) {
  //           axios.put(`/api/messages/mark/${newMessage._id}`);
  //         }
  //       } else {
  //         // Update unseen messages count in the sidebar
  //         setUnseenMessages((prevUnseenMessages) => ({
  //           ...prevUnseenMessages,
  //           [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
  //             ? prevUnseenMessages[newMessage.senderId] + 1
  //             : 1,
  //         }));
  //       }
  //     });
  //   };

  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const senderId = String(newMessage.senderId);
      const receiverId = String(newMessage.receiverId);
      const selectedId = String(selectedUser?._id);

      // If message is to or from the currently selected user
      if (
        selectedUser &&
        (senderId === selectedId || receiverId === selectedId)
      ) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Mark as seen if it's FROM the other person
        if (senderId === selectedId) {
          axios.put(`/api/messages/mark/${newMessage._id}`);
        }
      } else {
        // Update unseen count
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [senderId]: prevUnseenMessages[senderId]
            ? prevUnseenMessages[senderId] + 1
            : 1,
        }));
      }
    });
  };

  // function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
