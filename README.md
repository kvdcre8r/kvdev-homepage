# The KvDev Personalized Homepage

A clean, modern, and feature-rich personal homepage designed as your daily dashboard. Built with vanilla HTML, CSS, and JavaScript for fast loading and easy customization.

## ✨ Features

### 🌤️ **Weather Integration**
- Current weather with temperature-based color backgrounds
- Detailed weather information (feels like, humidity, wind)
- Today's high/low temperatures
- 3-day weather forecast with high/low temps
- Auto-location detection with city customization

### 📰 **News Headlines**
- Live Google News headlines with smart timestamps
- Shows time for today's articles, dates for older ones
- Automatic refresh functionality
- Clean, readable format with clickable links

### ✅ **Task Management** 
- Interactive to-do list with completion tracking
- Drag-and-drop reordering
- Persistent storage across browser sessions
- Clean, subtle delete buttons with trash icons

### 🔗 **Quick Links**
- Customizable bookmarks with easy add/remove
- Drag-and-drop reordering
- Direct link access in new tabs
- Organized in a convenient sidebar

### 🎨 **Smart Theming**
- Light and dark mode toggle
- Neutral color scheme that complements any background
- Dynamic temperature-based weather card colors
- Smooth transitions and hover effects

### 🖼️ **Dynamic Backgrounds**
- Rotating background images from Picsum
- Automatic loading with fallback gradients
- Optimized for readability with semi-transparent overlays

### 💭 **Daily Inspiration**
- Curated collection of motivational quotes
- Random quote selection on each page load
- Clean, italic typography

## 🚀 Quick Start

1. **Download or clone** the project files
2. **Open `index.html`** in any modern web browser
3. **Customize your settings:**
   - Click the gear icon to set your name and city
   - Add your favorite links and tasks using the + buttons
   - Toggle between light and dark themes with the moon/sun icon

## 🏗️ Project Structure

```
homepage-project/
├── index.html          # Main HTML structure
├── style.css           # All styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🛠️ Technical Details

### **Built With**
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with CSS variables and flexbox/grid
- **Vanilla JavaScript**: No frameworks, pure performance
- **Local Storage**: Persistent data without databases

### **APIs Used**
- **OpenWeatherMap**: Weather data and forecasts
- **Google News RSS**: News headlines via CORS proxy
- **Picsum Photos**: Dynamic background images

### **Browser Support**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⚙️ Configuration

### **Weather Setup**
The weather feature uses OpenWeatherMap's free API. The project includes a demo API key, but for production use:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Replace the `apiKey` variable in `script.js`

### **Customization Options**
- **Colors**: Modify CSS variables in `:root` for easy theming
- **Layout**: Responsive design adapts to mobile/tablet/desktop
- **Content**: All text and settings are easily customizable

## 📱 Responsive Design

- **Desktop**: Full sidebar layout with all features
- **Tablet**: Flexible layout with proper spacing
- **Mobile**: Single-column design with touch-friendly controls

## 🔒 Privacy & Data

- **Local Storage Only**: All data stays on your device
- **No Tracking**: No analytics or user tracking
- **API Calls**: Only to weather and news services
- **Offline Capable**: Core functionality works without internet

## 🎯 Use Cases

- **Daily Dashboard**: Replace your browser's new tab page
- **Home Office**: Quick access to weather, news, and tasks
- **Personal Organization**: Keep track of links and to-dos
- **Clean Interface**: Distraction-free workspace

## 🤝 Contributing

This is a personal project, but feel free to:
- Fork and customize for your own use
- Submit bug reports via issues
- Suggest feature improvements
- Share your customizations

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for a better daily browsing experience**
