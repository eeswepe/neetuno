import { useState, useEffect } from "react";

// Hook ini akan mengambil sebuah 'value' dan 'delay'
// dan hanya akan mengembalikan 'value' terbaru setelah pengguna berhenti mengetik selama 'delay'
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set timeout untuk update value setelah delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Bersihkan timeout setiap kali 'value' atau 'delay' berubah
		// Ini adalah bagian penting dari debounce
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
