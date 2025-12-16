// Greeting + Username
function setGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById("greeting");
  const name = localStorage.getItem("username") || "";
  let timeGreeting = "Hello";
  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 18) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";
  greeting.textContent = name ? `${timeGreeting}, ${name}!` : `${timeGreeting}!`;
}

document.getElementById("save-username").addEventListener("click", () => {
  const name = document.getElementById("username-input").value;
  if (name) {
    localStorage.setItem("username", name);
    setGreeting();
  }
});

// Date + Time
function updateDateTime() {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString(undefined, dateOptions);
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  document.getElementById("date-time").innerHTML = `It is <span class="highlight">${timeString}</span> on <span class="highlight">${dateString}</span>.`;
}

// Run immediately and then every second
updateDateTime();
setInterval(updateDateTime, 60000);

// Weather
async function fetchWeather(city = "St Louis") {
  const apiKey = "993ec09a81fd3b67589c0adfce79a875"; // OpenWeatherMap
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    );
    const data = await response.json();
    document.getElementById("weather-info").innerHTML =
      `Today in <span class="highlight">${data.name}</span> it is <span class="highlight">${data.main.temp}°F</span> with a forecast of <span class="highlight">${data.weather[0].description}</span>.`;
  } catch {
    document.getElementById("weather-info").textContent = "Weather unavailable.";
  }
}

// Load saved city or default
function loadCity() {
  const savedCity = localStorage.getItem("city") || "New York";
  document.getElementById("city-input").value = savedCity;
  fetchWeather(savedCity);
}

// Save city when user clicks
document.getElementById("get-weather").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    localStorage.setItem("city", city);
    fetchWeather(city);
  }
});

// Initialize
loadCity();

// Clock
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const weatherInfo = document.getElementById("weather-info");
  if (weatherInfo.textContent) {
    weatherInfo.textContent = weatherInfo.textContent.split(" — ")[0] +
      ` — ${timeString} — ` + weatherInfo.textContent.split(" — ")[1];
  }
}

// To-Do List
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.dataset.index = index;

    // Create a flex container for handle + text
    const content = document.createElement("div");
    content.className = "task-content";

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "☰";
    handle.draggable = true;

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(index));

    content.appendChild(handle);
    content.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => removeTask(index));

    li.appendChild(content);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  enableDragSort("task-list", "tasks");
}

function addTask() {
  const input = document.getElementById("new-task");
  const text = input.value.trim();
  if (!text) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  loadTasks();
}

function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function removeTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

document.getElementById("add-task").addEventListener("click", addTask);

