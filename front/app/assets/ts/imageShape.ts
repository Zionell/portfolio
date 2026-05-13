import Lenis from "lenis";
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import * as THREE from "three";
import { resizeThreeCanvas, calcFov, debounce, lerp } from "./utils";

import effectVertex from "../shader/effectVertex.glsl";
import effectFragment from "../shader/effectFragment.glsl";

gsap.registerPlugin(CustomEase);

// cursor position
const CAMERA_POS = 500;
let cursorPos = {
	current: { x: 0.5, y: 0.5 },
	target: { x: 0.5, y: 0.5 },
};

let cursorRaf: number | null = null;

const lerpCursorPos = () => {
	const x = lerp(cursorPos.current.x, cursorPos.target.x, 0.05);
	const y = lerp(cursorPos.current.y, cursorPos.target.y, 0.05);

	cursorPos.current.x = x;
	cursorPos.current.y = y;

	const delta = Math.sqrt(
		(cursorPos.target.x - cursorPos.current.x) ** 2 +
			(cursorPos.target.y - cursorPos.current.y) ** 2,
	);

	if (delta < 0.001 && cursorRaf) {
		cancelAnimationFrame(cursorRaf);
		cursorRaf = null;
		return;
	}

	cursorRaf = requestAnimationFrame(lerpCursorPos);
};

