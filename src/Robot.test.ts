import Robot from "./Robot";

describe("Robot class", () => {
	test("should return correct final position and orientation", () => {
		const robot = new Robot({
			upperRightCoordinates: "5 3",
			startingPositionAndOrientation: "1 1 E",
			directions: "RFRFRFRF",
			lostRobots: [],
		});
		const result = robot.initiateMovement();
		expect(result).toEqual({
			finalPosition: { x: 1, y: 1 },
			orientation: "E",
			isLost: false,
		});
	});

	test("should mark robot as lost if it falls off Mars", () => {
		const robot = new Robot({
			upperRightCoordinates: "5 3",
			startingPositionAndOrientation: "3 2 N",
			directions: "FRRFLLFFRRFLL",
			lostRobots: [],
		});

		const result = robot.initiateMovement();

		expect(result).toEqual({
			finalPosition: { x: 3, y: 3 },
			orientation: "N",
			isLost: true,
		});
	});

	test("should ignore moving forward if location and orientation match dead scented spot", () => {
		const robot = new Robot({
			upperRightCoordinates: "5 3",
			startingPositionAndOrientation: "0 3 W",
			directions: "LLFFFLFLFL",
			lostRobots: [{ x: 3, y: 3, orientation: "N" }],
		});

		const result = robot.initiateMovement();

		expect(result).toEqual({
			finalPosition: { x: 2, y: 3 },
			orientation: "S",
			isLost: false,
		});
	});
});
