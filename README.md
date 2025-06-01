# Stage profile maker

A modern web application and NPM package to **parse**, **analyze**, and **visualize** GPX (GPS Exchange Format) files, with a special focus on **altitude profiles** for outdoor activities like cycling.

## 🚀 Features

- 🗺 Load and parse GPX files
- 📈 Display customizable elevation profiles
- 🎯 Add, edit, or remove waypoints
- 🧠 Automatically detect climbs
- 📤 Export modified GPX files
- 🎨 Full control over styles and rendering with presets for main cycling races styles (TOur de France, Giro d'italia, Vuelta a España..)

## 🛠 Technologies Used

- **Vue.js 3** - Frontend framework for building a modern UI
- **Vuetify** - Material Design component library
- **Vite** - Lightning-fast dev server and build tool
- **TypeScript** - Strong typing and cleaner code
- **GPXParser / GPXHelper / GPXMaker** - Classes for handling and modifying GPX data
- **ProfileDrawer** - Generates elevation profile visuals

## 📦 NPM Package

The core logic (GPX parsing, manipulation, and profile drawing) is packaged as a standalone module and can be reused outside of the web UI.

```bash
npm install stage-profile-maker
```
## Example Usage

```javascript
import { ProfileMaker } from 'stage-profile-maker';

const profile = new ProfileDrawer(gpxXmlString);

document.body.appendChild(profile.getHtml());
```

## 🧱 Project Structure

- **`src/`** - Core TypeScript logic  
  Includes GPX processing classes and helpers like:
  - `GPXParser` - Parses GPX files inspired from [GPXParser.js](https://github.com/Luuka/GPXParser.js)
  - `GPXHelper` - Computes distances, points, waypoints etc.
  - `ProfileDrawer` - Renders elevation profiles
  - `climbs.ts` - Automatic climb detection logic

- **`example/`** - Demo web application using Vue 3 + Vuetify  
  Allows testing and visual interaction with the GPX parsing/rendering library.

- **`.github/`** - CI/CD pipelines via GitHub Actions  
  Includes workflows for package publishing and GitHub Pages deployment.

---

## 🌍 Use Cases

- Elevation profile rendering (e.g. for cycling race previews)
- Interactive GPX editing for hiking/outdoor planning
- Embedding altitude data visualization in third-party apps

---

## 🚧 Potential Improvements

- Add unit tests for core logic and Vue components
- Improve developer documentation (NPM usage, custom styling, etc.)
- Optimize performance for large GPX files with a lot of waypoints (10k+ points)
- Add internationalization (i18n) support to the UI
- Improve UI for customization (e.g. color themes, styles)

---

## 🤝 How to Contribute

We welcome contributions! Please follow these basic rules:

1. **Use conventional commits** for clear version history.
2. **Open an issue** before submitting major changes or feature requests.
3. **Add comments/types** to make your code easier to maintain.
4. **Test your changes**

---

## 📝 License

[GNU](LICENSE)
