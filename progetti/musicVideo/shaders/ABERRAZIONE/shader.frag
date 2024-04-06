precision mediump float;

uniform sampler2D sfondo;
uniform float intensita;

varying vec2 vTexCoord;
  
void main() {
  vec2 uv = vTexCoord;
  vec2 uv_flip = vec2(uv.x,1.-uv.y);

  vec2 shift = (uv_flip - vec2(.5,.5));
  float lung = distance(shift,vec2(0.,0.));
  shift = normalize(shift) * pow(lung,2.) * 0.085 * intensita;
  
  float R = texture2D(sfondo, uv_flip+shift).r;
  float G = texture2D(sfondo, uv_flip).g;
  float B = texture2D(sfondo, uv_flip-shift).b;
    
  gl_FragColor = vec4(R,G,B, 1.);
}


