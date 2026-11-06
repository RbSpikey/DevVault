# RBSpikey Developer Hub

A file-based Roblox development resource library built with React, Vite, React Router, Highlight.js, and JSZip.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). Do not open `index.html` directly or serve this source folder with a plain static file server: the browser cannot execute the React `.jsx` source files. For production, use `npm run build` and serve the generated `dist/` directory; configure the host to route unknown paths back to `index.html` so `/Projects/<slug>` works on refresh.

Create a production build with `npm run build`, then serve the generated `dist/` folder with any static host. Vite discovers project JSON and Lua files at build time; rebuild after adding or changing a project.

## Add a new project — full walkthrough

Adding a project is done with files only. The homepage, project library, and project detail template discover project folders automatically during the Vite build; you do not need to edit a React component or add a route.

### 1. Create the project folders

Choose a short URL slug using lowercase letters, numbers, and hyphens. Use that exact slug as the folder name and the JSON `id`.

```text
projects/
└── my-system/
    ├── project.json
    └── scripts/
        ├── MySystem.client.lua
        └── Config.lua
```

For example, the URL for this folder will be `/Projects/my-system`. Keep each script directly inside that project's `scripts/` folder. Script paths such as `scripts/subfolder/file.lua` are not supported.

### 2. Add your Lua/Luau scripts

Copy your finished scripts into `projects/my-system/scripts/`. Use the original filenames, including Roblox suffixes such as `.client.lua` and `.server.lua`. Each script you want to appear on the page must have an entry in the `scripts` array in `project.json`.

Projects with one script show its code directly. Projects with multiple scripts show a collapsed section for each file, with its own copy and download controls. The **Download all** button packages all available project scripts into a ZIP while preserving the `scripts/` folder.

### 3. Add a thumbnail

Create or place a project-specific image in `public/images/`. SVG, PNG, JPG, and WebP are suitable. The public URL is the path beginning with `/images/`, not `public/`.

```text
public/images/my-system.svg
```

Reference it in the configuration as `"thumbnail": "/images/my-system.svg"`. If the image fails to load, the site displays its fallback artwork.

### 4. Create `project.json`

Start with this full example and replace the sample values with your project's information. Remove optional fields you do not need, or leave `videoUrl` empty when there is no tutorial yet.

```json
{
  "id": "my-system",
  "name": "My System",
  "description": "A short sentence shown on the project card and page.",
  "details": "A longer explanation of what the system does and how it works.",
  "thumbnail": "/images/my-system.svg",
  "videoUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "category": "Movement",
  "version": "1.0.0",
  "tags": ["Movement", "Player"],
  "features": [
    "First useful feature",
    "Another useful feature"
  ],
  "scripts": [
    {
      "name": "MySystem.client.lua",
      "description": "Handles player input and client behaviour.",
      "path": "scripts/MySystem.client.lua"
    },
    {
      "name": "Config.lua",
      "description": "Settings that can be changed without editing the main script.",
      "path": "scripts/Config.lua"
    }
  ],
  "instructions": [
    "Place Config.lua in ReplicatedStorage.",
    "Place MySystem.client.lua in StarterPlayer > StarterPlayerScripts.",
    "Adjust the settings in Config.lua, then test in Roblox Studio."
  ],
  "notes": "Optional warning or extra setup note."
}
```

#### Configuration fields

| Field | Required? | What it controls |
|---|---|---|
| `id` | Yes | Project slug and URL. Must match the folder name exactly. |
| `name` | Yes | Project title shown across the site. |
| `description` | Recommended | Short summary used on the project card and detail page. |
| `details` | Optional | Longer project overview. Falls back to `description`. |
| `thumbnail` | Recommended | Image URL under `public/images/`. Missing/broken images use fallback artwork. |
| `videoUrl` | Optional | Full YouTube URL. Adds a **Watch project video** link to the project page. |
| `category` | Recommended | Library filter label, such as `Movement`, `Gameplay`, or `UI & UX`. |
| `version` | Optional | Version label displayed on cards and project pages. |
| `tags` | Optional | Short searchable labels displayed on the card and page. |
| `features` | Optional | List of feature highlights on the project page. |
| `scripts` | Yes | Script filenames, descriptions, and their safe relative paths. |
| `instructions` | Optional | Ordered setup steps shown in the installation section. |
| `notes` | Optional | Additional note shown below installation steps. |

To add a second, third, or later script, create the `.lua` file in `scripts/` and add another object to the `scripts` array. Keep each `path` in the form `scripts/Filename.lua`; the path must point to a real file and may not escape the project folder.

### 5. Preview the project locally

If the Vite development server is already running, save the files and refresh the browser. If it is stopped, open PowerShell in the website folder and run:

```powershell
npm.cmd run dev
```

Then open `http://localhost:5173/Projects/my-system`. The library should also include the new card at `http://localhost:5173/Projects`. To stop the server, press **Ctrl+C** in PowerShell.

### 6. Build before publishing

Run a production build after adding a project. On PowerShell, use:

```powershell
npm.cmd run build
```

Vite reports build errors such as invalid JSON or unresolved imports. Confirm the new slug and image in the project library, open the detail page, expand each script section, and check the individual and ZIP download controls as applicable. Project metadata and Lua source are bundled at build time, so rebuild and redeploy after changing project files.

### Common setup mistakes

- **Card does not appear:** Check that `project.json` is valid JSON, `id` matches its folder, and both `id` and folder use a lowercase hyphenated slug.
- **Script section is missing or shows an error:** Check spelling and capitalization in the `scripts` entry and verify that the file exists directly inside `scripts/`.
- **Thumbnail is missing:** Check the image file is under `public/images/` and the JSON path starts with `/images/`.
- **Tutorial button is missing:** Set `videoUrl` to a full URL such as `https://www.youtube.com/watch?v=...`.
- **New or changed project does not show:** Refresh the dev page; for production, run a new build and redeploy `dist/`.

## Routes and features

- `/` overview landing page
- `/Projects` searchable and filterable library
- `/Projects/:id` generated project detail page
- Copy code uses the browser clipboard API.
- Download actions save the original `.lua` file; multi-script projects can download a ZIP preserving their `scripts/` paths.

The site is a static frontend. There is no database or runtime project API; project data and script sources are bundled during the Vite build.

## Publish free with GitHub Pages

This repository includes `.github/workflows/deploy.yml`. After it is pushed to a public GitHub repository's `main` branch and Pages is set to **GitHub Actions**, GitHub automatically builds and publishes the site. The workflow builds `dist/`, sets the Vite base path from the repository name, and adds a route fallback for project detail URLs.

1. Create a **public** repository on GitHub. Do not initialize it with a README, license, or `.gitignore` because this project already contains its files.
2. Open PowerShell in this project folder and connect it to your new repository. Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub username and repository name:

   ```powershell
   git init -b main
   git add .
   git commit -m "Add RBSpikey developer website"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. On GitHub, open the repository's **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions** and save if prompted. GitHub documents this publishing-source setup [here](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
4. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish successfully. The workflow follows GitHub's custom Pages artifact and deployment flow [described here](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
5. The project site URL is `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`. If the repository is named `YOUR-USERNAME.github.io`, the URL is `https://YOUR-USERNAME.github.io/`.

For future changes, commit and push to `main`; GitHub Actions rebuilds and republishes the site. The repository must be public to use GitHub Pages on GitHub Free. Keep `node_modules/` and `dist/` out of Git; `.gitignore` already excludes them.
