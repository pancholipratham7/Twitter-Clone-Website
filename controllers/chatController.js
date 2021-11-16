const Chat = require("./../models/chatModel");
const User = require("./../models/userModel");

exports.createChat = async (req, res, next) => {
  if (!req.body.users) {
    return res.status(400).json({
      status: "Failed",
      message: "Users not selected",
    });
  }
  let users = req.body.users;
  users.push(req.session.user);
  if (!users.length) {
    return res.status(400).json({
      status: "failed",
      message: "Selected users array is empty",
    });
  }

  //whenever we create a group chat it will be always a group chat so that we can add more users with respect to time
  const chatData = {
    users,
    isGroupChat: true,
  };

  const chat = await Chat.create(chatData);
  res.status(200).json({
    status: "success",
    chat,
  });
};

//get chats
exports.getChats = async (req, res, next) => {
  console.log("Babar");
  //Loading all our chats
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.session.user._id } },
  })
    .populate("users")
    .populate("latestMessage")
    .sort({ updatedAt: 1 });
  console.log(chats);
  chats = await User.populate(chats, { path: "latestMessage.sender" });
  console.log(chats);

  res.status(200).json({
    status: "success",
    chats,
  });
};

// Update chat Name
exports.updateChatName = async (req, res, next) => {
  console.log(req.body.chatName);
  const updatedChat = await Chat.findByIdAndUpdate(
    req.params.chatId,
    { chatName: req.body.chatName },
    { new: true }
  );
  console.log(updatedChat);
  res.status(200).json({
    status: "success",
    updatedChat: updatedChat,
  });
};

//getting a particular chat by chatId
exports.getAChat = async (req, res, next) => {
  console.log("Rizwan");
  //getting one chat
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      users: { $elemMatch: { $eq: req.session.user._id } },
    }).populate("users");
    return res.status(200).json({
      status: "success",
      chat: chat,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      chat: err,
    });
  }
};
