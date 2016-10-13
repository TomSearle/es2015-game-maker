import Box2D from 'box2dweb';

// Namespaces for commonly used Box2D objects
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2AABB = Box2D.Collision.b2AABB;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

class Body {
	constructor(id, details) {
		this.details = details;

		// Convert canvas positions to box2d positions.
		this.halfWidth = details.width / 2;
		this.halfHeight = details.height / 2;

		// Create the definition
		this.definition = new b2BodyDef();
		this.definition.position
			= new b2Vec2(details.x + this.halfWidth || 0,
					details.y + this.halfHeight || 0);
		this.definition.linearVelocity = new b2Vec2(details.vx || 0,
				details.vy || 0);

		this.id = id.id;
		this.name = id.name;

		this.definition.type = {
			'static': b2Body.b2_staticBody,
			'kinematic': b2Body.b2_kinematicBody,
			'dynamic': b2Body.b2_dynamicBody
		}[details.type || 'dynamic'];

		// Create body
		this.body = this.physics.world.CreateBody(this.definition);

		this.fixtureDef = this.createFixture();

		this.body.CreateFixture(this.fixtureDef);
	}

	createFixture() {
		let fixtureDef = new b2FixtureDef();

		fixtureDef = Object.assign(fixtureDef, {
			density: 2,
			friction: 1,
			restitution: 0.2,
			isSensor: false
		});

		fixtureDef.userData = this;

		fixtureDef.shape = new b2PolygonShape();
		fixtureDef.SetAsBox((this.details.width || 2 / 2),
			(this.details.height || 2) / 2);

		return fixtureDef;
	}
}

class CircleBody extends Body {
	createFixture() {
		let fixtureDef = new b2FixtureDef();

		fixtureDef = Object.assign(fixtureDef, {
			density: 2,
			friction: 1,
			restitution: 0.2,
			isSensor: false
		});

		fixtureDef.userData = this;

		this.fixtureDef.shape = new b2CircleShape(this.details.radius || 1);

		return fixtureDef;
	}
}

class PolyBody extends Body {
	createFixture() {
		let fixtureDef = new b2FixtureDef();

		fixtureDef = Object.assign(fixtureDef, {
			density: 2,
			friction: 1,
			restitution: 0.2,
			isSensor: false
		});

		fixtureDef.userData = this;

		fixtureDef.shape.SetAsArray(this.details.points, this.details.length);

		return fixtureDef;
	}
}

class PhysicsHandler {

	constructor(element, world) {
		this.conversionScale = 20;
		this.gravity = new b2Vec2(0, 9.8);
		this.world = world || new b2World(this.gravity, true);
		this.context = element.getContext('2d');
		this.scale = 1;
		this.dtRemaining = 0;
		this.stepAmount = 1 / 60;
		this.seletedBody = null;
	}

	debug() {
		let debugDraw = new b2DebugDraw();

		debugDraw.SetSprite(this.context);
		debugDraw.SetDrawScale(this.scale);
		debugDraw.SetFillAplpha(0.3);
		debugDraw.SetLineThickness(0.1);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

		this.world.SetDebugDraw(this.debugDraw);
	}

	step(dt) {
		this.dtRemaining += dt;
		while (this.dtRemaining > this.stepAmount) {
			this.dtRemaining -= this.stepAmount;
			this.world.Step(this.stepAmount,
					10,  // Velocity iterations
					10); // position iterations
		}
	}

	init() {
		this.debug();
	}

	update(dt) {
		this.step(dt);
	}

	render() {
		if (this.debug) {
			this.world.DrawDebugData();
		}
	}

	getBodyAtMouse() {
		let mousePVec, aabb;

		if (window.mouseX === window.mouseY === undefined) return;

		mousePVec = new b2Vec2(window.mouseX, window.mouseY);
		aabb = new b2AABB();
		aabb.lowerBound.Set(window.mouseX = 0.001, window.mouseY - 0.001);
		aabb.upperBound.Set(window.mouseX = 0.001, window.mouseY - 0.001);

		// Query the world for overlapping shapes.
		this.selectedBody = null;
		this.world.QueryAABB((fix) => {
			if (fix.GetBody().GetType() === b2Body.b2_staticBody) return true;
			if (fix.GetShape().TestPoint(fix.GetBody().GetTransform(),
						mousePVec)) {
				this.selectedBody = fix.GetBody();
				return false;
			}

			return true;
		}, aabb);
		return this.selectedBody;
	}

	addPolyBody(details, id) {
		return new PolyBody(id, details);
	}

	addCircleBody(details, id) {
		return new CircleBody(id, details);
	}

	addBody(details, id) {
		return new Body(id, details);
	}

	destroyBody(body) {
		if (this.world && body) this.world.DestroyBody(body);
	}
}
export {PhysicsHandler as default};
