/* Redirect only to the provider URL returned by our backend. */
export async function readCheckoutUrl(response) {
  const data = await response.json().catch(() => null);
  if (response.status === 503) throw new Error("payments_not_configured");
  if (!response.ok || typeof data?.url !== "string" || !data.url) {
    throw new Error("checkout_failed");
  }
  return data.url;
}

export function redirectToStripeCheckout(rawUrl, location = window.location) {
  let checkoutUrl;
  try {
    checkoutUrl = new URL(rawUrl);
  } catch {
    throw new Error("checkout_failed");
  }

  if (
    checkoutUrl.protocol !== "https:" ||
    checkoutUrl.hostname !== "checkout.stripe.com" ||
    checkoutUrl.username ||
    checkoutUrl.password
  ) {
    throw new Error("checkout_failed");
  }

  location.assign(checkoutUrl.href);
  return checkoutUrl.href;
}
