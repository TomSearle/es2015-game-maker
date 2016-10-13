import 'babel-polyfill';
import Game from './game.js';

import PhysicsHandler from './physics.js';
import EntityHandler from './entities.js';

document.addEventListener('DOMContentLoaded', () => {

	const canvas = document.getElementById('game-canvas');

	let game = new Game(canvas, true);
	game.init();

	window.requestAnimationFrame(() => game.run());

});

