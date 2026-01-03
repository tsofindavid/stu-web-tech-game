const DIRECTIONS = ["up", "down", "left", "right"];

// Generate random integer between min and max (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random item from array
function getRandomItem(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Get valid directions from position (x, y) that don't hit wall or mountain on first step
function getValidDirections(x, y, size, mountains) {
	// Create set of mountain positions for fast lookup
	const mountainSet = new Set();
	if (mountains) {
		mountains.forEach((m) => {
			mountainSet.add(`${m.x},${m.y}`);
		});
	}

	const valid = [];

	// Check "up" direction: x must be > 0 (not at top edge), and next position must not be mountain
	if (x > 0) {
		const nextPos = moveInDirection(x, y, "up");
		if (!mountainSet.has(`${nextPos.x},${nextPos.y}`)) {
			valid.push("up");
		}
	}
	// Check "down" direction: x must be < size - 1 (not at bottom edge)
	if (x < size - 1) {
		const nextPos = moveInDirection(x, y, "down");
		if (!mountainSet.has(`${nextPos.x},${nextPos.y}`)) {
			valid.push("down");
		}
	}
	// Check "left" direction: y must be > 0 (not at left edge)
	if (y > 0) {
		const nextPos = moveInDirection(x, y, "left");
		if (!mountainSet.has(`${nextPos.x},${nextPos.y}`)) {
			valid.push("left");
		}
	}
	// Check "right" direction: y must be < size - 1 (not at right edge)
	if (y < size - 1) {
		const nextPos = moveInDirection(x, y, "right");
		if (!mountainSet.has(`${nextPos.x},${nextPos.y}`)) {
			valid.push("right");
		}
	}

	// Return valid directions, or all directions if none are valid (fallback)
	return valid.length > 0 ? valid : DIRECTIONS;
}

// Calculate next position when moving in given direction
function moveInDirection(x, y, dir) {
	if (dir === "right") return { x, y: y + 1 }; // Move right: increase y coordinate
	if (dir === "left") return { x, y: y - 1 };  // Move left: decrease y coordinate
	if (dir === "down") return { x: x + 1, y };  // Move down: increase x coordinate
	if (dir === "up") return { x: x - 1, y };    // Move up: decrease x coordinate
	return { x, y };
}

// Calculate Manhattan distance (sum of horizontal and vertical distances)
// Example: distance between (2,3) and (5,7) = |2-5| + |3-7| = 3 + 4 = 7
function getManhattanDistance(pos1, pos2) {
	return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function isPositionValid(x, y, size, occupied) {
	if (x < 0 || x >= size || y < 0 || y >= size) {
		return false;
	}
	const key = `${x},${y}`;
	return !occupied.has(key);
}

// Generate random mountain positions, avoiding start and end positions
function generateMountains(size, start, end, count) {
	const mountains = [];
	const occupied = new Set();

	// Mark start and end positions as occupied (can't place mountains there)
	occupied.add(`${start.x},${start.y}`);
	occupied.add(`${end.x},${end.y}`);

	let attempts = 0;
	const maxAttempts = count * 3; // Limit attempts to avoid infinite loop

	// Try to generate 'count' mountains
	while (mountains.length < count && attempts < maxAttempts) {
		attempts++;

		// Pick random position on grid
		const x = getRandomInt(0, size - 1);
		const y = getRandomInt(0, size - 1);
		const key = `${x},${y}`;

		// Skip if position is already occupied (start, end, or existing mountain)
		if (occupied.has(key)) {
			continue;
		}

		// Add mountain at this position
		mountains.push({ x, y });
		occupied.add(key);
	}

	return mountains;
}

// Check if there's a path from start to end using BFS (Breadth-First Search)
// This ensures the level is solvable (at least theoretically, ignoring arrows)
function hasDirectPath(start, end, size, mountains) {
	// Create set of mountain positions for fast lookup
	const mountainSet = new Set();
	mountains.forEach((m) => {
		mountainSet.add(`${m.x},${m.y}`);
	});

	const visited = new Set();
	const queue = [{ x: start.x, y: start.y }];
	visited.add(`${start.x},${start.y}`);

	// BFS: explore neighbors level by level
	while (queue.length > 0) {
		const current = queue.shift();

		// Found the end position - path exists!
		if (current.x === end.x && current.y === end.y) {
			return true;
		}

		// Check all 4 neighbors (up, down, left, right)
		const neighbors = [
			{ x: current.x - 1, y: current.y }, // up
			{ x: current.x + 1, y: current.y }, // down
			{ x: current.x, y: current.y - 1 }, // left
			{ x: current.x, y: current.y + 1 }, // right
		];

		for (const neighbor of neighbors) {
			const key = `${neighbor.x},${neighbor.y}`;

			// Skip if: out of bounds, already visited, or is a mountain
			if (
				neighbor.x < 0 ||
				neighbor.x >= size ||
				neighbor.y < 0 ||
				neighbor.y >= size ||
				visited.has(key) ||
				mountainSet.has(key)
			) {
				continue;
			}

			// Mark as visited and add to queue for further exploration
			visited.add(key);
			queue.push(neighbor);
		}
	}

	// Queue is empty but didn't reach end - no path exists
	return false;
}

// Generate a single solvable level
function generateSolvableLevel(levelNumber) {
	// Calculate grid size: starts at 5, increases by 1 every 3 levels, max 15
	// Level 0: size 5, Level 3: size 6, Level 6: size 7, ..., Level 30+: size 15
	const size = Math.min(5 + Math.floor(levelNumber / 3), 15);

	// Calculate mountain count: between 8% and 25% of total grid cells
	// Larger grids get more mountains proportionally
	const maxMountains = Math.floor((size * size) * 0.25); // 25% of grid
	const minMountains = Math.floor((size * size) * 0.08); // 8% of grid
	const mountainCount = getRandomInt(minMountains, maxMountains);

	let start, end;
	let mountains = [];
	let attempts = 0;
	const maxAttempts = 100; // Maximum tries to generate valid level

	// Try to generate valid level configuration
	while (attempts < maxAttempts) {
		attempts++;

		// Pick random start position
		start = {
			x: getRandomInt(0, size - 1),
			y: getRandomInt(0, size - 1),
		};

		// Pick end position that's at least 4 cells away from start (Manhattan distance)
		let endAttempts = 0;
		const maxEndAttempts = 50;
		end = {
			x: getRandomInt(0, size - 1),
			y: getRandomInt(0, size - 1),
		};

		// Keep trying until end is at least 4 cells away and not same as start
		while (
			endAttempts < maxEndAttempts &&
			((start.x === end.x && start.y === end.y) ||
			getManhattanDistance(start, end) < 4)
		) {
			end = {
				x: getRandomInt(0, size - 1),
				y: getRandomInt(0, size - 1),
			};
			endAttempts++;
		}

		// Skip if start and end are the same
		if (start.x === end.x && start.y === end.y) {
			continue;
		}

		// Skip if distance is still less than 4
		if (getManhattanDistance(start, end) < 4) {
			continue;
		}

		// Generate mountains for this configuration
		mountains = generateMountains(size, start, end, mountainCount);

		// Check if level is solvable (path exists from start to end)
		if (hasDirectPath(start, end, size, mountains)) {
			break; // Found valid configuration!
		}
	}

	// Fallback: if couldn't generate valid level, use simple default configuration
	if (attempts >= maxAttempts) {
		const fallbackStart = { x: 0, y: Math.floor(size / 2) }; // Left middle
		const fallbackEndX = Math.min(4, size - 1); // At least 4 cells to the right
		const fallbackEnd = { x: fallbackEndX, y: Math.floor(size / 2) }; // Right middle
		mountains = generateMountains(size, fallbackStart, fallbackEnd, Math.floor(mountainCount * 0.6));
		start = fallbackStart;
		end = fallbackEnd;
	}

	// Calculate game parameters
	const distance = getManhattanDistance(start, end);
	// Moves: at least distance + some buffer, or minimum based on grid size
	// Formula ensures smaller levels have enough moves, larger levels scale appropriately
	const moves = Math.max(distance + Math.floor(size * 0.5), Math.floor(size * 1.1));
	
	// Time: scales with grid size and moves
	// Base time = size * 3.5 seconds, plus 1.5 seconds per move, minimum 30 seconds
	const time = Math.max(30, Math.floor(size * 3.5) + moves * 1.5);
	
	// Choose initial direction that doesn't hit wall or mountain on first step
	const validDirs = getValidDirections(start.x, start.y, size, mountains);
	const dir = validDirs.length > 0 ? getRandomItem(validDirs) : DIRECTIONS[0];

	return {
		id: levelNumber + 1,
		size,
		dir,
		moves,
		time,
		start,
		end,
		mountains,
	};
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
	const levelNumber = Math.floor(Math.random() * 1000);
	return generateSolvableLevel(levelNumber);
}
