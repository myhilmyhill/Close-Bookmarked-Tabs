// @ts-check
/** @typedef {import('./firefox').Browser} Browser */
/** @typedef {import('./firefox').tabs.Tab} tabs.Tab */

/**
 * For Firefox
 * Get all tabs in the current window.
 * @param {Browser} browser
 * @returns {Promise<tabs.Tab[]>}
 */
export async function getTabs(browser) {
    return await browser.tabs.query({ currentWindow: true });
}

/**
 * For Firefox
 * Get all tabs in the current window.
 * @param {Browser} browser
 * @param {number | (number | undefined)[]} tabId To close
 * @returns {Promise<void>}
 */
export async function closeTab(browser, tabId) {
    return await browser.tabs.remove(tabId);
}
