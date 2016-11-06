import 'babel-polyfill';
// import EntityHandler from './entities.js';
import Game from './game.js';
// import PhysicsHandler from './physics.js';

document.addEventListener('DOMContentLoaded', () => {

	const canvas = document.getElementById('game-canvas'),
	      game = new Game(canvas, true);

	game.init();

	window.requestAnimationFrame(() => game.run());
});

