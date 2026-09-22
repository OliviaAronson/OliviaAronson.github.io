# Olivia Aronson Portfolio

This is a plain HTML, CSS, and JavaScript website hosted with GitHub Pages. It does not use a framework or require a build step.

## Main files

- `index.html` contains the page sections, text, links, and image references.
- `styles.css` controls the layout, colors, mobile design, and animations.
- `script.js` controls dark mode, project details, the memory game, the bookshelf, the beam test, the poem window, and the Do Not Press button.
- `assets/` contains photographs and other images.
- `documents/` contains reports and downloadable work samples.

## Common edits

### Change text

Open `index.html`, search for the existing sentence, and replace it. The page sections are labeled with comments such as `WORK`, `BOOKS`, and `CONTACT`.

### Add or change a book

The visible book spines are in the `BOOKS` section of `index.html`. The notes that appear after clicking a spine are in the `books` list inside `script.js`. Keep the `data-book` numbers in the same order as the JavaScript list, beginning with `0`.

### Change a memory-game fact

Open `script.js` and find the `memoryItems` list. Each item contains the card icon, its short label, and the fact revealed when the pair is matched.

### Replace an image

Upload the new image to `assets/`, then change the matching `src="assets/filename"` in `index.html`. Short, lowercase file names are easiest to manage.

### Add a project

Copy an existing project `<article>` in the `WORK` section of `index.html`, replace its text and image, then keep the same class names to reuse the existing design.

### Change colors

Edit the variables at the top of `styles.css`. The main pink is `--pink`, page text is `--ink`, and the background is `--paper`.

## Publishing

Changes committed to the `main` branch publish automatically at [oliviaaronson.github.io](https://oliviaaronson.github.io). GitHub Pages may take a minute or two to show a new version.
