import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
	roomId: { type: String, required: true, unique: true },
	participants: [String],
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
