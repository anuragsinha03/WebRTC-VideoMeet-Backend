import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import Room from "./../models/roomModel";
import IRoomParams from "../interfaces/IRoomParams";

// This map stores for a room what all peers have joined
/*
 *{1: [u1, u2, u3], 2: [u4, u5, u6]}
 *
 */
// const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {
	// const createRoom = () => {
	// 	const roomId = UUIDv4(); // This will be our unique room id in which multiple connections will exchange data
	// 	socket.join(roomId); // We will make the socket connection enter a new room

	// 	rooms[roomId] = []; // Creates a new entry for the room

	// 	socket.emit("room-created", { roomId }); // We wull emit an event from server side that socket connection has been added to a room
	// 	console.log("Room is created with roomID:", roomId);
	// };

	// This below function is executed everytime a user (creator or joinee) joins a new room
	// const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
	// 	if (rooms[roomId]) {
	// 		// If the given roomId exists in the in-memory db
	// 		console.log(
	// 			"New user has joined room: ",
	// 			roomId,
	// 			"with peerId as: ",
	// 			peerId
	// 		);

	// 		// This moment new user joins, add the peerId to the key of roomId
	// 		rooms[roomId].push(peerId);
	// 		console.log("Added peer to room: ", rooms);
	// 		socket.join(roomId); // Make the user join the socket room

	// 		// whenever anyone joins the room

	// 		socket.on("ready", () => {
	// 			// from the frontend once someone joins the room we will emit a ready event
	// 			// then from our server we will emit an event to all the clients conn that a new peer has added
	// 			socket.to(roomId).emit("user-joined", { peerId });
	// 		});

	// 		// Below event is for logging purpose
	// 		socket.emit("get-users", {
	// 			roomId,
	// 			participants: rooms[roomId],
	// 		});
	// 	}
	// };

	// When to call the above two functions ?
	// We will call the above two functions when the client will emit events to create room and join room

	const createRoom = async () => {
		const roomId = UUIDv4();
		await Room.create({ roomId, participants: [] });
		socket.join(roomId);
		socket.emit("room-created", { roomId });
	};

	const joinedRoom = async ({ roomId, peerId }: IRoomParams) => {
		const room = await Room.findOne({ roomId });
		if (room) {
			room.participants.push(peerId);
			await room.save();
			socket.join(roomId);
			socket.to(roomId).emit("user-joined", { peerId });
			socket.emit("get-users", {
				roomId,
				participants: room.participants,
			});
		}
	};

	socket.on("create-room", createRoom);
	socket.on("joined-room", joinedRoom);
};

export default roomHandler;
