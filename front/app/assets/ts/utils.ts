import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { PerspectiveCamera } from "three";

gsap.registerPlugin(ScrollToPlugin);

interface IResizeThreeCanvasProps {
	camera: PerspectiveCamera;
	fov: number | null;
	renderer: any;
	effectComposer?: any;
}

export function scrollToBlock(id: string, offset = 0): void {
	const target = document.getElementById(id || "__nuxt");

	if (target) {
		const position =
			target.getBoundingClientRect().top + window.pageYOffset;

		gsap.to(window, {
			duration: 0.3,
			scrollTo: { y: position, offsetY: offset },
		});
	}
}

export const resolveFile = (payload: any): File | null => {
	const files = payload?.files || payload?.target?.files;
	if (!files) return null;
	return Array.isArray(files) ? files[0] : files?.[0] || null;
};

export const formatDate = (date: Date, locale: "en" | "ru"): string => {
	return new Date(date).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
	});
}

export const calcFov = (CAMERA_POS: number): number => {
	return (2 * Math.atan(window.innerHeight / 2 / CAMERA_POS) * 180) / Math.PI;
};

export const lerp = (start: number, end: number, damping: number): number => {
	return start * (1 - damping) + end * damping;
};

export const debounce = <T extends unknown[]>(
	callback: (...args: T) => void,
	delay: number = 300,
) => {
	let timeoutTimer: ReturnType<typeof setTimeout>;

	return (...args: T) => {
		clearTimeout(timeoutTimer);

		timeoutTimer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

export const resizeThreeCanvas = ({
	camera,
	fov = null,
	renderer,
	effectComposer = null,
}: IResizeThreeCanvasProps) => {
	if (camera instanceof PerspectiveCamera) {
		camera.aspect = window.innerWidth / window.innerHeight;

		if (fov) {
			camera.fov = fov;
		}
	}

	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	if (effectComposer) {
		effectComposer.setSize(window.innerWidth, window.innerHeight);
	}
};

