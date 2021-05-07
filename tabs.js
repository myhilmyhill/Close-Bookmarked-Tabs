/**
 * @typedef {{id: number}} tabs.Tab
 */

/**
 * For Firefox
 * Get all tabs in the current window.
 * @returns {Promise<tabs.Tab>}
 */
export async function getTabs() {
    return await browser.tabs.query({ currentWindow: true });
}

/**
 * For Firefox
 * Get all tabs in the current window.
 * @param {number | number[]} tabId To close
 * @returns {Promise<void>}
 */
export async function closeTab(tabId) {
    return await browser.tabs.remove(tabId);
}
