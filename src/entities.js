class EntityHandler {
	constructor(physics) {
		this.entities = [];
		this.maxEntities = 1000;
		this.currentID = 1001;
		this.numEntities = 0;
		this.physics = physics;
	}

	init() {
		for (let entity of this.entities) {

			entity.alive = true;
			entity.bodyDef.type = entity.settings.physics_type;

			// Create a new physics body and attach it to the entity.
			if (entity.settings.hasPhysics) {
				entity.physics = this.physics.addBody(entity.bodyDef, entity.id);
			} else { // or set it as a scenery object without physics.
				entity.physics = false;
			}

			/*
			 * Finally look for any components attached to the object and
			 * initialise as necessary.
			 */
			for (let component of entity.components) {
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
		for (let entity of this.entities) {
			if (entity.alive === false) continue;

			for (let component of entity.components) {
				if (typeof component.update === 'undefined' || entity.alive) continue;

				if (component.update(physics, entity.settings).remove) {
					entity.alive = false;
				}
			}

			// Sets an easily accessible position variable for the entity.
			if (entity.physics) {
				entity.pos.x = entity.physics.body.GetPosition().x;
				entity.pos.y = entity.physics.body.GetPosition().y;
				entity.angle = entity.physics.body.GetAngle();
			}
		}
	}

	render(context) {
		for (let entity of this.entities) {
			let bodyDef = entity.bodyDef;

			if (entity.alive === false) continue;

			context.save();
			context.translate(entity.pos.x, entity.pos.y);
			context.rotate(entity.angle);
			context.beginPath();
			context.fillStyle = entity.settings.color;

			if (entity.settings.color === 'circle') {
				context.arc(0, 0, bodyDef.radius, 0, 2 * Math.PI, false);
			} else
				context.fillRect(-bodyDef.width / 2, -bodyDef.height / 2, bodyDef.width, bodyDef.height);

			if (entity.settings.color) {
				switch(bodyDef.shape){
					case "rect": {
						context.fillRect(-bodyDef.width, -bodyDef.height, bodyDef.width, bodyDef.height);
					} break;
					case "circle": {
						context.arc(0, 0, bodyDef.radius, 0, 2 * Math.PI, false);
					}
				}
			}

			context.closePath();
			context.strokeStyle = entity.settings.color;
			context.fill();
			context.stroke();

			for (let component of entity.components) {
				if (typeof component.update === 'undefined') continue;
			}

			context.restore();
		}
	}

	addEntity(entity) {
		this.entities.push(entity);
	}

	removeEntity(entity) {
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
			scale: 1,
			physics_type: this.bodyDef.type,
			drawType: 'colour',
			color: shape.color || '#FF00FF',
			image: false,
			componentNames: shape.componentNames || []
		};
		this.alive = true;
		this.angle = 0;
	}

	onPress() {
		// Click support here?
	}
}

export { EntityHandler, Entity }
