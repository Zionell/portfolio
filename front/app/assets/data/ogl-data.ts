export const vertex = `
		attribute vec2 uv;
		attribute vec2 position;
		varying vec2 vUv;
		void main() {
				vUv = uv;
				gl_Position = vec4(position, 0, 1);
		}
`;

export const fragment = `
		precision highp float;
		precision highp int;
		uniform sampler2D tWater;
		uniform sampler2D tFlow;
		uniform float uTime;
		varying vec2 vUv;
		uniform vec4 res;
		uniform vec2 img;

		vec2 centeredAspectRatio(vec2 uvs, vec2 factor){
				return uvs * factor - factor /2. + 0.5;
		}

		void main() {

			// R and G values are velocity in the x and y direction
			// B value is the velocity length
			vec3 flow = texture2D(tFlow, vUv).rgb;

			vec2 uv = .5 * gl_FragCoord.xy / res.xy ;

			// vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
			vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
			myUV -= flow.xy * (0.15 * 1.2);

			vec2 myUV2 = (uv - vec2(0.5))*res.zw + vec2(0.5);
			myUV2 -= flow.xy * (0.125 * 1.2);

			vec2 myUV3 = (uv - vec2(0.5))*res.zw + vec2(0.5);
			myUV3 -= flow.xy * (0.10 * 1.4);

			vec3 tex = texture2D(tWater, myUV).rgb;
			vec3 tex2 = texture2D(tWater, myUV2).rgb;
			vec3 tex3 = texture2D(tWater, myUV3).rgb;

			gl_FragColor = vec4(tex.r, tex2.g, tex3.b, 1.0);
		}
`;
