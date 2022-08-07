// @ts-check
/** @type {import('./firefox').browser} */
const browser = window['browser'];

/**
 * For Firefox
 * Get all tabs in the current window.
 * @returns {Promise<import('./firefox').tabs.Tab[]>}
 */
export async function getTabs() {
    return await browser.tabs.query({ currentWindow: true });
}

/**
 * For Firefox
 * Get all tabs in the current window.
 * @param {number | (number | undefined)[]} tabId To close
 * @returns {Promise<void>}
 */
export async function closeTab(tabId) {
    return await browser.tabs.remove(tabId);
}
