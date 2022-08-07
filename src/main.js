// @ts-check
import { getBookmarks } from './bookmarks.js'
import { getTabs, closeTab } from './tabs.js'
/** @typedef {import('./firefox').tabs.Tab} tabs.Tab */
/** @typedef {import('./types').Bookmark} Bookmark */

/** @type {import('./firefox').Browser} */
const browser = window['browser'];
if (browser == null) {
    throw Error("`browser` is not defined")
}

document.addEventListener("DOMContentLoaded", async () => {
    await main(undefined);
});

/**
 * @param {string | undefined} bookmarkFolderId
 * @returns {Promise<void>}
 */
async function main(bookmarkFolderId) {
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const closeButton = document.getElementById("close");
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const elementTabs = document.getElementById("tabs");
    closeButton.disabled = true;
    removeChilds(elementTabs);

    const allTabs = await getTabs(browser);
    const targetBookmarks = await getBookmarks(browser, bookmarkFolderId);
    const toCloseTabs = getToCloseBookmarkedTabs(allTabs, targetBookmarks);

    /** @type {[HTMLElement, HTMLElement, HTMLElement, HTMLElement]} */
    // @ts-ignore
    const [numToClose, countable, showToClose, showAll] = [
        "numtoclose", "countable", "showtoclose", "showall"
    ]
        .map(eId => document.getElementById(eId));
    numToClose.textContent = String(toCloseTabs.length);
    countable.textContent = toCloseTabs.length == 1
        ? "tab"
        : "tabs";

    const show = showToClose.onclick = () => {
        removeChilds(elementTabs);
        for (const tab of toCloseTabs) {
            addListItem(
                tab.title,
                false,
                elementTabs);
        }
    };
    show();

    showAll.onclick = () => {
        removeChilds(elementTabs);
        for (const tab of allTabs) {
            addListItem(
                tab.title,
                targetBookmarks.filter(b => b.url == tab.url).length > 0,
                elementTabs);
        }
    };

    // Close button
    if (toCloseTabs.length > 0) {
        closeButton.disabled = false;
        closeButton.onclick = async () => {
            await closeBookmarkedTabs(toCloseTabs);
            await main(bookmarkFolderId);
        };
    }
}

/**
 * @param {HTMLElement} element
 */
function removeChilds(element) {
    element.textContent = "";
}

/**
 * 
 * @param {tabs.Tab[]} allTabs
 * @param {Bookmark[]} bookmarks 
 */
function getToCloseBookmarkedTabs(
    allTabs,
    bookmarks,
) {
    return allTabs
        .filter(tab => bookmarks.filter(b => b.url == tab.url).length > 0);
}

/**
 * @param {tabs.Tab[]} toCloseTabs 
 */
async function closeBookmarkedTabs(toCloseTabs) {
    await closeTab(browser, toCloseTabs.map(tab => tab.id));
}

/**
 * @param {string | any} content
 * @param {boolean} marked
 * @param {HTMLElement} to
 */
function addListItem(content, marked, to) {
    const elem = document.createElement("li");
    elem.textContent = content ?? String(content);
    if (marked) elem.style.color = "red";
    to.appendChild(elem);
}
