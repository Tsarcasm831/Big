# any new models must be compressed using compress_glbs.js

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
## Git LFS Assets

Large media files are stored using [Git LFS](https://git-lfs.com/). After cloning the repository install Git LFS and pull the assets:

```bash
# install once
sudo apt-get install git-lfs
git lfs install

# fetch media
git lfs pull
```

This downloads the files located under `assets/`, `home/`, and `topdown/`.
=======
# Remnants of Destruction

This repository contains the web resources and tools for an experimental 3D RPG
world.  The `home/` folder hosts the **FarHaven** isometric scene built with
Three.js while other directories provide data, additional game modes and various
assets.

## Directory overview

```
Big/
├─ assets/        # shared art, models and images
├─ data/          # game data files (JSON, PDFs, etc.)
├─ home/          # FarHaven 3D world (Node project)
├─ scripts/       # front‑end JavaScript modules
├─ styles/        # CSS for the main site
├─ topdown/       # prototype top‑down demo
├─ index.html     # main entry point
└─ requirements.txt
```

See [`home/readme.md`](home/readme.md) for a detailed description of modules in
the FarHaven scene.  Any new models should be compressed using the provided
`compress_glbs.js` script.

## Prerequisites

- [Node.js](https://nodejs.org/) for the build scripts in `home/`
- [Python 3](https://www.python.org/) for the static and dialogue servers

## Installation

### Node dependencies

```sh
cd home
npm install
```

### Python packages

Install the required Python packages from the repository root:

```sh
pip install -r requirements.txt
```

## Running

### Web front‑end

Start the lightweight HTTP server and open the game in a browser:

```sh
cd home
python static_server.py
```

Navigate to `http://localhost:3057` to load the 3D world.

### Dialogue backend

Launch the dialogue service used by NPC interactions:

```sh
cd home/scripts/dialogue_backend
python app.py
```

