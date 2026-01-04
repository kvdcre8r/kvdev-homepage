//** HEADER **//
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

// Add Enter key support for username input
document.getElementById("username-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const name = document.getElementById("username-input").value;
    if (name) {
      localStorage.setItem("username", name);
      setGreeting();
    }
  }
});

// Date + Time
function updateDateTime() {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString(undefined, dateOptions);
  const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  document.getElementById("date-time").innerHTML = `It is <span class="highlight">${timeString}</span> on <span class="highlight">${dateString}</span>.`;
}

// Run immediately and then every minute
updateDateTime();
setInterval(updateDateTime, 60000);

// Load saved city or default
function loadCity() {
  const savedCity = localStorage.getItem("city") || "New York";
  document.getElementById("city-input").value = savedCity;
  fetchDetailedWeather(savedCity);
}

// Save city when user clicks
document.getElementById("get-weather").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    localStorage.setItem("city", city);
    fetchDetailedWeather(city);
  }
});

// Add Enter key support for city input
document.getElementById("city-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = document.getElementById("city-input").value;
    if (city) {
      localStorage.setItem("city", city);
      fetchDetailedWeather(city);
    }
  }
});

loadCity();

//** DYNAMIC BACKGROUND **//
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

//** SETTINGS TOGGLES **//
// Open panel buttons
document.getElementById("edit-top").addEventListener("click", () => {
  document.getElementById("top-panel").classList.toggle("hidden");
});

document.getElementById("edit-tasks").addEventListener("click", () => {
  document.getElementById("tasks-panel").classList.toggle("hidden");
});

document.getElementById("edit-links").addEventListener("click", () => {
  document.getElementById("links-panel").classList.toggle("hidden");
});
// Close panel buttons
document.getElementById("close-top-panel").addEventListener("click", function () {
  document.getElementById("top-panel").classList.add("hidden");
});

document.getElementById("close-tasks-panel").addEventListener("click", function () {
  document.getElementById("tasks-panel").classList.add("hidden");
});

document.getElementById("close-links-panel").addEventListener("click", function () {
  document.getElementById("links-panel").classList.add("hidden");
});

// Theme Toggle
function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark", theme === "dark");
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("toggle-theme");
  icon.textContent = theme === "dark" ? "☀" : "☾";
}

document.getElementById("toggle-theme").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  const newTheme = isDark ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

//** SEARCH BAR **//
const searchInput = document.getElementById('search-input');
const googleSearchBtn = document.getElementById('google-search');
const duckduckgoSearchBtn = document.getElementById('duckduckgo-search');
const youtubeSearchBtn = document.getElementById('youtube-search');
const wikipediaSearchBtn = document.getElementById('wikipedia-search');

function performSearch(engine) {
  const query = searchInput.value.trim();
  if (!query) return;

  let searchUrl;
  switch (engine) {
    case 'google':
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
    case 'duckduckgo':
      searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      break;
    case 'youtube':
      searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      break;
    case 'wikipedia':
      searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
      break;
  }

  window.open(searchUrl, '_blank');
  searchInput.value = ''; // Clear the input
}

// Search button event listeners
if (googleSearchBtn) {
  googleSearchBtn.addEventListener('click', () => performSearch('google'));
}

if (duckduckgoSearchBtn) {
  duckduckgoSearchBtn.addEventListener('click', () => performSearch('duckduckgo'));
}

if (youtubeSearchBtn) {
  youtubeSearchBtn.addEventListener('click', () => performSearch('youtube'));
}

if (wikipediaSearchBtn) {
  wikipediaSearchBtn.addEventListener('click', () => performSearch('wikipedia'));
}

// Enter key support
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch('google'); // Default to Google on Enter
    }
  });
}

