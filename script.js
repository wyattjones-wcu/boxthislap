import { loadMatches, loadPlayers } from "./dataLoader.js";

const pageLinks = document.querySelectorAll("[data-page-link]");
const pages = document.querySelectorAll("[data-page]");
const tabs = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const testingPlayerRows = document.querySelector("#testing-player-rows");

function showPage(pageName) {
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === pageName);
  });

  pageLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.pageLink === pageName);
  });
}

function showTab(tabName) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName);
  });
}

pageLinks.forEach((link) => {
  link.addEventListener("click", () => {
    showPage(link.dataset.pageLink);
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showTab(tab.dataset.tab);
  });
});

window.addEventListener("hashchange", () => {
  showPage(window.location.hash.replace("#", "") || "results");
});

showPage(window.location.hash.replace("#", "") || "results");

const siteData = {};
window.boxThisLapData = siteData;

loadPlayers()
  .then((players) => {
    siteData.players = players;
    renderTestingPlayers(players);
    console.info("Box This Lap player data loaded", players);
  })
  .catch((error) => {
    renderTestingError(error);
    console.error("Box This Lap player data failed to load", error);
  });

loadMatches()
  .then((matches) => {
    siteData.matches = matches;
    console.info("Box This Lap match data loaded", matches);
  })
  .catch((error) => {
    siteData.matchesError = error;
    console.error("Box This Lap match data failed to load", error);
  });

function renderTestingPlayers(players) {
  if (!testingPlayerRows) {
    return;
  }

  if (players.length === 0) {
    testingPlayerRows.innerHTML = `<tr><td colspan="7">No player data found.</td></tr>`;
    return;
  }

  testingPlayerRows.innerHTML = players.map((player) => {
    return `
      <tr>
        <td>${escapeHtml(player.id)}</td>
        <td>${escapeHtml(player.name)}</td>
        <td>${escapeHtml(player.team)}</td>
        <td>${escapeHtml(player.position)}</td>
        <td>${escapeHtml(player.playerNumber)}</td>
        <td>${escapeHtml(player.transfermarktPrice)}</td>
        <td>${escapeHtml(player.drafted)}</td>
      </tr>
    `;
  }).join("");
}

function renderTestingError(error) {
  if (!testingPlayerRows) {
    return;
  }

  testingPlayerRows.innerHTML = `
    <tr>
      <td colspan="7">Unable to load Google Sheets data: ${escapeHtml(error.message)}</td>
    </tr>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
