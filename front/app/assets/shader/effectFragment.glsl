precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uCursor;
uniform float uScrollVelocity;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform float uBorderRadius;
uniform float uMouseEnter;
uniform vec2 uMouseOverPos;

in vec2 vUv;
in vec2 vUvCover;

#include './resources/noise.glsl';

out vec4 outColor;


void main() {
  vec2 texCoords = vUvCover;

  float aspectRatio = uQuadSize.y / uQuadSize.x;

  float circle = 1.0 - distance(
    vec2(uMouseOverPos.x, (1.0 - uMouseOverPos.y) * aspectRatio),
    vec2(vUv.x, vUv.y * aspectRatio)
  ) * 15.0;

  float noise = snoise(gl_FragCoord.xy);

  texCoords.x += mix(0.0, circle * noise * 0.01, uMouseEnter + uScrollVelocity * 0.1);
  texCoords.y += mix(0.0, circle * noise * 0.01, uMouseEnter + uScrollVelocity * 0.1);

  vec3 texture = vec3(texture(uTexture, texCoords));

  outColor = vec4(texture, 1.0);
}
