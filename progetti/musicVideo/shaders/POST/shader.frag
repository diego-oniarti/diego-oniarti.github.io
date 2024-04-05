precision mediump float;

uniform sampler2D frame;
uniform float boom;
uniform int mode;
uniform vec3 tint;

varying vec2 vTexCoord;
  
void main() {
  vec2 uv = vTexCoord;
  vec2 shift = vec2(0.002, 0.001)*pow(boom,.75)*50.;
  
  float colr = texture2D(frame, uv+shift).r;
  float colg = texture2D(frame, uv).g;
  float colb = texture2D(frame, uv-shift).b;

  vec3 col = vec3(colr, colg, colb);
  
  float d = distance(uv, vec2(.5,.5));

  if (mode==0) {
    // flat color
    col *= tint;
  }else if (mode==1) {  
    // white to color
    vec3 target = tint;
    target = target + (1. - target)*(1.-pow(boom,.75));
    col = col*target;
  }else if (mode==2) {
    //black to color
    vec3 target = 1.-tint;
    target = target + (1. - target)*(1.-pow(boom,.50));
    col = 1.-col*target;
  }
  
  if (d>.45) {
    col *= pow(1.-d+.45,1.);
  }
  
  gl_FragColor = vec4(col, 1.);
}

