export function requestWithTimeout(promise, timeout = 10000) {
	return Promise.race([
		promise,
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error("Request timeout")), timeout)
		),
	]);
}

export function storeGateRequest(schema, variables = {}, timeout = 10000) {
	const storeGate = window.qumra?.storeGate;
	if (typeof storeGate !== "function") {
		return Promise.reject(new Error("storeGate is not defined"));
	}

	const request = storeGate(schema, variables);
	return requestWithTimeout(request, timeout);
}

export function updateFrontendQuantity(id, quantity) {
    const item = window.globals?.cart?.items?.find((i) => i._id === id);
    if (item) item.quantity = quantity;
  }

export function showToast(message, type = "success") {
  window.Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background:
        type === "success"
          ? "linear-gradient(to right, #00b09b, #96c93d)"
          : "linear-gradient(to right, #ff5f6d, #ffc371)",
    },
  }).showToast();
}