const canvas = document.getElementById("trianglePatternCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Triangle {
  constructor(x, y, sideLength, fastDisappear = false) {
    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    this.opacity = 1;
    this.createdAt = Date.now();
    this.fastDisappear = fastDisappear;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + this.sideLength / 2,
      this.y - (Math.sqrt(3) * this.sideLength) / 2
    );
    ctx.lineTo(this.x + this.sideLength, this.y);
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 0, 255, ${this.opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x + this.sideLength > canvas.width) {
      this.dx = -this.dx;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.dy = -this.dy;
    }
  }

  updateOpacity() {
    const elapsedTime = Date.now() - this.createdAt;
    const fadeDuration = this.fastDisappear ? 5000 : 20000;
    if (elapsedTime > fadeDuration) {
      this.opacity -= 0.01;
    }
  }

  getVertices() {
    return [
      { x: this.x, y: this.y },
      {
        x: this.x + this.sideLength / 2,
        y: this.y - (Math.sqrt(3) * this.sideLength) / 2,
      },
      { x: this.x + this.sideLength, y: this.y },
    ];
  }
}

function createTriangle(x, y, fastDisappear = false) {
  const sideLength = 40;
  const triangle = new Triangle(x, y, sideLength, fastDisappear);
  triangles.push(triangle);
}

function connectVertices(vertices1, vertices2) {
  vertices1.forEach((vertex1) => {
    vertices2.forEach((vertex2) => {
      ctx.beginPath();
      ctx.moveTo(vertex1.x, vertex1.y);
      ctx.lineTo(vertex2.x, vertex2.y);
      ctx.strokeStyle = `rgba(0, 0, 255, ${Math.min(
        vertex1.opacity,
        vertex2.opacity
      )})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  });
}

let triangles = [];

function animateTriangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  triangles.forEach((triangle, index) => {
    triangle.move();
    triangle.updateOpacity();
    triangle.draw();

    for (let i = index + 1; i < triangles.length; i++) {
      connectVertices(triangle.getVertices(), triangles[i].getVertices());
    }
  });

  triangles = triangles.filter((triangle) => triangle.opacity > 0);

  requestAnimationFrame(animateTriangles);
}

canvas.addEventListener("click", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  if (triangles.length >= 10) {
    triangles.shift();
  }
  createTriangle(x, y, triangles.length >= 9);
});

animateTriangles();
