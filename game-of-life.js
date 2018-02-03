const conwayGame = () => {

		let w = (() => { return window.innerWidth >= 550 ? 500 : parseInt((window.innerWidth - 10) / 10, 10) * 10})(), 
		h  = w,
		grid = 50,
		size = Math.floor(w / grid),
		list = [],
		row = [],
		gen = 0,
		speed = 15,
		animeId = undefined;
	const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	function Shape (x, y, w, fill) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.fill = fill;
	}
	const draw = (cell) => {
		let canvas = document.getElementById("board");
		let context = canvas.getContext("2d");

		context.clearRect(0, 0, w, h);

		for (i in cell) {
			if (cell[i].x * cell[i].w <= w) {
				oRec = cell[i];
				context.beginPath();
				context.fillStyle = oRec.fill;
				context.fillRect(oRec.x * oRec.w, oRec.y * oRec.w, oRec.w, oRec.w);
				context.closePath();
			}
		}
	}
	const init = () => {
		let canvas = document.getElementById("board");
		let context = canvas.getContext("2d");
		canvas.width = w;
		canvas.height = h;
		
		const checkBtn = (type, id) => {
			let btnList;
			if (type === "speed") {
					btnList = document.querySelectorAll(".speed-btn");
				} else if (type === "grid") {
					btnList = document.querySelectorAll(".grid-btn");
				}
				btnList.forEach(item => {
					if(id === item.id) {
						document.getElementById(item.id).classList.add("active");
						} else {
						document.getElementById(item.id).classList.remove("active");
					}
				});
		}
		
		checkBtn("speed", "medium");
		checkBtn("grid", "50");
		document.getElementById('start').addEventListener('click', (e) => { game.start(); })
		document.getElementById('stop').addEventListener('click', (e) => { game.stop(); })
		document.getElementById('reset').addEventListener('click', (e) => { game.reset(); })
		document.getElementById('10').addEventListener('click', (e) => { grid = 10; game.reset(); checkBtn("grid", "10"); })
		document.getElementById('50').addEventListener('click', (e) => { grid = 50; game.reset(); checkBtn("grid", "50"); })
		document.getElementById('100').addEventListener('click', (e) => { grid = 100; game.reset(); checkBtn("grid", "100"); })
		
		
		document.getElementById('slow').addEventListener('click', (e) => { speed = 5; checkBtn("speed", "slow"); })
		document.getElementById('medium').addEventListener('click', (e) => { speed = 10; checkBtn("speed", "medium"); })
		document.getElementById('fast').addEventListener('click', (e) => { speed = 15; checkBtn("speed", "fast"); })
		
		document.getElementById('gen').innerHTML = gen;
		

		//create random cells
		game.reset();
		
		game.start();
	}
	const gridSize = (col) => {
		row = [];
		size = Math.floor(w / col);
		
		let strokeCanvas = document.getElementById("stroke");
		let strokeContext = strokeCanvas.getContext("2d");
		strokeCanvas.width = w;
		strokeCanvas.height = h;
		strokeContext.clearRect(0, 0, w, h);
		
		//~ strokeContext.fillRect(0, 0, w, h, "#607D8B");
		
		if(row.length === 0) {
			for (let y = 0; y < col; y++) {
				row.push([]);
			}
		}

		for (let x = 0; x <= h; x+=size) { // draw horizontal line
			strokeContext.moveTo(x, 0);
			strokeContext.lineTo(x, h);
		}
		for (let x = 0; x <= h; x+=size) { // draw vertical line
			strokeContext.moveTo(0, x);
			strokeContext.lineTo(w, x);
		}
		strokeContext.strokeStyle = "#ccc";
		strokeContext.stroke();
		
		}
	const update = () => {
		list = [];
		const neighbours = [
	      [-1, -1], [0, -1], [1, -1],  // above
	      [-1,  0],          [1,  0],  // our row
	      [-1,  1], [0,  1], [1,  1]]; // below

	    //credit: https://codereview.stackexchange.com/questions/38746/conways-game-of-life-in-javascript
	    const checkNeighbour = (dim, pos, direction) => {
	    	return (pos + direction + dim) % dim;
	    }

	    const checkCells = (func) => {
	    	for (let y = 0; y < row.length; y++) {
	    		for (let x = 0; x < grid; x++) {
	    		//loop rows and reset counter per item
	    		if(func === "checkNeighbour") {
	    			let counter = 0;
	    			neighbours.forEach((item, index) => {
	    				let neighX = checkNeighbour(grid, x, item[0]);
	    				let neighY = checkNeighbour(grid, y, item[1]);
	    				if (neighX >= 0 && neighY >= 0 && row[neighY][neighX].status) {
	    					counter++;
	    				}
	    		}); //end of checking neighbours
	    			row[y][x].counter = counter;
	    		} else if(func === "update") {
	    			if (row[y][x].status && row[y][x].counter < 2 || row[y][x].counter > 3) {
	    				row[y][x].status = false;
	    			} else if (row[y][x].counter === 3 || row[y][x].status && row[y][x].counter === 2) {
	    				if (row[y][x].status) {
	    					list.push(new Shape (x, y, size, "#FF5722")); //still living from last generations
	    				} else {
		    				row[y][x].status = true;
		    				list.push(new Shape (x, y, size, "#FFCCBC")); //alive
	    				}
	    			}
	    		}
	    	}
	    }
	}

	checkCells("checkNeighbour");
	checkCells("update");

	if(list.length !== 0) {
		game.draw(list);
		gen++;
		document.getElementById('gen').innerHTML = gen;
	} else {
		game.draw(list);
		game.stop();
		document.getElementById('gen').innerHTML = "Generation ends";
	}
}
	const start = (time) => {
		if(list.length === 0) { game.stop(); game.reset(); }
		
		animeId = setTimeout(function() {
			requestAnimationFrame(start);
		}, 1000 / speed);
		
		game.update();
	}
	const stop = () => {
		if(animeId) {
			clearTimeout(animeId);
			animeId = undefined;
		}
	}
	const reset = () => {

		console.log("reset");

		//reset
		cancelAnimationFrame(animeId);
		gen = 0;
		row = [];
		list = [];
		document.getElementById('gen').innerHTML = gen;
		animeId = undefined;
		
		game.gridSize(grid);
		
		let canvas = document.getElementById("board");
		let context = canvas.getContext("2d");
		context.clearRect(0, 0, w, h);
		

		for (let y = 0; y < row.length; y++) {
			for (let x = 0; x < grid; x++) {
				//create random initial status
				row[y].push({status: Math.random() >= 0.7});
				if(row[y][x].status) {
					list.push(new Shape (x, y, size, "#FFCCBC"));
				}
			}
		}
		game.draw(list);
	}
	const game = {
		init,
		draw,
		gridSize,
		update,
		start,
		stop,
		reset
	}
	game.init();
}
conwayGame();
