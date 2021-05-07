// @ts-check
import { getBookmarks } from './bookmarks.js'
import { getTabs, closeTab } from './tabs.js'

document.addEventListener("DOMContentLoaded", async () => {
    await main(undefined);
});

/**
 * @param {string} bookmarkFolderId
 * @returns {Promise<void>}
 */
async function main(bookmarkFolderId) {
    const closeButton = document.getElementById("close");
    const elementTabs = document.getElementById("tabs");
    // @ts-ignore
    closeButton.disabled = true;
    removeChilds(elementTabs);

    const allTabs = await getTabs();
    const targetBookmarks = await getBookmarks(bookmarkFolderId);
    const toCloseTabs = getToCloseBookmarkedTabs(allTabs, targetBookmarks);

    // @ts-ignore
    document.getElementById("numtoclose").textContent = toCloseTabs.length;
    document.getElementById("countable").textContent = toCloseTabs.length == 1
        ? "tab"
        : "tabs";

    document.getElementById("showtoclose").onclick = () => {
        removeChilds(elementTabs);
        for (const tab of toCloseTabs) {
            addListItem(
                tab.title,
                false,
                elementTabs);
        }
    };
    // @ts-ignore
    document.getElementById("showtoclose").onclick();

    document.getElementById("showall").onclick = () => {
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
        // @ts-ignore
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
    await closeTab(toCloseTabs.map(tab => tab.id));
}

/**
 * @param {string} content
 * @param {boolean} marked
 * @param {HTMLElement} to
 */
function addListItem(content, marked, to) {
    const elem = document.createElement("li");
    elem.textContent = content;
    if (marked) elem.style.color = "red";
    to.appendChild(elem);
}
