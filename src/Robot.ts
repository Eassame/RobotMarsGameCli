import {
	Direction,
	Coordinates,
	Orientation,
	RobotInput,
	LostRobot,
} from "../types";

class Robot {
	private currentRobotPositon: Coordinates;
	private upperRightCoordinates: Coordinates;
	private currentOrientation: Orientation;
	private directions: string;
	private isLost: boolean = false;
	private lostRobots: LostRobot[] = [];
	private readonly clockWiseNavigation: ["N", "E", "S", "W"] = [
		"N",
		"E",
		"S",
		"W",
	];

	constructor({
		upperRightCoordinates,
		startingPositionAndOrientation,
		directions,
		lostRobots,
	}: RobotInput) {
		this.directions = directions;
		this.upperRightCoordinates = this.getCoordinates(upperRightCoordinates);

		this.currentRobotPositon = this.getCoordinates(
			startingPositionAndOrientation
		);
		this.currentOrientation = this.getOrientation(
			startingPositionAndOrientation
		);
		this.lostRobots = lostRobots;
	}

	public initiateMovement() {
		// Turn direction string into an array of directions
		const directionsArray = this.directions.trim().split("");

		// Apply each direction movement to each robot
		for (let i = 0; i < directionsArray.length; i++) {
			// If this robot hasn't fallen off mars, continue to next move
			if (!this.isLost) {
				const currentDirection = directionsArray[i] as Direction;
				this.directRobot(currentDirection);
			} else {
				// if he has fallen off,break out of for loop
				break;
			}
		}

		return {
			finalPosition: this.currentRobotPositon,
			orientation: this.currentOrientation,
			isLost: this.isLost,
		};
	}

	private directRobot(direction: Direction) {
		switch (direction) {
			case "L":
				this.currentOrientation = this.changeOrientation(-1);
				return;
			case "R":
				this.currentOrientation = this.changeOrientation(1);
				return;
			case "F":
				this.moveForward();
				return;
		}
	}

	private changeOrientation(changeOrientation: 1 | -1) {
		const currentDirectionIndex = this.clockWiseNavigation.findIndex(
			(nav) => nav === this.currentOrientation
		);

		// turning right - R
		if (changeOrientation === 1) {
			// if turning right and about to complete full cicle (W), then restart to N
			if (currentDirectionIndex === this.clockWiseNavigation.length - 1) {
				return this.clockWiseNavigation[0];
			}
			// just turn right
			return this.clockWiseNavigation[currentDirectionIndex + 1];
		}

		// turning left - L
		if (changeOrientation === -1) {
			// if turning left and about to complete full cicle (N), then restart to N
			if (currentDirectionIndex === 0) {
				return this.clockWiseNavigation[this.clockWiseNavigation.length - 1];
			}

			return this.clockWiseNavigation[currentDirectionIndex - 1];
		}

		return this.clockWiseNavigation[currentDirectionIndex];
	}

	private moveForward() {
		// if robot is in a scented lost robot spot and has the same orientation, ignore forward move
		const inAScentedSpot = this.lostRobots.some(
			(lostRobot) =>
				lostRobot.x === this.currentRobotPositon.x &&
				lostRobot.y === this.currentRobotPositon.y &&
				lostRobot.orientation === this.currentOrientation
		);
		if (!inAScentedSpot) {
			this.currentRobotPositon = this.changePosition();
		}
	}

	private changePosition() {
		const { x: currentX, y: currentY } = this.currentRobotPositon;
		const { x: maxX, y: maxY } = this.upperRightCoordinates;

		switch (this.currentOrientation) {
			case "N":
				return this.checkIfRobotIsAboutToFallOffMars(currentY, maxY, {
					x: currentX,
					y: currentY + 1,
				});
			case "E":
				return this.checkIfRobotIsAboutToFallOffMars(currentX, maxX, {
					x: currentX + 1,
					y: currentY,
				});

			case "S":
				return this.checkIfRobotIsAboutToFallOffMars(currentY, 0, {
					x: currentX,
					y: currentY - 1,
				});

			case "W":
				return this.checkIfRobotIsAboutToFallOffMars(currentX, 0, {
					x: currentX - 1,
					y: currentY,
				});
		}
	}

	private checkIfRobotIsAboutToFallOffMars(
		currentVal: number,
		maxVal: number,
		newSafeCoordinates: Coordinates
	) {
		if (currentVal === maxVal) {
			this.isLost = true;
			return this.currentRobotPositon;
		} else {
			return newSafeCoordinates;
		}
	}

	private getCoordinates(coordinates: string) {
		const coordinatesArray = coordinates.trim().split(" "); // Turn direction string into array

		return {
			x: parseInt(coordinatesArray[0], 10),
			y: parseInt(coordinatesArray[1], 10),
		};
	}

	private getOrientation(coordinatesAndOrientation: string) {
		const coordinatesArray = coordinatesAndOrientation.trim().split(" ");
		return coordinatesArray[2] as Orientation;
	}
}

export default Robot;
