import physicsHandler from './physics.js';

var MODE = 'edit';

class EntityHandler {
	constructor() {
		this.entities = [];
		this.maxEntities = 1000;
		this.currentID = 1001;
		this.numEntities = 0;
	}

	init() {
		for (let entity in this.entities) {
			entity.alive = true;

			/*
			 * If the editor is being used, the physics engine requires a
			 * physics object to be assigned to each object, this allows it to
			 * be selected.
			 */
			entity.bodyDef.type = (MODE === 'edit') ? 'dynamic'
				: entity.settings.physics_type;

			// Create a new physics body and attach it to the entity.
			if (entity.settings.hasPhysics || MODE === 'edit') {
				let newPhysics = physicsHandler.addBody(
						entity.bodyDef, entity.id);

				entity.physics = newPhysics;
			} else { // or set it as a scenery object without physics.
				entity.physics = false;
			}

			/*
			 * Finally look for any components attached to the object and
			 * initialise as necessary.
			 */
			for (let component in entity.components) {
				if (typeof component.init !== 'undefined') {
					component.init({
						physics: entity.physics,
						id: entity.id.id
					});
				}
			}
		}
	}

	load(entities) {
		this.entities = entities;
	}

	update() {
		for (let entity in this.entities) {
			let physics = entity.phyiscs;

			if (entity.alive === false) continue;

			for (let component in entity) {
				if (typeof component.update === 'undefined' || entity.alive) continue;

				if (component.update(physics, entity.settings).remove) {
					entity.alive = false;
				}
			}

			// Sets an easily accessible position variable for the entity.
			if (physics) {
				entity.pos.x |= physics.body.GetPosition().x;
				entity.pos.y |= physics.body.GetPosition().y;
				entity.angle |= physics.body.GetAngle();
			}
		}
	}

	render(context) {
		for (let entity in this.entites) {
			let bodyDef = entity.bodyDef;

			if (entity.alive === false) continue;

			context.save();
			context.translate(entity.pos.x, entity.pos.y);
			context.rotate(entity.angle);
			conext.beginPath();
			context.fillStyle = currentEntity.settings.color;

			if (entity.settings.color === 'circle') {

				let hackyFix = (MODE === "edit") ? 0 : 0.5;

				context.arc(0, 0, bodyDef.radius - hackyFix, 0, 2 * Math.PI, false);
			} else {
				context.fillRect(-bodyDef.width/2, -bodyDef.height/2, bodyDef.width, bodyDef.height);
		}

			if (entity.settings.color) {
				switch(bodyDef.shape){
					case "rect": {
						context.fillRect(-bodyDef.width/2, -bodyDef.height/2, bodyDef.width, bodyDef.height);
					} break;
					case "circle": {
						var hackyFix = (MODE === "edit") ? 0 : 0.5;

						context.arc(0, 0, bodyDef.radius - hackyFix, 0, 2 * Math.PI, false);
					}
				}
			}

			context.closePath();
			context.strokeStyle = entity.settings.color;
			context.fill();
			context.stroke();

			for (let component in entity) {
				if (typeof component.update === 'undefined') continue;
			}
		}
	}

	addEntity(entity) {
		this.entities.push(entity);
	}

	remoteEntity(entity) {
		let index = this.entities.indexOf(entity);

		if(index < 0)
			return;

		entity.delete();

		this.entities.splice(index, 1);
	}

	onPress(entity) {
		entity.onPress();
	}

	toString() {
		return stringify(this.entities);
	}
}

class Entity {
	constructor(shape) {
		this.bodyDef = {
			name: shape.name || 0,
			type: shape.type || 'static',
			shape: shape.shape || shape.name || 'box',
			x: shape.x || 0,
			y: shape.y || 0,
			width: shape.width || 0,
			height: shape.height || 0,
			radius: shape.radius || 0,
			isSensor: shape.isSensor || false
		};
		this.id = '';
		this.components = [];
		this.pos = {
			x: shape.x || 0,
			y: shape.y || 0
		};
		this.settings = {
			title: this.id.name,
			id: this.id.id,
			hasPhysics: true,
			scape: 1,
			physics_type: this.bodyDef.type,
			drawType: 'colour',
			color: shape.color || '#FF00FF',
			image: false,
			componentNames: shape.componentNames || []
		};
		this.isAlive = true;
		this.angle = 0;
	}

	onPress() {
		// Click support here?
	}
}

export {EntityHandler as default}
