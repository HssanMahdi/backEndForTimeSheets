const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const Employee = require("../models/Employee");
const Message = require("../models/Message");

const accessChat = async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    console.log("employeeId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroup: false,
    $and: [
      { employees: { $elemMatch: { $eq: req.employee._id } } },
      { employees: { $elemMatch: { $eq: employeeId } } },
    ],
  })
    .populate("employees", "-password")
    .populate("lastMessage");

  isChat = await Employee.populate(isChat, {
    path: "lastMessage.sender",
    select: "userName images email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: req.body.employeeId,
      isGroup: false,
      employees: [req.employee._id, employeeId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "employees",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ employees: { $elemMatch: { $eq: req.employee._id } } })
      .populate("employees", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Employee.populate(results, {
          path: "lastMessage.sender",
          select: "userName images email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.employees || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var employees = JSON.parse(req.body.employees);

  if (employees.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  employees.push(req.employee);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      employees: employees,
      isGroup: true,
      groupAdmin: req.employee,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("employees", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("employees", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, employeeId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { employees: employeeId },
    },
    {
      new: true,
    }
  )
    .populate("employees", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, employeeId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { employees: employeeId },
    },
    {
      new: true,
    }
  )
    .populate("employees", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const deleteChat = asyncHandler(async (req, res) => {
  var chat = await Chat.findOne({ _id: req.params.chatId });
  if (chat) {
    if (chat.groupAdmin.equals(req.employee._id)) {
      await Message.deleteMany({ chat: { $eq: chat._id } });
      await Chat.remove({ _id: { $eq: chat._id } });
      res.status(200).send("Deleted");
    } else {
      res.status(401).send("you are not this group's admin");
    }
  } else {
    console.log("Ce chat n'existe pas");
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteChat,
};
