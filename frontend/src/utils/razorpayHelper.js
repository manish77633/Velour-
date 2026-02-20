/**
 * Dynamically loads Razorpay checkout.js SDK
 * Returns true if loaded successfully
 */
export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script    = document.createElement('script');
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload   = () => resolve(true);
    script.onerror  = () => resolve(false);
    document.body.appendChild(script);
  });

/**
 * Opens the Razorpay checkout modal
 * @param {Object} options - Razorpay options
 * @returns {Promise} - resolves with payment response or rejects on failure/dismiss
 */
export const openRazorpayCheckout = (options) =>
  new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      ...options,
      handler: resolve,
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled by user')),
      },
    });
    rzp.on('payment.failed', (res) => reject(new Error(res.error.description)));
    rzp.open();
  });
