import { DIRECTION } from "@/pages/game/classes/items/indicator.item.js";

const DIRECTIONS = Object.values(DIRECTION);

function getRandomInt(min, max) {
	const random = Math.random();
	const range = max - min + 1;
	const result = Math.floor(random * range) + min;
	return result;
}

function getRandomItem(array) {
	if (array.length === 0) {
		return null;
	}
	const index = getRandomInt(0, array.length - 1);
	return array[index];
}

function moveInDirection(x, y, dir) {
	if (dir === "up") {
		return { x: x - 1, y: y };
	}
	if (dir === "down") {
		return { x: x + 1, y: y };
	}
	if (dir === "left") {
		return { x: x, y: y - 1 };
	}
	if (dir === "right") {
		return { x: x, y: y + 1 };
	}
	return { x: x, y: y };
}

function getDistance(pos1, pos2) {
	const x1 = pos1.x;
	const y1 = pos1.y;
	const x2 = pos2.x;
	const y2 = pos2.y;
	const diffX = x1 > x2 ? x1 - x2 : x2 - x1;
	const diffY = y1 > y2 ? y1 - y2 : y2 - y1;
	return diffX + diffY;
}

function isPositionInGrid(x, y, size) {
	if (x < 0) return false;
	if (x >= size) return false;
	if (y < 0) return false;
	if (y >= size) return false;
	return true;
}

function isMountainAt(x, y, mountains) {
	for (let i = 0; i < mountains.length; i++) {
		if (mountains[i].x === x && mountains[i].y === y) {
			return true;
		}
	}
	return false;
}

function getValidDirections(x, y, size, mountains) {
	const valid = [];
	
	if (x > 0) {
		const nextX = x - 1;
		const nextY = y;
		if (!isMountainAt(nextX, nextY, mountains)) {
			valid.push("up");
		}
	}
	
	if (x < size - 1) {
		const nextX = x + 1;
		const nextY = y;
		if (!isMountainAt(nextX, nextY, mountains)) {
			valid.push("down");
		}
	}
	
	if (y > 0) {
		const nextX = x;
		const nextY = y - 1;
		if (!isMountainAt(nextX, nextY, mountains)) {
			valid.push("left");
		}
	}
	
	if (y < size - 1) {
		const nextX = x;
		const nextY = y + 1;
		if (!isMountainAt(nextX, nextY, mountains)) {
			valid.push("right");
		}
	}
	
	if (valid.length === 0) {
		return DIRECTIONS;
	}
	
	return valid;
}

function findPath(start, end, size, mountains) {
	const visited = [];
	const queue = [];
	
	queue.push({ x: start.x, y: start.y });
	visited.push(`${start.x},${start.y}`);
	
	while (queue.length > 0) {
		const current = queue[0];
		queue.shift();
		
		if (current.x === end.x && current.y === end.y) {
			return true;
		}
		
		const neighbors = [];
		neighbors.push({ x: current.x - 1, y: current.y });
		neighbors.push({ x: current.x + 1, y: current.y });
		neighbors.push({ x: current.x, y: current.y - 1 });
		neighbors.push({ x: current.x, y: current.y + 1 });
		
		for (let i = 0; i < neighbors.length; i++) {
			const neighbor = neighbors[i];
			const key = `${neighbor.x},${neighbor.y}`;
			
			if (!isPositionInGrid(neighbor.x, neighbor.y, size)) {
				continue;
			}
			
			if (isMountainAt(neighbor.x, neighbor.y, mountains)) {
				continue;
			}
			
			let alreadyVisited = false;
			for (let j = 0; j < visited.length; j++) {
				if (visited[j] === key) {
					alreadyVisited = true;
					break;
				}
			}
			
			if (alreadyVisited) {
				continue;
			}
			
			visited.push(key);
			queue.push(neighbor);
		}
	}
	
	return false;
}

function generateMountains(size, start, end, count) {
	const mountains = [];
	const used = [];
	
	used.push(`${start.x},${start.y}`);
	used.push(`${end.x},${end.y}`);
	
	let tries = 0;
	const maxTries = count * 5;
	
	while (mountains.length < count && tries < maxTries) {
		tries = tries + 1;
		
		const x = getRandomInt(0, size - 1);
		const y = getRandomInt(0, size - 1);
		const key = `${x},${y}`;
		
		let isUsed = false;
		for (let i = 0; i < used.length; i++) {
			if (used[i] === key) {
				isUsed = true;
				break;
			}
		}
		
		if (isUsed) {
			continue;
		}
		
		mountains.push({ x: x, y: y });
		used.push(key);
	}
	
	return mountains;
}

