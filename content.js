/**
 * @file This script checks if a webpage is a Medium article.
 * If it is, it finds the main title (h1) and turns it into a
 * clickable link that redirects to a paywall-free version of the article.
 * It uses a MutationObserver to handle dynamically loaded content.
 */

function isMediumWebsite() {
  // Medium sites have a specific meta tag we can check for.
  const metaTag = document.querySelector(
    'meta[property="al:ios:app_name"][content="Medium"]'
  );
  return !!metaTag;
}

if (isMediumWebsite()) {
  const linkifyTitle = () => {
    const titleElement = document.querySelector("h1");

    if (titleElement && !titleElement.querySelector("a.freedium-link")) {
      const storyUrl = window.location.href;
      const freediumUrl = `https://freedium.cfd/${storyUrl}`;

      const link = document.createElement("a");
      link.href = freediumUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.add("freedium-link");

      // Move all of the original title's content into the new link
      while (titleElement.firstChild) {
        link.appendChild(titleElement.firstChild);
      }

      // Add the '(Read for Free)' text
      const freebieSpan = document.createElement("span");
      freebieSpan.textContent = " (Read for Free)";
      freebieSpan.style.color = "#1669DF";
      link.appendChild(freebieSpan);

      // Replace the h1's content with the new link
      titleElement.appendChild(link);

      // Stop observing once we've successfully linked the title
      if (observer) {
        observer.disconnect();
      }
    }
  };

  // Set up an observer to watch for the title element being added to the page.
  const observer = new MutationObserver(linkifyTitle);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also run on load in case the content is already there.
  window.addEventListener("load", linkifyTitle);
} else {
  console.log("Free Medium Extension: Not a Medium site, script will not run.");
}
