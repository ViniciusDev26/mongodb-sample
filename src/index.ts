import express from "express";
import mongoose from "mongoose";
import { Message } from "./models/message.js";
import { validateMessage } from "./valdators/message.js";

const app = express();

await mongoose.connect(process.env.MONGODB_URL as string);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the NoSQL Project API");
});

app.get("/message", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post("/message", async (req, res) => {
  const validation = validateMessage(req.body);
  if (validation.success) {
    const newMessage = new Message(validation.data);
    await newMessage.save();
    res.status(201).json(newMessage);
  } else {
    res.status(400).json({ errors: validation.error });
  }
});

app.put("/message/:id", async (req, res) => {
  const validation = validateMessage(req.body);
  if (validation.success) {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, validation.data, { new: true });
    res.json(updatedMessage);
  } else {
    res.status(400).json({ errors: validation.error });
  }
});

app.delete("/message/:id", async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});