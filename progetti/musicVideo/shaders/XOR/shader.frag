precision mediump float;

uniform sampler2D old_frame;
uniform sampler2D changes;

varying vec2 vTexCoord;
  
void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.-uv.y;
  
  vec3 old = texture2D(old_frame, uv).rgb;
  vec3 cng = texture2D(changes, uv).rgb;
  
  bool ra=true,ga=true,ba=true;
  bool rb=true,gb=true,bb=true;
  
  if (old.r>.5) 
    ra = false;
  if (old.g>.5) 
    ga = false;
  if (old.b>.5) 
    ba = false;
  if (cng.r>.5) 
    rb = false;
  if (cng.g>.5) 
    gb = false;
  if (cng.b>.5) 
    bb = false;
  
  float rn = ra==rb?1.:0.;
  float gn = ga==gb?1.:0.;
  float bn = ba==bb?1.:0.;
    
  gl_FragColor = vec4(rn, gn, bn,1.);
}

