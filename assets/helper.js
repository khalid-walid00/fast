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
  const screenWidth = window.innerWidth;
  const isLargeScreen = screenWidth >= 1024; 
  
  window.Toastify({
    text: message,
    duration: 3000,
    // close: true,
    gravity: "top",
    position: "right",
    // offset
    offset: {
      x:isLargeScreen ? 30 : 0,
      y: isLargeScreen ? 110 : 25,
    },
    style: {
      background: "#fff",
      boxShadow: "none",
      color:
        type === "success"
          ? "#01A84D"
          : "#B3261E",
      borderRadius: "8px",
      border: "1px solid #C5C5C7",
      padding: isLargeScreen ? "11px 110px" : "5px 20px",
    },
  }).showToast();
}