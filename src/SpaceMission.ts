import readline from "readline";
import Robot from "./Robot";
import { Coordinates, LostRobot, PromptInputType } from "../types";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

interface RobotBluePrint {
	startingPositionAndOrientation: string;
	directions: string;
}

class SpaceMission {
	private robotBluePrints: RobotBluePrint[] = [];
	private lostRobots: LostRobot[] = [];
	private marsUpperRight: string = "";

	constructor() {}

	async createMarsThenCreateRobot(): Promise<void> {
		await this.createThePlanetMars();
		this.createRobot();
	}

	// Create the rectangular planet of mars by stating the upper right coordinate
	private async createThePlanetMars() {
		const marsUpperRight = await this.question(
			"What are the upper right coordinates of Mars:  "
		);

		if (
			!this.isValidInput(
				"upperRightCoordinates",
				this.formatString(marsUpperRight)
			)
		) {
			console.log("Invalid input, please try again: ");
			await this.createThePlanetMars();
			return;
		}
		this.marsUpperRight = marsUpperRight;
	}

	async createRobot() {
		// create blueprint for this robot via prompts
		await this.createRobotBluePrint();

		// check to add another robot
		const playAgain = await this.question(
			"\nWould you like to add another robot again[y/n] :  "
		);

		// if you would like to add another robot run function again
		if (playAgain.toLowerCase() === "y") {
			this.createRobot();
			return;
		}

		// for each of the robot blueprints made, create the robot
		this.robotBluePrints.forEach((robotParams) => {
			// initialise robot with each robot aware of prior lost robots
			const robot = new Robot({
				...robotParams,
				lostRobots: this.lostRobots,
				upperRightCoordinates: this.marsUpperRight,
			});

			// start moving the robot
			const { finalPosition, orientation, isLost } = robot.initiateMovement();

			let output = `${finalPosition.x} ${finalPosition.y} ${orientation}`;

			// if robot is lost, add to lost robots and add to output
			if (isLost) {
				output += " LOST";
				this.lostRobots.push({ ...finalPosition, orientation });
			}

			// LOG OUTPUT 🎉
			console.log(output);

			// close readline
			rl.close();
		});
	}

	private async createRobotBluePrint(): Promise<{
		startingPositionAndOrientation: string;
		directions: string;
	}> {
		const startingPositionAndOrientation = await this.question(
			`\n\nWhat is the starting position and orientation of robot number ${
				this.robotBluePrints.length + 1
			}:  `
		);

		if (
			!this.isValidInput(
				"startingPositionAndOrientation",
				this.formatString(startingPositionAndOrientation)
			)
		) {
			console.log("Invalid input, please try again: ");
			return await this.createRobotBluePrint();
		}

		const directions = await this.question(
			"And the sequence of movements for this robot:  "
		);

		if (!this.isValidInput("directions", this.formatString(directions))) {
			console.log("Invalid input, please try again: ");
			return await this.createRobotBluePrint();
		}

		// Robot blueprint setup
		this.robotBluePrints.push({
			startingPositionAndOrientation,
			directions,
		});

		return {
			startingPositionAndOrientation: this.formatString(
				startingPositionAndOrientation
			),
			directions: this.formatString(directions),
		};
	}

	// avoid callback hell
	private question(questionString: string) {
		return new Promise<string>((res) => rl.question(questionString, res));
	}

	private isValidInput(type: PromptInputType, value: string) {
		const validate = this.createValidation(value);
		switch (type) {
			case "upperRightCoordinates":
				return validate("0123456789NESW ") && value.split(" ").length === 2;
			case "startingPositionAndOrientation":
				return validate("0123456789NESW ") && value.split(" ").length === 3;
			case "directions":
				return (
					validate("LRF") && value.split(" ").length === 1 && value.length < 100
				);
			default:
				return false;
		}
	}

	private createValidation(input: string) {
		return function (allowedChars: string) {
			// strings longer than 100 in length are false
			if (input.length >= 100) return false;

			// strings that dont match string are false
			for (let i = 0; i < input.length; i++) {
				if (allowedChars.indexOf(input[i]) === -1) {
					return false;
				}

				// if the string is a number, if great than 50, return false
				if (Number.isFinite(input[i]) && parseInt(input[i], 10) > 50) {
					return false;
				}
			}

			// string is valid if all passes
			return true;
		};
	}

	private formatString(val: string) {
		return val.trim().toUpperCase();
	}
}

export default SpaceMission;
