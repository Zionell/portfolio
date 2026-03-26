declare module "nuxt/app" {
	interface NuxtApp {
		$gsap: typeof globalThis.gsap;
	}
}