//** NEWS HEADLINES **//
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
          const formattedTime = formatNewsTimestamp(pubDate);
          time.textContent = ` (${formattedTime})`;
          time.style.color = "var(--highlight-color)";
        }

        li.appendChild(a);
        li.appendChild(time);
        newsList.appendChild(li);
      }
    }

    // Update timestamp after successful load
    updateNewsTimestamp();
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
            const formattedTime = formatNewsTimestamp(pubDate);
            time.textContent = ` (${formattedTime})`;
            time.style.color = "var(--highlight-color)";
          }

          li.appendChild(a);
          li.appendChild(time);
          newsList.appendChild(li);
        }
      }

      // Update timestamp after successful load
      updateNewsTimestamp();
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
          const formattedTime = formatNewsTimestamp(created);
          time.textContent = ` (${formattedTime})`;
          time.style.color = "var(--highlight-color)";

          li.appendChild(a);
          li.appendChild(time);
          newsList.appendChild(li);
        });

        // Update timestamp after successful load
        updateNewsTimestamp();
      } catch (finalError) {
        newsList.innerHTML = "<li>Unable to load news at this time. Please check your internet connection.</li>";
      }
    }
  }
}

// Update news timestamp
function updateNewsTimestamp() {
  const timestamp = document.getElementById("news-timestamp");
  if (timestamp) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    timestamp.textContent = `Last updated: ${timeString}`;
  }
}

// Helper function for smart timestamp formatting
function formatNewsTimestamp(dateString) {
  const articleDate = new Date(dateString);
  const today = new Date();

  // Check if article is from today (same date)
  const isToday = articleDate.toDateString() === today.toDateString();

  if (isToday) {
    // Show time for today's articles
    return articleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Show date for older articles with 2-digit year
    return articleDate.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
  }
}

// Set up refresh button event listeners
const refreshNewsBtn = document.getElementById("refresh-news");
if (refreshNewsBtn) {
  refreshNewsBtn.addEventListener("click", () => {
    console.log("Refresh news button clicked");

    // Show loading state
    const newsList = document.getElementById("news-list");
    const timestamp = document.getElementById("news-timestamp");

    newsList.innerHTML = "<li>Refreshing news...</li>";
    if (timestamp) {
      timestamp.textContent = "Refreshing...";
    }

    fetchNews();
  });
}