// Favorite Links
function loadLinks() {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  const list = document.getElementById("links-list");
  list.innerHTML = "";

  links.forEach((link, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    const a = document.createElement("a");
    a.href = link.url;
    a.textContent = link.name;
    a.target = "_blank";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Remove";
    delBtn.addEventListener("click", () => removeLink(index));

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "☰";
    handle.draggable = true;
    li.prepend(handle);

    li.appendChild(a);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  enableDragSort("links-list", "links");
}

function enableDragSort(listId, storageKey) {
  const list = document.getElementById(listId);
  let draggedItem = null;

  list.addEventListener("dragstart", (e) => {
    if (!e.target.classList.contains("drag-handle")) {
      e.preventDefault();
      return;
    }
    draggedItem = e.target.closest("li");
    draggedItem.style.opacity = "0.5";
  });

  list.addEventListener("dragend", () => {
    if (draggedItem) draggedItem.style.opacity = "1";
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest("li");
    if (target && target !== draggedItem) {
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) > (rect.height / 2);
      list.insertBefore(draggedItem, next ? target.nextSibling : target);
    }
  });

  list.addEventListener("drop", () => {
    if (!draggedItem) return;

    if (storageKey === "links") {
      const newOrder = Array.from(list.children).map(li => {
        const a = li.querySelector("a");
        return { name: a.textContent, url: a.href };
      });
      localStorage.setItem("links", JSON.stringify(newOrder));
      loadLinks();
    } else if (storageKey === "tasks") {
      const newOrder = Array.from(list.children).map(li => {
        const text = li.querySelector(".task-content span:nth-child(2)")?.textContent || "";
        const completed = li.classList.contains("completed");
        return { text, completed };
      });
      localStorage.setItem("tasks", JSON.stringify(newOrder));
      loadTasks();
    }

    draggedItem = null;
  });
}

function addLink() {
  const name = document.getElementById("new-link-name").value;
  const url = document.getElementById("new-link-url").value;
  if (!name || !url) return;
  const links = JSON.parse(localStorage.getItem("links")) || [];
  links.push({ name, url });
  localStorage.setItem("links", JSON.stringify(links));
  loadLinks();
}

function removeLink(index) {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  links.splice(index, 1);
  localStorage.setItem("links", JSON.stringify(links));
  loadLinks();
}

document.getElementById("add-link").addEventListener("click", addLink);

// Toggle panels
document.getElementById("edit-top").addEventListener("click", () => {
  document.getElementById("top-panel").classList.toggle("hidden");
});

document.getElementById("edit-tasks").addEventListener("click", () => {
  document.getElementById("tasks-panel").classList.toggle("hidden");
});

document.getElementById("edit-links").addEventListener("click", () => {
  document.getElementById("links-panel").classList.toggle("hidden");
});

document.getElementById("refresh-news").addEventListener("click", () => {
  fetchNews();
});

// News Headlines
async function fetchNews() {
  const newsList = document.getElementById("news-list");

  try {
    // Try multiple approaches to get Google News working

    // Method 1: Use a different proxy service for Google News RSS
    const googleNewsRss = "https://news.google.com/rss?topic=h&hl=en-US&gl=US&ceid=US:en";
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(googleNewsRss)}`;

    const response = await fetch(proxyUrl);
    const text = await response.text();

    // Parse the RSS XML directly
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    newsList.innerHTML = "";

    if (items.length === 0) {
      throw new Error("No Google News items found");
    }

    // Display first 5 headlines from Google News
    for (let i = 0; i < Math.min(5, items.length); i++) {
      const item = items[i];
      const title = item.querySelector("title")?.textContent;
      const link = item.querySelector("link")?.textContent;
      const pubDate = item.querySelector("pubDate")?.textContent;

      if (title && link) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        a.textContent = title;
        a.target = "_blank";

        const time = document.createElement("small");
        if (pubDate) {
          const date = new Date(pubDate);
          time.textContent = ` (${date.toLocaleDateString()})`;
          time.style.color = "var(--highlight-color)";
        }

        li.appendChild(a);
        li.appendChild(time);
        newsList.appendChild(li);
      }
    }
  } catch (error) {
    console.log("Google News via allorigins failed, trying BBC News...");

    try {
      // Method 2: Try BBC RSS feed with allorigins proxy
      const corsProxy = "https://api.allorigins.win/raw?url=";
      const bbcRssUrl = encodeURIComponent("http://feeds.bbci.co.uk/news/rss.xml");
      const response = await fetch(corsProxy + bbcRssUrl);
      const text = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      newsList.innerHTML = "";

      for (let i = 0; i < Math.min(5, items.length); i++) {
        const item = items[i];
        const title = item.querySelector("title")?.textContent;
        const link = item.querySelector("link")?.textContent;
        const pubDate = item.querySelector("pubDate")?.textContent;

        if (title && link) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link;
          a.textContent = title;
          a.target = "_blank";

          const time = document.createElement("small");
          if (pubDate) {
            const date = new Date(pubDate);
            time.textContent = ` (${date.toLocaleDateString()})`;
            time.style.color = "var(--highlight-color)";
          }

          li.appendChild(a);
          li.appendChild(time);
          newsList.appendChild(li);
        }
      }
    } catch (thirdError) {
      // Method 4: Use JSONFeed.org service for Reddit World News
      try {
        const response = await fetch("https://www.reddit.com/r/worldnews/top.json?limit=5");
        const data = await response.json();

        newsList.innerHTML = "";

        data.data.children.forEach(post => {
          const title = post.data.title;
          const link = post.data.url;
          const created = new Date(post.data.created_utc * 1000);

          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link;
          a.textContent = title;
          a.target = "_blank";

          const time = document.createElement("small");
          time.textContent = ` (${created.toLocaleDateString()})`;
          time.style.color = "var(--highlight-color)";

          li.appendChild(a);
          li.appendChild(time);
          newsList.appendChild(li);
        });
      } catch (finalError) {
        newsList.innerHTML = "<li>Unable to load news at this time. Please check your internet connection.</li>";
      }
    }
  }
}

// Quote of the Day
function fetchQuote() {
  // Curated list of inspirational quotes
  const quotes = [
    '"The only way to do great work is to love what you do." — Steve Jobs',
    '"Innovation distinguishes between a leader and a follower." — Steve Jobs',
    '"Life is what happens to you while you\'re busy making other plans." — John Lennon',
    '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
    '"It is during our darkest moments that we must focus to see the light." — Aristotle',
    '"Not all those who wander are lost." — J.R.R. Tolkien',
    '"Be yourself; everyone else is already taken." — Oscar Wilde',
    '"In three words I can sum up everything I\'ve learned about life: it goes on." — Robert Frost',
    '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill',
    '"The way to get started is to quit talking and begin doing." — Walt Disney'
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quote").textContent = randomQuote;
}

// Theme Toggle
function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark", theme === "dark");
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("toggle-theme");
  icon.textContent = theme === "dark" ? "☀️" : "🌙";
}

document.getElementById("toggle-theme").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  const newTheme = isDark ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

// Background Image
async function setBackground() {
  try {
    // Using Picsum (Lorem Picsum) which is more reliable than Unsplash source
    const imageUrl = "https://picsum.photos/1600/900";

    // Test if the image loads
    const img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = `url(${imageUrl})`;
    };
    img.onerror = () => {
      document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    };
    img.src = imageUrl;
  } catch {
    document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }
}

// Initialize
setGreeting();
fetchWeather();
loadTasks();
loadLinks();
fetchNews();
fetchQuote();
loadTheme();
setBackground();
