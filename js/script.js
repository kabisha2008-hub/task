const themeToggle = document.querySelector("#theme-toggle");

if (themeToggle) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  function updateThemeButton() {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      document.documentElement.removeAttribute("data-theme");

      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");

      localStorage.setItem("theme", "dark");
    }

    updateThemeButton();
  });
}
