precision mediump float;

varying  vec2 Particle_Position;
varying  float Particle_lifeTime;
varying  float Particle_Duration;
varying  vec2 Particle_Direction;

void main() {

  gl_Position = vec4(Particle_Position, 0.0, 1.0);
}
