import mongoose from "mongoose";
import config from "./serverConfig";

// NORMAL way
async function connectToDB() {
	try {
		if (config.NODE_ENV === "development") {
			if (!config.ATLAS_DB_URL) {
				throw new Error("Database URL is not defined");
			}
			await mongoose.connect(config.ATLAS_DB_URL);
			console.log("Successfully connected to the DB Server");
		} else {
			console.log(
				"Skipping DB connection for non-development environments"
			);
		}
	} catch (error) {
		console.error("Unable to connect to the DB Server");
		console.error(error);
	}
}

export default connectToDB;