function generateSolvableLevel(levelNumber) {
	let size = 5;
	if (levelNumber >= 3) {
		size = 6;
	}
	if (levelNumber >= 6) {
		size = 7;
	}
	if (levelNumber >= 9) {
		size = 8;
	}
	if (levelNumber >= 12) {
		size = 9;
	}
	if (levelNumber >= 15) {
		size = 10;
	}
	if (levelNumber >= 18) {
		size = 11;
	}
	if (levelNumber >= 21) {
		size = 12;
	}
	if (levelNumber >= 24) {
		size = 13;
	}
	if (levelNumber >= 27) {
		size = 14;
	}
	if (levelNumber >= 30) {
		size = 15;
	}
	
	const totalCells = size * size;
	
	let minMountains = 0;
	let maxMountains = 0;
	
	if (levelNumber < 5) {
		minMountains = Math.floor(totalCells * 0.03);
		maxMountains = Math.floor(totalCells * 0.08);
	} else if (levelNumber < 10) {
		minMountains = Math.floor(totalCells * 0.05);
		maxMountains = Math.floor(totalCells * 0.12);
	} else if (levelNumber < 15) {
		minMountains = Math.floor(totalCells * 0.08);
		maxMountains = Math.floor(totalCells * 0.18);
	} else if (levelNumber < 20) {
		minMountains = Math.floor(totalCells * 0.12);
		maxMountains = Math.floor(totalCells * 0.22);
	} else {
		minMountains = Math.floor(totalCells * 0.15);
		maxMountains = Math.floor(totalCells * 0.25);
	}
	
	const mountainCount = getRandomInt(minMountains, maxMountains);
	
	let start = { x: 0, y: 0 };
	let end = { x: 0, y: 0 };
	let mountains = [];
	let foundGoodLevel = false;
	let attempts = 0;
	
	while (!foundGoodLevel && attempts < 200) {
		attempts = attempts + 1;
		
		start = {
			x: getRandomInt(0, size - 1),
			y: getRandomInt(0, size - 1)
		};
		
		let endFound = false;
		let endAttempts = 0;
		
		while (!endFound && endAttempts < 100) {
			endAttempts = endAttempts + 1;
			
			end = {
				x: getRandomInt(0, size - 1),
				y: getRandomInt(0, size - 1)
			};
			
			if (start.x === end.x && start.y === end.y) {
				continue;
			}
			
			const dist = getDistance(start, end);
			if (dist < 4) {
				continue;
			}
			
			endFound = true;
		}
		
		if (!endFound) {
			continue;
		}
		
		if (start.x === end.x && start.y === end.y) {
			continue;
		}
		
		const dist = getDistance(start, end);
		if (dist < 4) {
			continue;
		}
		
		mountains = generateMountains(size, start, end, mountainCount);
		
		const hasPath = findPath(start, end, size, mountains);
		
		if (hasPath) {
			foundGoodLevel = true;
		}
	}
	
	if (!foundGoodLevel) {
		start = { x: 0, y: Math.floor(size / 2) };
		end = { x: Math.min(4, size - 1), y: Math.floor(size / 2) };
		const safeMountainCount = Math.floor(mountainCount * 0.5);
		mountains = generateMountains(size, start, end, safeMountainCount);
	}
	
	const dist = getDistance(start, end);
	
	let moves = 0;
	let time = 0;
	
	if (levelNumber < 5) {
		moves = dist + Math.floor(size * 1.5);
		const minMoves = Math.floor(size * 2.0);
		if (moves < minMoves) {
			moves = minMoves;
		}
		time = Math.floor(size * 5.0) + Math.floor(moves * 2.5);
		if (time < 60) {
			time = 60;
		}
	} else if (levelNumber < 10) {
		moves = dist + Math.floor(size * 1.2);
		const minMoves = Math.floor(size * 1.6);
		if (moves < minMoves) {
			moves = minMoves;
		}
		time = Math.floor(size * 4.5) + Math.floor(moves * 2.0);
		if (time < 50) {
			time = 50;
		}
	} else if (levelNumber < 15) {
		moves = dist + Math.floor(size * 0.8);
		const minMoves = Math.floor(size * 1.3);
		if (moves < minMoves) {
			moves = minMoves;
		}
		time = Math.floor(size * 4.0) + Math.floor(moves * 1.8);
		if (time < 40) {
			time = 40;
		}
	} else if (levelNumber < 20) {
		moves = dist + Math.floor(size * 0.6);
		const minMoves = Math.floor(size * 1.2);
		if (moves < minMoves) {
			moves = minMoves;
		}
		time = Math.floor(size * 3.5) + Math.floor(moves * 1.5);
		if (time < 35) {
			time = 35;
		}
	} else {
		moves = dist + Math.floor(size * 0.5);
		const minMoves = Math.floor(size * 1.1);
		if (moves < minMoves) {
			moves = minMoves;
		}
		time = Math.floor(size * 3.0) + Math.floor(moves * 1.3);
		if (time < 30) {
			time = 30;
		}
	}
	
	const validDirs = getValidDirections(start.x, start.y, size, mountains);
	let dir = "up";
	if (validDirs.length > 0) {
		const randomDir = getRandomItem(validDirs);
		if (randomDir) {
			dir = randomDir;
		}
	}
	
	const level = {
		id: levelNumber + 1,
		size: size,
		dir: dir,
		moves: moves,
		time: time,
		start: start,
		end: end,
		mountains: mountains
	};
	
	return level;
}

export function generateLevels(count = 30) {
	const levels = [];
	
	for (let i = 0; i < count; i++) {
		const level = generateSolvableLevel(i);
		levels.push(level);
	}
	
	return levels;
}

export function generateRandomLevel() {
	const randomNum = Math.floor(Math.random() * 1000);
	return generateSolvableLevel(randomNum);
}

