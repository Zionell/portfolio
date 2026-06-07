<script setup lang="ts">
import {
	Flowmap,
	Geometry,
	Mesh,
	Program,
	Renderer,
	Texture,
	Vec2,
	Vec4,
} from "ogl";
import { fragment, vertex } from "~/assets/data/ogl-data";
const wrapperRef = useTemplateRef<HTMLElement>("wrapperRef");

const SIZE = [2048, 1638] as const;
const imageAspect = SIZE[1] / SIZE[0];
const aspect = shallowRef(1);
const mouse = new Vec2(-1);
const velocity = new Vec2();

const isTouchDevice = () =>
	"ontouchstart" in window ||
	navigator.maxTouchPoints > 0 ||
	window.matchMedia("(pointer: coarse)").matches;

const getScale = () => {
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	let a1, a2;
	if (windowHeight / windowWidth < imageAspect) {
		a1 = 1;
		a2 = windowHeight / windowWidth / imageAspect;
	} else {
		a1 = (windowWidth / windowHeight) * imageAspect;
		a2 = 1;
	}

	return { a1, a2 };
};

const initAnimation = () => {
	const renderer = new Renderer({ dpr: 2 });
	const gl = renderer.gl;

	wrapperRef.value?.appendChild(gl.canvas);

	function resize() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		gl.canvas.width = windowWidth * 2.0;
		gl.canvas.height = windowHeight * 2.0;
		gl.canvas.style.width = windowWidth + "px";
		gl.canvas.style.height = windowHeight + "px";

		mesh.program.uniforms.res.value = new Vec4(
			windowWidth,
			windowHeight,
			getScale().a1,
			getScale().a2,
		);

		renderer.setSize(windowWidth, windowHeight);
		aspect.value = windowWidth / windowHeight;
	}
	const flowmap = new Flowmap(gl, {
		falloff: 0.3,
		dissipation: 0.92,
		alpha: 0.5,
	});
	const geometry = new Geometry(gl, {
		position: {
			size: 2,
			data: new Float32Array([-1, -1, 3, -1, -1, 3]),
		},
		uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
	});
	const texture = new Texture(gl, {
		minFilter: gl.LINEAR,
		magFilter: gl.LINEAR,
	});
	const img = new Image();
	img.onload = () => (texture.image = img);
	img.crossOrigin = "Anonymous";
	img.src = "/images/hero.png";

	const program = new Program(gl, {
		vertex,
		fragment,
		uniforms: {
			uTime: { value: 0 },
			tWater: { value: texture },
			res: {
				value: new Vec4(
					window.innerWidth,
					window.innerHeight,
					getScale().a1,
					getScale().a2,
				),
			},
			img: { value: new Vec2(SIZE[1], SIZE[0]) },
			tFlow: flowmap.uniform,
		},
	});

	const mesh = new Mesh(gl, { geometry, program });
	window.addEventListener("resize", resize, false);
	resize();

	wrapperRef.value?.addEventListener("mousemove", updateMouse, false);

	let lastTime;
	const lastMouse = new Vec2();

	function updateMouse(e) {
		e.preventDefault();

		if (e.changedTouches && e.changedTouches.length) {
			e.x = e.changedTouches[0].pageX;
			e.y = e.changedTouches[0].pageY;
		}
		if (e.x === undefined) {
			e.x = e.pageX;
			e.y = e.pageY;
		}
		// Get mouse value in 0 to 1 range, with y flipped
		mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);
		// Calculate velocity
		if (!lastTime) {
			// First frame
			lastTime = performance.now();
			lastMouse.set(e.x, e.y);
		}

		const deltaX = e.x - lastMouse.x;
		const deltaY = e.y - lastMouse.y;

		lastMouse.set(e.x, e.y);

		const time = performance.now();

		// Avoid dividing by 0
		const delta = Math.max(10.4, time - lastTime);
		lastTime = time;
		velocity.x = deltaX / delta;
		velocity.y = deltaY / delta;
		// Flag update to prevent hanging velocity values when not moving
		velocity.needsUpdate = true;
	}

	requestAnimationFrame(update);

	function update(t) {
		requestAnimationFrame(update);
		// Reset velocity when mouse not moving
		if (!velocity.needsUpdate) {
			mouse.set(-1);
			velocity.set(0);
		}
		velocity.needsUpdate = false;
		flowmap.aspect = aspect.value;
		flowmap.mouse.copy(mouse);
		flowmap.velocity.lerp(velocity, 0.15);
		flowmap.update();
		program.uniforms.uTime.value = t * 0.01;
		renderer.render({ scene: mesh });
	}
};

onMounted(() => {
	if (!isTouchDevice()) {
		nextTick(initAnimation);
	}
});
</script>

<template>
	<div :class="$style.mask" ref="wrapperRef"></div>
</template>

<style module lang="scss">
.mask {
	position: absolute;
	z-index: 20;
	background: white;
	height: 100vh;
	width: 100vw;
	mix-blend-mode: screen;

	canvas {
		position: absolute;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
	}
}
</style>