//** WEATHER FORECAST **//
async function fetchDetailedWeather(city) {
  const apiKey = "993ec09a81fd3b67589c0adfce79a875";

  try {
    console.log(`Fetching detailed weather for: ${city}`);

    // Fetch current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    );

    if (!currentResponse.ok) {
      throw new Error(`Current weather API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();
    console.log("Current weather data:", currentData);

    // Fetch 3-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();
    console.log("Forecast data:", forecastData);

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
    updateWeatherTimestamp();

  } catch (error) {
    console.error("Detailed weather fetch failed:", error);

    // Update UI with error state
    const currentTemp = document.getElementById("current-temp");
    const currentDesc = document.getElementById("current-desc");
    const feelsLike = document.getElementById("feels-like");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");

    if (currentTemp) currentTemp.textContent = "N/A";
    if (currentDesc) currentDesc.textContent = "Weather unavailable";
    if (feelsLike) feelsLike.textContent = "N/A";
    if (humidity) humidity.textContent = "N/A";
    if (wind) wind.textContent = "N/A";
  }
}

// Update weather timestamp
function updateWeatherTimestamp() {
  const timestamp = document.getElementById("weather-timestamp");
  if (timestamp) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    timestamp.textContent = `Last updated: ${timeString}`;
  }
}

function updateCurrentWeather(data) {
  console.log("Updating current weather with:", data);

  // Update header weather info
  const weatherInfo = document.getElementById("weather-info");
  if (weatherInfo && data.name && data.main && data.main.temp !== undefined && data.weather && data.weather[0]) {
    weatherInfo.innerHTML =
      `Today in <span class="highlight">${data.name}</span> it is <span class="highlight">${Math.round(data.main.temp)}°F</span> with a forecast of <span class="highlight">${data.weather[0].description}</span>.`;
  }

  const currentTemp = document.getElementById("current-temp");
  const currentDesc = document.getElementById("current-desc");
  const feelsLike = document.getElementById("feels-like");
  const humidity = document.getElementById("humidity");
  const wind = document.getElementById("wind");

  if (currentTemp && data.main && data.main.temp !== undefined) {
    const temp = Math.round(data.main.temp);
    currentTemp.textContent = `${temp}°`;
    console.log("Set temperature:", temp);

    // Apply temperature-based styling
    const weatherMain = document.querySelector('.weather-main');
    if (weatherMain) {
      // Remove existing temperature classes
      weatherMain.classList.remove('very-cold', 'cold', 'cool', 'mild', 'warm', 'hot', 'very-hot');

      // Add appropriate class based on temperature
      if (temp <= 32) {
        weatherMain.classList.add('very-cold');
      } else if (temp <= 50) {
        weatherMain.classList.add('cold');
      } else if (temp <= 65) {
        weatherMain.classList.add('cool');
      } else if (temp <= 75) {
        weatherMain.classList.add('mild');
      } else if (temp <= 85) {
        weatherMain.classList.add('warm');
      } else if (temp <= 95) {
        weatherMain.classList.add('hot');
      } else {
        weatherMain.classList.add('very-hot');
      }
    }
  }

  if (currentDesc) {
    if (data.weather && data.weather[0] && data.weather[0].description) {
      currentDesc.textContent = data.weather[0].description;
      console.log("Set description:", data.weather[0].description);
    } else {
      console.error("Weather description not found in data:", data.weather);
      currentDesc.textContent = "Unknown conditions";
    }
  } else {
    console.error("Current description element not found");
  }

  if (feelsLike && data.main && data.main.feels_like !== undefined) {
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    console.log("Set feels like:", Math.round(data.main.feels_like));
  }

  if (humidity && data.main && data.main.humidity !== undefined) {
    humidity.textContent = `${data.main.humidity}%`;
    console.log("Set humidity:", data.main.humidity);
  }

  if (wind && data.wind && data.wind.speed !== undefined) {
    wind.textContent = `${Math.round(data.wind.speed)} mph`;
    console.log("Set wind:", Math.round(data.wind.speed));
  }
}

function updateForecast(data) {
  console.log("Updating forecast with:", data);

  const forecastContainer = document.getElementById("forecast-container");
  if (!forecastContainer) {
    console.error("Forecast container not found");
    return;
  }

  forecastContainer.innerHTML = "";

  if (!data.list || data.list.length === 0) {
    console.error("No forecast data available");
    forecastContainer.innerHTML = "<div>Forecast unavailable</div>";
    return;
  }

  // Group forecast data by day and calculate daily highs/lows
  const dailyData = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: date,
        temps: [],
        weather: item.weather[0] // Use first weather condition of the day
      };
    }

    dailyData[dateKey].temps.push(item.main.temp);
  });

  // Update today's high/low in current weather section
  const today = new Date().toDateString();
  const todayData = dailyData[today];

  if (todayData && todayData.temps.length > 0) {
    const todayHigh = Math.round(Math.max(...todayData.temps));
    const todayLow = Math.round(Math.min(...todayData.temps));

    const todayHighLowElement = document.getElementById("today-highlow");
    if (todayHighLowElement) {
      todayHighLowElement.textContent = `H: ${todayHigh}° L: ${todayLow}°`;
    }
  }

  // Get next 3 days (skip today)
  const futureDays = Object.entries(dailyData)
    .filter(([dateKey]) => dateKey !== today)
    .slice(0, 3);

  console.log("Future days data:", futureDays);

  futureDays.forEach(([dateKey, dayData]) => {
    const dayName = dayData.date.toLocaleDateString([], { weekday: 'short' });
    const highTemp = Math.round(Math.max(...dayData.temps));
    const lowTemp = Math.round(Math.min(...dayData.temps));
    const desc = dayData.weather && dayData.weather.description ? dayData.weather.description : "Unknown";

    const forecastDiv = document.createElement("div");
    forecastDiv.className = "forecast-day";

    forecastDiv.innerHTML = `
      <div class="forecast-day-name">${dayName}</div>
      <div class="forecast-temp">${highTemp}°<span class="temp-low">/${lowTemp}°</span></div>
      <div class="forecast-desc">${desc}</div>
    `;

    forecastContainer.appendChild(forecastDiv);
  });
}

// Initialize detailed weather with saved city
const savedCity = localStorage.getItem("city") || "New York";
fetchDetailedWeather(savedCity);


const refreshForecastBtn = document.getElementById("refresh-forecast");
if (refreshForecastBtn) {
  refreshForecastBtn.addEventListener("click", () => {
    console.log("Refresh forecast button clicked"); // Debug log

    // Show loading state
    const timestamp = document.getElementById("weather-timestamp");
    if (timestamp) {
      timestamp.textContent = "Refreshing...";
    }

    const city = localStorage.getItem("city") || "New York";
    fetchDetailedWeather(city);
  });
}

// Make weather-main clickable to link to OpenWeatherMap
const weatherMain = document.querySelector('.weather-main');
if (weatherMain) {
  weatherMain.addEventListener('click', () => {
    window.open('https://openweathermap.org/', '_blank');
  });
}

//** FAVORITE LINKS **//
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

    // Button container for edit and delete
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "link-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.className = "edit-btn";
    editBtn.title = "Edit link";
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      editLink(index, li, a);
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "delete-btn";
    delBtn.title = "Remove link";
    delBtn.addEventListener("click", () => removeLink(index));

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(delBtn);

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "☰";
    handle.draggable = true;
    li.prepend(handle);

    li.appendChild(a);
    li.appendChild(buttonContainer);
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

  // Clear inputs after adding
  document.getElementById("new-link-name").value = "";
  document.getElementById("new-link-url").value = "";

  loadLinks();
}

function removeLink(index) {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  links.splice(index, 1);
  localStorage.setItem("links", JSON.stringify(links));
  loadLinks();
}

function editLink(index, liElement, aElement) {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  const currentName = links[index].name;
  const currentUrl = links[index].url;

  // Create input fields
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = currentName;
  nameInput.className = "edit-input";
  nameInput.placeholder = "Link name";

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.value = currentUrl;
  urlInput.className = "edit-input";
  urlInput.placeholder = "Link URL";

  const editContainer = document.createElement("div");
  editContainer.className = "edit-container";
  editContainer.appendChild(nameInput);
  editContainer.appendChild(urlInput);

  // Hide original link and insert edit form
  aElement.style.display = "none";
  liElement.insertBefore(editContainer, aElement);
  nameInput.focus();
  nameInput.select();

  function saveEdit() {
    const newName = nameInput.value.trim();
    const newUrl = urlInput.value.trim();

    if (newName && newUrl && (newName !== currentName || newUrl !== currentUrl)) {
      links[index].name = newName;
      links[index].url = newUrl;
      localStorage.setItem("links", JSON.stringify(links));
    }
    loadLinks();
  }

  function cancelEdit() {
    aElement.style.display = "";
    editContainer.remove();
  }

  // Save on Enter in either input
  [nameInput, urlInput].forEach(input => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        cancelEdit();
      }
    });
  });

  // Save on blur from the container
  let blurTimeout;
  editContainer.addEventListener("focusout", (e) => {
    clearTimeout(blurTimeout);
    blurTimeout = setTimeout(() => {
      if (!editContainer.contains(document.activeElement)) {
        saveEdit();
      }
    }, 100);
  });
}

document.getElementById("add-link").addEventListener("click", addLink);

// Add Enter key support for link inputs
document.getElementById("new-link-name").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addLink();
  }
});

document.getElementById("new-link-url").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addLink();
  }
});

//** TO-DO LIST **//
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

    // Button container for edit and delete
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "task-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.className = "edit-btn";
    editBtn.title = "Edit task";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editTask(index, span);
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "delete-btn";
    delBtn.title = "Delete task";
    delBtn.addEventListener("click", () => removeTask(index));

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(delBtn);

    li.appendChild(content);
    li.appendChild(buttonContainer);
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

function editTask(index, spanElement) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const currentText = tasks[index].text;

  // Create input field
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";

  // Replace span with input
  spanElement.style.display = "none";
  spanElement.parentNode.insertBefore(input, spanElement);
  input.focus();
  input.select();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText && newText !== currentText) {
      tasks[index].text = newText;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    loadTasks();
  }

  function cancelEdit() {
    spanElement.style.display = "";
    input.remove();
  }

  // Save on Enter, cancel on Escape
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  });

  // Save on blur (when clicking outside)
  input.addEventListener("blur", saveEdit);
}

document.getElementById("add-task").addEventListener("click", addTask);

// Add Enter key support for new task input
document.getElementById("new-task").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

//** FOOTER **//
// Inspirational Quote
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

//** INITIAL LOAD **//
setGreeting();
loadTasks();
loadLinks();
fetchNews();
fetchQuote();
loadTheme();
setBackground();
