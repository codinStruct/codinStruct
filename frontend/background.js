// Adapted from a sketch from by yasai: https://openprocessing.org/sketch/494102

// Using p5 instance mode to avoid global variables
var backgroundSketch = new p5(function (p) {
  var particleArrays = [[], [], []];
  var nums;
  var noiseScale = 400;

  var backgroundColor;
  var particleColors = [];

  p.windowResized = function () {
    p.setup();
  };

  p.setup = function () {
    // Colors used in the site with some alpha
    backgroundColor = p.color("#191724");
    particleColors = [
      p.color("#6b4f8f"),
      p.color("#9d7ec2"),
      p.color("#c9d1d9"),
    ];

    // Set canvas to the background div
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("#background");

    // The number of points is proportional to the area
    nums = p.round((p.width * p.height) / 20000);

    p.background(backgroundColor);

    // Particles have a 100px area to go outside the viewing area for better edges
    for (var i = 0; i < nums; i++) {
      for (var pArray of particleArrays)
        pArray[i] = new Particle(
          p.random(-100, p.width + 100),
          p.random(-100, p.height + 100)
        );
    }
  };

  p.draw = function () {
    p.smooth();
    for (var i = 0; i < nums; i++) {
      var weight = p.map(i, 0, nums, 0.5, 2);

      p.strokeWeight(weight);

      for (var [pArrayI, pArray] of particleArrays.entries()) {
        p.stroke(particleColors[pArrayI]);
        pArray[i].move();
        pArray[i].display();
        pArray[i].checkEdge();
      }
    }
  };

  class Particle {
    constructor(x, y) {
      this.dir = p.createVector(0, 0);
      this.vel = p.createVector(0, 0);
      this.pos = p.createVector(x, y);
      this.last_pos = this.pos;
      this.angle =
        p.noise(this.pos.x / noiseScale, this.pos.y / noiseScale) *
        p.TWO_PI *
        noiseScale;
    }

    move() {
      var newAngle =
        p.noise(this.pos.x / noiseScale, this.pos.y / noiseScale) *
        p.TWO_PI *
        noiseScale;

      this.last_pos = this.pos.copy();

      // This makes the movement more smooth
      this.angle = this.interpolateAngle(this.angle, newAngle, 0.5);

      this.dir.x = p.cos(this.angle / 2);
      this.dir.y = p.sin(this.angle / 2);
      this.vel = this.dir.copy();

      // Distance move by the mouse from the previous frame to the current one
      var moved = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);

      this.vel.mult(p.map(moved, 0, 100, 0.1, 1, true));
      this.pos.add(this.vel);
    }

    checkEdge() {
      if (
        this.pos.x > p.width + 100 ||
        this.pos.x < -100 ||
        this.pos.y > p.height + 100 ||
        this.pos.y < -100
      ) {
        this.pos.x = p.random(100, p.width);
        this.pos.y = p.random(100, p.height);
      }
    }

    display() {
      p.line(this.pos.x, this.pos.y, this.last_pos.x, this.last_pos.y);
    }

    interpolateAngle(fromAngle, toAngle, t) {
      // https://math.stackexchange.com/questions/2144234/interpolating-between-2-angles
      return (
        fromAngle +
        (((((toAngle - fromAngle) % p.TWO_PI) + 3 * p.PI) % p.TWO_PI) - p.PI) *
          t
      );
    }
  }
});
