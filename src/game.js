import { Entity, EntityHandler } from './entities.js';
import PhysicsHandler from './physics.js';

class Game {

	constructor(element, debug = false, file) {
		this.element = element;
		this.context = this.element.getContext('2d');
		this.running = false;
		this.file = file;
		this.lastFrame = new Date().getTime();
		this.physics = new PhysicsHandler(element);
		this.entityHandler = new EntityHandler(this.physics);
		this.debug = debug;
	}

	init() {
		// this.loadLevel();
		this.running = true;

		for (var i = 50; i >= 0; i--) {
			let entity = new Entity({
				name: "Test Shape " + i,
				x: Math.random() * 400,
				y: Math.random() * 20,
				width: 30,
				height: 30,
				type: "dynamic"
			});

			this.entityHandler.addEntity(entity);
		}

		let entity2 = new Entity({
			name: "Test Shape 2",
			x: 0,
			y: 300,
			width: 500,
			height: 10,
			type: "static"
		});

		this.entityHandler.addEntity(entity2);
		this.physics.init();
		this.entityHandler.init();
	}

	run() {
		const currentTime = new Date().getTime();
		let deltaTime = (currentTime - this.lastFrame) / 1000;

		if (this.debug) {
			document.getElementById('debug').innerHTML = Math.floor(1 / deltaTime);
		}

		// Escape if not playing.
		if (this.running === false) return;

		window.requestAnimationFrame(() => this.run());

		if (deltaTime > 1 / 15) deltaTime = 1 / 15;

		this.update(deltaTime);
		this.lastFrame = currentTime;
		this.render();
	}

	render() {
		this.context.clearRect(0, 0, this.element.width, this.element.height);

		// Save the context before transformations.
		this.context.save();
		this.context.scale(1, 1);

		this.context.restore();

		this.physics.render();
		this.entityHandler.render(this.context);
	}

	update(dt) {
		this.physics.update(dt);
		this.entityHandler.update();
	}

	loadLevel(level = '') {
		document.write(level);
	}

	close() {
		this.running = false;
	}
}

export { Game as default };