export const initImageShape = (wrapper: HTMLElement) => {
	let scroll = {
		scrollY: window.scrollY,
		scrollVelocity: 0,
		smoothedVelocity: 0,
	};
	let mediaStore: any[] = [];
	let innerWidth = window?.innerWidth ?? 1920;
	let innerHeight = window?.innerHeight ?? 1080;
	const canvas = wrapper.querySelector("canvas") as HTMLElement;
	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		alpha: true,
		antialias: true,
	});
	const scene: THREE.Scene = new THREE.Scene();
	const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
		50,
		innerWidth / innerHeight,
		10,
		1000,
	);
	const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
	const material = new THREE.ShaderMaterial({
		uniforms: {
			uResolution: {
				value: new THREE.Vector2(innerWidth, innerHeight),
			},
			uTime: { value: 0 },
			uCursor: { value: new THREE.Vector2(0.5, 0.5) },
			uScrollVelocity: { value: 0 },
			uTexture: { value: null },
			uTextureSize: { value: new THREE.Vector2(100, 100) },
			uQuadSize: { value: new THREE.Vector2(100, 100) },
			uBorderRadius: { value: 0 },
			uMouseEnter: { value: 0 },
			uMouseOverPos: { value: new THREE.Vector2(0.5, 0.5) },
		},
		vertexShader: effectVertex,
		fragmentShader: effectFragment,
		glslVersion: THREE.GLSL3,
	});
	const lenis = new Lenis();
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry: IntersectionObserverEntry) => {
				if ("dataset" in entry.target) {
					const index: number = entry.target?.dataset?.index || -1;

					if (index && mediaStore?.[index]) {
						mediaStore[index].isInView = entry.isIntersecting;
					}
				}
			});
		},
		{ rootMargin: "500px 0px 500px 0px" },
	);

	lenis.on("scroll", (e) => {
		scroll.scrollY = window.scrollY;
		scroll.scrollVelocity = e.velocity;
	});

	function scrollRaf(time: number): void {
		lenis.raf(time);
		requestAnimationFrame(scrollRaf);
	}

	function setMediaStore(scrollY: number) {
		const media = [
			...document.querySelectorAll("[data-webgl-media]"),
		] as HTMLImageElement[];

		mediaStore = media.map((media: HTMLImageElement, i: number) => {
			observer.observe(media);

			media.dataset.index = String(i);
			media.addEventListener("mouseenter", () => handleMouseEnter(i));
			media.addEventListener("mousemove", (e) => handleMousePos(e, i));
			media.addEventListener("mouseleave", () => handleMouseLeave(i));

			const bounds = media.getBoundingClientRect();
			const imageMaterial = material.clone();

			const imageMesh = new THREE.Mesh(geometry, imageMaterial);

			const texture = new THREE.Texture(media);
			texture.needsUpdate = true;

			imageMaterial.uniforms.uTexture.value = texture;
			imageMaterial.uniforms.uTextureSize.value.x = media.naturalWidth;
			imageMaterial.uniforms.uTextureSize.value.y = media.naturalHeight;
			imageMaterial.uniforms.uQuadSize.value.x = bounds.width;
			imageMaterial.uniforms.uQuadSize.value.y = bounds.height;
			imageMaterial.uniforms.uBorderRadius.value = getComputedStyle(
				media,
			).borderRadius.replace("px", "");

			imageMesh.scale.set(bounds.width, bounds.height, 1);

			if (!(bounds.top >= 0 && bounds.top <= innerHeight)) {
				imageMesh.position.y = 2 * innerHeight;
			}

			scene.add(imageMesh);

			return {
				media,
				material: imageMaterial,
				mesh: imageMesh,
				width: bounds.width,
				height: bounds.height,
				top: bounds.top + scrollY,
				left: bounds.left,
				isInView: bounds.top >= -500 && bounds.top <= innerHeight + 500,
				mouseEnter: 0,
				mouseOverPos: {
					current: {
						x: 0.5,
						y: 0.5,
					},
					target: {
						x: 0.5,
						y: 0.5,
					},
				},
			};
		});
	}

	function handleMouseEnter(index: number): void {
		gsap.to(mediaStore[index], {
			mouseEnter: 1,
			duration: 0.6,
			ease: CustomEase.create("custom", "0.4, 0, 0.2, 1"),
		});
	}

	function handleMousePos(e: MouseEvent, index: number): void {
		const bounds = mediaStore[index].media.getBoundingClientRect();
		const x = e.offsetX / bounds.width;
		const y = e.offsetY / bounds.height;

		mediaStore[index].mouseOverPos.target.x = x;
		mediaStore[index].mouseOverPos.target.y = y;
	}

	function handleMouseLeave(index: number): void {
		gsap.to(mediaStore[index], {
			mouseEnter: 0,
			duration: 0.6,
			ease: CustomEase.create("custom", "0.4, 0, 0.2, 1"),
		});
		gsap.to(mediaStore[index].mouseOverPos.target, {
			x: 0.5,
			y: 0.5,
			duration: 0.6,
			ease: CustomEase.create("custom", "0.4, 0, 0.2, 1"),
		});
	}

	function setPositions(): void {
		mediaStore.forEach((object) => {
			if (object.isInView) {
				object.mesh.position.x =
					object.left - innerWidth / 2 + object.width / 2;
				object.mesh.position.y =
					-object.top +
					innerHeight / 2 -
					object.height / 2 +
					scroll.scrollY;
			}
		});
	}

	camera.position.z = CAMERA_POS;
	camera.fov = calcFov(CAMERA_POS);
	camera.updateProjectionMatrix();

	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	function render(time = 0) {
		time /= 1000;
		scroll.smoothedVelocity = lerp(
			scroll.smoothedVelocity,
			scroll.scrollVelocity,
			0.08,
		);

		mediaStore.forEach((object) => {
			if (object.isInView) {
				object.mouseOverPos.current.x = lerp(
					object.mouseOverPos.current.x,
					object.mouseOverPos.target.x,
					0.05,
				);
				object.mouseOverPos.current.y = lerp(
					object.mouseOverPos.current.y,
					object.mouseOverPos.target.y,
					0.05,
				);

				object.material.uniforms.uResolution.value.x = innerWidth;
				object.material.uniforms.uResolution.value.y = innerHeight;
				object.material.uniforms.uTime.value = time;
				object.material.uniforms.uCursor.value.x = cursorPos.current.x;
				object.material.uniforms.uCursor.value.y = cursorPos.current.y;
				object.material.uniforms.uScrollVelocity.value =
					scroll.smoothedVelocity;
				object.material.uniforms.uMouseOverPos.value.x =
					object.mouseOverPos.current.x;
				object.material.uniforms.uMouseOverPos.value.y =
					object.mouseOverPos.current.y;
				object.material.uniforms.uMouseEnter.value = object.mouseEnter;
			} else {
				object.mesh.position.y = 2 * innerHeight;
			}
		});

		setPositions();

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(scrollRaf);

	wrapper.addEventListener("mousemove", (event) => {
		cursorPos.target.x = event.clientX / innerWidth;
		cursorPos.target.y = event.clientY / innerHeight;

		if (!cursorRaf) {
			cursorRaf = requestAnimationFrame(lerpCursorPos);
		}
	});

	window.addEventListener(
		"resize",
		debounce(() => {
			const fov: number = calcFov(CAMERA_POS);
			innerWidth = window?.innerWidth ?? 1920;
			innerHeight = window?.innerHeight ?? 1080;

			resizeThreeCanvas({ camera, fov, renderer });

			mediaStore.forEach((object) => {
				const bounds = object.media.getBoundingClientRect();
				object.mesh.scale.set(bounds.width, bounds.height, 1);
				object.width = bounds.width;
				object.height = bounds.height;
				object.top = bounds.top + scroll.scrollY;
				object.left = bounds.left;
				((object.isInView =
					bounds.top >= 0 && bounds.top <= innerHeight),
					(object.material.uniforms.uTextureSize.value.x =
						object.media.naturalWidth));
				object.material.uniforms.uTextureSize.value.y =
					object.media.naturalHeight;
				object.material.uniforms.uQuadSize.value.x = bounds.width;
				object.material.uniforms.uQuadSize.value.y = bounds.height;
				object.material.uniforms.uBorderRadius.value = getComputedStyle(
					object.media,
				).borderRadius.replace("px", "");
			});
		}),
	);

	setMediaStore(scroll.scrollY);

	requestAnimationFrame(render);
};
