import EntityHandler from './entities.js';
import PhysicsHandler from './physics.js';

class Game {

	constructor(element, debug = false, file) {
		this.element = element;
		this.context = this.element.getContext('2d');
		this.running = false;
		this.file = file;
		this.lastFrame = new Date().getTime();
		this.physics = new PhysicsHandler(element);
		this.entityHandler = new EntityHandler();
		this.debug = debug;
	}

	init() {
		// this.loadLevel();
		this.running = true;
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
