import readline from "readline";
import Robot from "./src/Robot";
import SpaceMission from "./src/SpaceMission";

const startProgram = () => {
	const spaceMission = new SpaceMission();
	spaceMission.createMarsThenCreateRobot();
};

startProgram();
