particles = [];
counter = 0;
function setup() {
  createCanvas(1024, 512);
  _fr_ = 64;
  frameRate(_fr_);
  _cpt_ = 200; //calcs per tick
  _scale_ = 32;

}


function draw() {
  background(0);
  
  //walls
  fill(196);
  strokeWeight(0);
  rect(0, 384, width, 128);
  rect(0, 0, 128, 512);
  
  strokeWeight(4);
  for (let n = 128; n < width; n += _scale_) {
    line(n, 384, n, 416);
  }
  
  //move particles
  for (let j = 0; j < _cpt_; j++) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].move();
    }
  }
  
  //show particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].show();
  }
}

function Particle(i, m, x, v, w) {
  this.i = i;
  this.m = m;
  this.x = x;
  this.v = v;
  this.w = w;
  
  this.show = function() {
    let _x_ = this.x*_scale_ + 128;
    let _w_ = this.w*_scale_;
    
    strokeWeight(0);
    fill(255);
    rect(_x_, 384 - _w_, _w_, _w_);
    
    textAlign(CENTER, CENTER);
    fill(0);
    text(this.m, _x_ + 0.5*_w_, 384 - 0.5*_w_);
  };
  
  this.move = function() {
    if (this.x < 0) {
      counter++;
      print("collisions: " + counter);
      
      this.v *= -1;
    }
    this.collide();
    this.x += this.v/(_fr_*_cpt_);
  };
  
  this.collide = function() {
    for (let j = 0; j < particles.length; j++) {
      let that = particles[j];
      if (j <= this.i) {
        continue;
      }
      
      let _w_;
      if (this.x < that.x) {
        _w_ = this.w;
      } else {
        _w_ = that.w;
      }

      if (abs(this.x - that.x) <= _w_) {
        counter++;
        print("collisions: " + counter);
        
        let p = this.m*this.v + that.m*that.v;
        let K = 0.5*(this.m*this.v*this.v + that.m*that.v*that.v);
        
        let A = 0.5*this.m + 0.5*this.m*this.m/that.m;
        let B = -p*this.m/that.m;
        let C = 0.5*p*p/that.m - K;
        let poss = quad_form(A, B, C);
        
        if (abs(poss[0] - this.v) < abs(poss[1] - this.v)) {
          this.v = poss[1];
        } else {
          this.v = poss[0];
        }
        
        that.v = (p - this.m*this.v)/that.m;

        if (that.x > this.x) {
          that.x = this.x + this.w;
        } else {
          this.x = that.x + that.w;
        }
      }
    }
  };
}

function quad_form(a, b, c) {
  numer1 = -b;
  numer2 = sqrt(b*b - 4*a*c);
  denom = 2*a;
  
  return [(numer1 + numer2)/denom, (numer1 - numer2)/denom];
}

function prep(mass) {
    counter = 0;
    // -----------------------  i, m,       x,  v,     w
    particles[0] = new Particle(0, 1,       1,  0,     2);
    particles[1] = new Particle(1, mass,       5,  0,    2);
}

function start() {
    particles[1].v = -1;
}

function mouseWheel(event) {
    _fr_ += event.delta/150;
    if (_fr_ < 1) {
        _fr_ = 1
    }
}