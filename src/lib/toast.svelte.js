export const toast = $state({ msg: '', show: false });

let timer;

export function showToast(msg) {
	toast.msg = msg;
	toast.show = true;
	clearTimeout(timer);
	timer = setTimeout(() => {
		toast.show = false;
	}, 2200);
}
