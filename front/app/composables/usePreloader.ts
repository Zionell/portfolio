export function usePreloader() {
	const isReady = useState("preloader-ready", () => false);

	const finish = () => {
		isReady.value = true;
	};

	const whenReady = (cb: () => void) => {
		if (isReady.value) {
			cb();
			return;
		}

		const stop = watch(isReady, (value) => {
			if (!value) return;

			stop();
			cb();
		});
	};

	return { isReady, finish, whenReady };
}
