export type Orientation = "E" | "W" | "N" | "S";
export type Direction = "L" | "R" | "F";
export interface Coordinates {
	x: number;
	y: number;
}

export type PromptInputType =
	| "upperRightCoordinates"
	| "startingPositionAndOrientation"
	| "directions";

export interface RobotInput {
	upperRightCoordinates: string;
	startingPositionAndOrientation: string;
	directions: string;
	lostRobots: LostRobot[];
}

export interface LostRobot extends Coordinates {
	orientation: Orientation;
}
