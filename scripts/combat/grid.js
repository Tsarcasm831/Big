// grid.js - Grid system for combat

/**
 * Manages the combat grid, including terrain, obstacles, and line of sight
 */
export class GridManager {
    constructor(width = 20, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.sceneMeshes = []; // References to THREE.js meshes for the grid
    }
    
    /**
     * Initialize the grid with empty cells
     */
    initialize() {
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = {
                    type: 'empty',   // empty, wall, cover, water, etc.
                    unit: null,      // reference to unit on this cell
                    elevation: 0,    // height of the terrain
                    moveCost: 1,     // base movement cost
                    cover: 0         // cover bonus (0-100%)
                };
            }
        }
        
        return this;
    }
    
    /**
     * Generate terrain features on the grid
     * @param {object} options - Options for terrain generation
     */
    generateTerrain(options = {}) {
        const {
            wallDensity = 0.1,
            coverDensity = 0.15,
            tallObstacleDensity = 0.1,
            clearEdges = true,
            clearPlayerArea = true
        } = options;
        
        // Reset grid first
        this.initialize();
        
        // Generate basic terrain randomly
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Skip edges if clearEdges is true
                if (clearEdges && (
                    y < 2 || y >= this.height - 2 || 
                    x < 2 || x >= this.width - 2
                )) {
                    continue;
                }
                
                // Skip player starting area if clearPlayerArea is true
                if (clearPlayerArea && y > this.height - 5) {
                    continue;
                }
                
                // Random terrain generation
                const rand = Math.random();
                if (rand < wallDensity) {
                    this.grid[y][x].type = 'wall';
                    this.grid[y][x].moveCost = Infinity; // Can't move through walls
                    this.grid[y][x].cover = 100; // Full cover
                } else if (rand < wallDensity + tallObstacleDensity) {
                    this.grid[y][x].type = 'tall';
                    this.grid[y][x].moveCost = Infinity; // Can't move through walls
                    this.grid[y][x].cover = 100; // Full cover
                } else if (rand < wallDensity + tallObstacleDensity + coverDensity) {
                    this.grid[y][x].type = 'cover';
                    this.grid[y][x].moveCost = 2; // Harder to move through cover
                    this.grid[y][x].cover = 50; // Half cover
                }
            }
        }
        
        return this;
    }
    
    /**
     * Apply a specific terrain layout (for predefined encounters)
     * @param {string} encounterType - Type of encounter to set up
     */
    applyEncounterTerrain(encounterType) {
        // Reset grid first
        this.initialize();
        
        switch (encounterType) {
            case 'AMBUSH':
                // Set up ambush terrain with scattered cover
                this.placeCoverLine(5, 10, 15, 10); // Center line of cover
                this.placeWalls(3, 3, 6, 6); // Top left corner walls
                this.placeWalls(14, 3, 17, 6); // Top right corner walls
                break;
                
            case 'MUTANT_FRENZY':
                // Broken terrain with lots of obstacles
                this.placeRandomObstacles(30, 'cover');
                this.placeRandomObstacles(15, 'wall');
                break;
                
            case 'HIVE_EXECUTION':
                // Open center with fortified edges
                this.placeWalls(0, 0, this.width-1, 2); // Top wall
                this.placeWalls(0, this.height-3, this.width-1, this.height-1); // Bottom wall
                this.placeWalls(0, 0, 2, this.height-1); // Left wall
                this.placeWalls(this.width-3, 0, this.width-1, this.height-1); // Right wall
                break;
                
            case 'CROSS_RETRIEVAL':
                // Cross-shaped cover in the middle
                this.placeCoverLine(this.width/2, 2, this.width/2, this.height-3); // Vertical line
                this.placeCoverLine(2, this.height/2, this.width-3, this.height/2); // Horizontal line
                break;
                
            case 'HUNTED_FOR_SPORT':
                // Dense forest with many obstacles
                this.placeRandomObstacles(50, 'tall');
                this.placeRandomObstacles(20, 'cover');
                break;
                
            case 'BURIED_THREAT':
                // Bunker-like structure
                this.placeWalls(5, 5, 15, 15);
                this.placeCoverLine(10, 5, 10, 15); // Central corridor
                this.placeCoverLine(5, 10, 15, 10); // Central corridor
                break;
                
            case 'CANNIBAL_FEAST':
                // Circular arena
                this.placeCircle(this.width/2, this.height/2, 8, 'wall');
                this.placeCircle(this.width/2, this.height/2, 7, 'empty');
                break;
                
            case 'PSYKER_ROGUE':
                // Center island with water around it
                this.placeCircle(this.width/2, this.height/2, 6, 'cover');
                this.placeCircle(this.width/2, this.height/2, 4, 'empty');
                break;
                
            case 'NIGHTMARE_FOG':
                // Random tall obstacles
                this.placeRandomObstacles(30, 'tall');
                break;
                
            case 'RED_RIBBON':
                // Maze-like corridors
                this.generateMazeTerrain();
                break;
                
            case 'WARLORD_TOLL':
                // Fortress with walls and entrance
                this.placeWalls(5, 5, 15, 15); // Outer walls
                this.setCellType(10, 15, 'empty'); // Entrance
                this.placeRandomObstacles(10, 'cover', 6, 6, 14, 14); // Inner cover
                break;
                
            case 'NIGHTCRAWLER_SWARM':
                // Sparse tall obstacles
                this.placeRandomObstacles(10, 'tall');
                this.placeRandomObstacles(15, 'cover');
                break;
                
            case 'CORRUPTED_PSION':
                // Central altar with concentric rings
                this.placeCircle(this.width/2, this.height/2, 8, 'cover');
                this.placeCircle(this.width/2, this.height/2, 5, 'wall');
                this.placeCircle(this.width/2, this.height/2, 2, 'empty');
                break;
                
            default:
                // Default random terrain
                this.generateTerrain();
                break;
        }
        
        return this;
    }
    
    /**
     * Place a line of a specific terrain type
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @param {string} type - Terrain type to place
     */
    placeCoverLine(x1, y1, x2, y2, type = 'cover') {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        
        while (true) {
            // Set the cell type if in bounds
            if (x1 >= 0 && x1 < this.width && y1 >= 0 && y1 < this.height) {
                this.setCellType(x1, y1, type);
            }
            
            // Break if we've reached the end point
            if (x1 === x2 && y1 === y2) break;
            
            // Calculate next point
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }
    
    /**
     * Place walls in a rectangular area
     * @param {number} x1 - Top left X coordinate
     * @param {number} y1 - Top left Y coordinate
     * @param {number} x2 - Bottom right X coordinate
     * @param {number} y2 - Bottom right Y coordinate
     */
    placeWalls(x1, y1, x2, y2) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                // Only place walls around the perimeter
                if (x === x1 || x === x2 || y === y1 || y === y2) {
                    this.setCellType(x, y, 'wall');
                }
            }
        }
    }
    
    /**
     * Place random obstacles of a specific type
     * @param {number} count - Number of obstacles to place
     * @param {string} type - Type of obstacle (wall, cover, tall)
     * @param {number} minX - Minimum X bound
     * @param {number} minY - Minimum Y bound
     * @param {number} maxX - Maximum X bound
     * @param {number} maxY - Maximum Y bound
     */
    placeRandomObstacles(count, type, minX = 0, minY = 0, maxX = null, maxY = null) {
        maxX = maxX !== null ? maxX : this.width - 1;
        maxY = maxY !== null ? maxY : this.height - 1;
        
        for (let i = 0; i < count; i++) {
            const x = Math.floor(minX + Math.random() * (maxX - minX + 1));
            const y = Math.floor(minY + Math.random() * (maxY - minY + 1));
            
            // Only place if the cell is empty
            if (this.grid[y] && this.grid[y][x] && this.grid[y][x].type === 'empty') {
                this.setCellType(x, y, type);
            }
        }
    }
    
    /**
     * Place a circle of a specific terrain type
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius of the circle
     * @param {string} type - Terrain type to place
     */
    placeCircle(centerX, centerY, radius, type) {
        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                // Check if the point is in the circle
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                if (distance <= radius && x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setCellType(x, y, type);
                }
            }
        }
    }
    
    /**
     * Generate a maze-like terrain pattern
     */
    generateMazeTerrain() {
        // Start with all walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.setCellType(x, y, 'wall');
            }
        }
        
        // Create a maze using a simple algorithm
        const visited = Array(this.height).fill().map(() => Array(this.width).fill(false));
        
        const carve = (x, y) => {
            visited[y][x] = true;
            this.setCellType(x, y, 'empty');
            
            // Directions: right, down, left, up
            const directions = [
                [2, 0], [0, 2], [-2, 0], [0, -2]
            ];
            
            // Shuffle directions for randomness
            for (let i = directions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [directions[i], directions[j]] = [directions[j], directions[i]];
            }
            
            // Try each direction
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                
                // Check if the new position is valid
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && !visited[ny][nx]) {
                    // Carve a path between the current cell and the new cell
                    this.setCellType(x + dx/2, y + dy/2, 'empty');
                    carve(nx, ny);
                }
            }
        };
        
        // Start carving the maze from the center
        carve(Math.floor(this.width/2), Math.floor(this.height/2));
        
        // Add some random cover in open areas
        this.placeRandomObstacles(15, 'cover');
    }
    
    /**
     * Set the type of a specific cell
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} type - Cell type to set
     */
    setCellType(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x].type = type;
            
            // Update cell properties based on type
            switch (type) {
                case 'empty':
                    this.grid[y][x].moveCost = 1;
                    this.grid[y][x].cover = 0;
                    break;
                case 'cover':
                    this.grid[y][x].moveCost = 2;
                    this.grid[y][x].cover = 50;
                    break;
                case 'wall':
                case 'tall':
                    this.grid[y][x].moveCost = Infinity;
                    this.grid[y][x].cover = 100;
                    break;
                case 'water':
                    this.grid[y][x].moveCost = 3;
                    this.grid[y][x].cover = 25;
                    break;
            }
        }
    }
    
    /**
     * Check if a cell is empty and within grid bounds
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if cell is valid and empty
     */
    isCellEmpty(x, y) {
        return (
            x >= 0 && x < this.width && 
            y >= 0 && y < this.height && 
            this.grid[y][x].type !== 'wall' && 
            this.grid[y][x].type !== 'tall' &&
            !this.grid[y][x].unit
        );
    }
    
    /**
     * Check if a cell is valid for movement
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if cell is valid for movement
     */
    isCellValidForMovement(x, y) {
        return (
            x >= 0 && x < this.width && 
            y >= 0 && y < this.height && 
            this.grid[y][x].moveCost !== Infinity &&
            !this.grid[y][x].unit
        );
    }
    
    /**
     * Check if a cell blocks line of sight
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if cell blocks line of sight
     */
    doesCellBlockLineOfSight(x, y) {
        return (
            x >= 0 && x < this.width && 
            y >= 0 && y < this.height && 
            (this.grid[y][x].type === 'wall' || this.grid[y][x].type === 'tall')
        );
    }
    
    /**
     * Check if there is line of sight between two points
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @returns {boolean} - True if there is line of sight
     */
    hasLineOfSight(x1, y1, x2, y2) {
        // Bresenham's line algorithm
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        
        let cx = x1;
        let cy = y1;
        
        while (true) {
            // Skip the starting and ending points
            if ((cx !== x1 || cy !== y1) && (cx !== x2 || cy !== y2)) {
                // Check if current cell blocks line of sight
                if (this.doesCellBlockLineOfSight(cx, cy)) {
                    return false;
                }
            }
            
            // Break if we've reached the end point
            if (cx === x2 && cy === y2) break;
            
            // Calculate next point
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                cx += sx;
            }
            if (e2 < dx) {
                err += dx;
                cy += sy;
            }
        }
        
        return true;
    }
    
    /**
     * Get cells reachable from a position with given movement points
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {number} movePoints - Movement points available
     * @returns {Array} - Array of reachable cells
     */
    getReachableCells(startX, startY, movePoints) {
        const reachable = [];
        const visited = Array(this.height).fill().map(() => Array(this.width).fill(false));
        
        // Queue for BFS: [x, y, remaining move points]
        const queue = [[startX, startY, movePoints]];
        visited[startY][startX] = true;
        
        while (queue.length > 0) {
            const [x, y, mp] = queue.shift();
            
            // Add this cell to reachable cells (except starting position)
            if (x !== startX || y !== startY) {
                reachable.push({ x, y });
            }
            
            // Check adjacent cells
            const directions = [
                [1, 0], [0, 1], [-1, 0], [0, -1]
            ];
            
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                
                // Check if the new position is valid
                if (this.isCellValidForMovement(nx, ny) && !visited[ny][nx]) {
                    const cost = this.grid[ny][nx].moveCost;
                    
                    // Check if we have enough move points left
                    if (mp >= cost) {
                        visited[ny][nx] = true;
                        queue.push([nx, ny, mp - cost]);
                    }
                }
            }
        }
        
        return reachable;
    }
    
    /**
     * Get the movement path between two points
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {number} endX - Target X coordinate
     * @param {number} endY - Target Y coordinate
     * @returns {Array} - Array of path coordinates
     */
    getPath(startX, startY, endX, endY) {
        // A* pathfinding algorithm
        const openSet = [];
        const closedSet = {};
        const cameFrom = {};
        
        // g score: cost from start to current node
        // h score: heuristic cost from current to end
        // f score: g + h
        const gScore = {};
        const fScore = {};
        
        // Initialize scores
        gScore[`${startX},${startY}`] = 0;
        fScore[`${startX},${startY}`] = this.heuristic(startX, startY, endX, endY);
        
        // Add start to open set
        openSet.push([startX, startY]);
        
        while (openSet.length > 0) {
            // Find node with lowest f score
            let lowestIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                const [x, y] = openSet[i];
                const [currentX, currentY] = openSet[lowestIndex];
                
                if (fScore[`${x},${y}`] < fScore[`${currentX},${currentY}`]) {
                    lowestIndex = i;
                }
            }
            
            const [currentX, currentY] = openSet[lowestIndex];
            
            // Check if we reached the end
            if (currentX === endX && currentY === endY) {
                // Reconstruct path
                const path = [];
                let current = `${currentX},${currentY}`;
                
                while (current) {
                    const [x, y] = current.split(',').map(Number);
                    path.unshift({ x, y });
                    current = cameFrom[current];
                }
                
                return path;
            }
            
            // Remove current from open set
            openSet.splice(lowestIndex, 1);
            
            // Add current to closed set
            closedSet[`${currentX},${currentY}`] = true;
            
            // Check neighbors
            const directions = [
                [1, 0], [0, 1], [-1, 0], [0, -1]
            ];
            
            for (const [dx, dy] of directions) {
                const nx = currentX + dx;
                const ny = currentY + dy;
                
                // Skip if not valid for movement or already in closed set
                if (!this.isCellValidForMovement(nx, ny) || closedSet[`${nx},${ny}`]) {
                    continue;
                }
                
                // Calculate tentative g score
                const moveCost = this.grid[ny][nx].moveCost;
                const tentativeGScore = gScore[`${currentX},${currentY}`] + moveCost;
                
                // Check if neighbor is new or if we found a better path
                const neighborKey = `${nx},${ny}`;
                const isInOpenSet = openSet.some(([x, y]) => x === nx && y === ny);
                
                if (!isInOpenSet || tentativeGScore < gScore[neighborKey]) {
                    // Record this path
                    cameFrom[neighborKey] = `${currentX},${currentY}`;
                    gScore[neighborKey] = tentativeGScore;
                    fScore[neighborKey] = tentativeGScore + this.heuristic(nx, ny, endX, endY);
                    
                    // Add to open set if not already there
                    if (!isInOpenSet) {
                        openSet.push([nx, ny]);
                    }
                }
            }
        }
        
        // No path found
        return [];
    }
    
    /**
     * Heuristic function for A* pathfinding (Manhattan distance)
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @returns {number} - Heuristic value
     */
    heuristic(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }
}