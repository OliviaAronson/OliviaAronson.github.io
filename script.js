const body = document.body;

// Color mode
const themeButton = document.querySelector(".theme-button");
const savedTheme = localStorage.getItem("oa-theme");
if (savedTheme === "dark") body.classList.add("dark");
themeButton.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "oa-theme",
    body.classList.contains("dark") ? "dark" : "light",
  );
});

// Expandable project details
document.querySelectorAll(".detail-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const open = panel.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = button.textContent.replace(
      open ? "+" : "−",
      open ? "−" : "+",
    );
  });
});

// Scroll reveals and active navigation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("[data-nav]")];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.dataset.nav === entry.target.id),
      );
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);
sections.forEach((section) => navObserver.observe(section));

// Poem dialog
const poemDialog = document.getElementById("poem-dialog");
document
  .getElementById("open-poem")
  .addEventListener("click", () => poemDialog.showModal());
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => poemDialog.close());
poemDialog.addEventListener("click", (event) => {
  if (event.target === poemDialog) poemDialog.close();
});

// Copy email button
const toast = document.querySelector(".toast");
document
  .querySelector(".copy-email")
  .addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(event.currentTarget.dataset.email);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1700);
  });

// Interactive T-beam failure test
const beamCard = document.querySelector(".beam-card");
const beamTestButton = document.querySelector(".beam-test-button");
const beamResult = document.querySelector(".beam-test-result");
let beamTimer;
if (beamCard && beamTestButton && beamResult) {
  beamTestButton.addEventListener("click", () => {
    clearTimeout(beamTimer);
    if (beamCard.classList.contains("failed")) {
      beamCard.classList.remove("failed", "testing");
      beamResult.textContent = "";
      beamTestButton.textContent = "Test it to failure";
      return;
    }
    beamCard.classList.remove("failed");
    beamCard.classList.add("testing");
    beamTestButton.disabled = true;
    beamTestButton.textContent = "Applying load...";
    beamResult.textContent = "Loading the beam...";
    beamTimer = setTimeout(() => {
      beamCard.classList.remove("testing");
      beamCard.classList.add("failed");
      beamResult.textContent =
        "Failure reached. The support change increased measured stiffness by 58%.";
      beamTestButton.disabled = false;
      beamTestButton.textContent = "Reset test";
    }, 1050);
  });
}

// Memory game
const memoryItems = [
  {
    id: "climb",
    icon: "△",
    label: "Climb",
    fact: "I have been climbing for three years. I plan my own training and am probably thinking about grip positions more often than necessary.",
  },
  {
    id: "biomed",
    icon: "♡",
    label: "Biomed",
    fact: "I study mechanical engineering and psychology, and I am especially interested in biomedical engineering, prosthetics, and assistive design.",
  },
  {
    id: "make",
    icon: "⚙",
    label: "Build",
    fact: "I like projects that leave the screen. I have worked with SolidWorks, laser cutters, acrylic fabrication, and physical testing.",
  },
  {
    id: "write",
    icon: "✎",
    label: "Write",
    fact: "I write poetry and short fiction. Technical and creative writing make me pay attention in completely different ways.",
  },
  {
    id: "louis",
    icon: "🐾",
    label: "Louis",
    fact: "When Louis went missing, I printed 500+ flyers, knocked on 200+ doors, tracked leads in Excel, and brought a scent-trained bloodhound across state lines.",
  },
  {
    id: "test",
    icon: "↯",
    label: "Test",
    fact: "My favorite part of engineering is testing a design and finding out where the real object disagrees with the model.",
  },
];

const memoryGrid = document.getElementById("memory-grid");
const memoryMoves = document.getElementById("memory-moves");
const memoryMatches = document.getElementById("memory-matches");
const memoryReset = document.getElementById("memory-reset");
const memoryFact = document.querySelector(".memory-fact");

if (memoryGrid && memoryMoves && memoryMatches && memoryReset && memoryFact) {
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let moves = 0;
  let matches = 0;

  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const showFact = (item) => {
    memoryFact.innerHTML = `
      <p class="memory-fact-label">UNLOCKED: ${item.label.toUpperCase()}</p>
      <span class="memory-fact-icon" aria-hidden="true">${item.icon}</span>
      <h3>${item.label}</h3>
      <p>${item.fact}</p>
    `;
  };

  const finishTurn = () => {
    firstCard = null;
    secondCard = null;
    locked = false;
  };

  const chooseCard = (card) => {
    if (locked || card === firstCard || card.classList.contains("matched"))
      return;

    card.classList.add("flipped");
    card.setAttribute("aria-label", `${card.dataset.label} card`);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    locked = true;
    moves += 1;
    memoryMoves.textContent = moves;

    if (firstCard.dataset.pair === secondCard.dataset.pair) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches += 1;
      memoryMatches.textContent = matches;
      showFact(memoryItems.find((item) => item.id === firstCard.dataset.pair));
      finishTurn();

      if (matches === memoryItems.length) {
        memoryFact.classList.add("complete");
        memoryFact.querySelector(".memory-fact-label").textContent =
          "ALL SIX FOUND";
      }
      return;
    }

    window.setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.setAttribute("aria-label", "Hidden memory card");
      secondCard.setAttribute("aria-label", "Hidden memory card");
      finishTurn();
    }, 720);
  };

  const startMemoryGame = () => {
    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    matches = 0;
    memoryMoves.textContent = "0";
    memoryMatches.textContent = "0";
    memoryFact.classList.remove("complete");
    memoryFact.innerHTML = `
      <p class="memory-fact-label">UNLOCKED FACT</p>
      <span class="memory-fact-icon" aria-hidden="true">?</span>
      <h3>Find your first pair</h3>
      <p>Each match reveals a small piece of my life outside a project title.</p>
    `;

    const deck = shuffle([...memoryItems, ...memoryItems]);
    memoryGrid.innerHTML = "";
    deck.forEach((item) => {
      const card = document.createElement("button");
      card.className = `memory-card memory-${item.id}`;
      card.type = "button";
      card.dataset.pair = item.id;
      card.dataset.label = item.label;
      card.setAttribute("role", "gridcell");
      card.setAttribute("aria-label", "Hidden memory card");
      card.innerHTML = `
        <span class="memory-card-inner">
          <span class="memory-card-back" aria-hidden="true">OA</span>
          <span class="memory-card-front" aria-hidden="true">
            <b>${item.icon}</b><small>${item.label}</small>
          </span>
        </span>
      `;
      card.addEventListener("click", () => chooseCard(card));
      memoryGrid.append(card);
    });
  };

  memoryReset.addEventListener("click", startMemoryGame);
  startMemoryGame();
}

// Interactive bookshelf
const books = [
  {
    number: "BOOK 01",
    title: "The Little Book of Big Change",
    author: "Amy Johnson",
    note: "This book was pivotal in changing how I think about my own thoughts. It helped me step outside an immediate feeling or habit long enough to see it as something happening, not something that has to control what I do.",
  },
  {
    number: "BOOK 02",
    title: "The Omnivore's Dilemma",
    author: "Michael Pollan",
    note: "It made ordinary choices feel connected to systems I had barely noticed. I liked how it turned something as routine as eating into a question about biology, industry, culture, and responsibility.",
  },
  {
    number: "BOOK 03",
    title: "The Secret History",
    author: "Donna Tartt",
    note: "I love how completely this book creates its own atmosphere. It is intelligent, unsettling, and so absorbing that even when the characters are making terrible decisions, I still want to understand them.",
  },
  {
    number: "BOOK 04",
    title: "The Road",
    author: "Cormac McCarthy",
    note: "The writing is stripped down without feeling empty. It made a brutal story feel strangely tender, and the relationship at its center stayed with me long after I finished it.",
  },
  {
    number: "BOOK 05",
    title: "On Earth We're Briefly Gorgeous",
    author: "Ocean Vuong",
    note: "This is one of the books that reminds me how much form can do. It moves between fiction, memory, and poetry in a way that feels intimate without ever becoming simple.",
  },
];

const bookButtons = [...document.querySelectorAll(".book")];
const bookDetail = document.querySelector(".book-detail");
if (bookButtons.length && bookDetail) {
  const number = bookDetail.querySelector(".book-number");
  const title = bookDetail.querySelector("h3");
  const byline = bookDetail.querySelector(".book-byline");
  const note = bookDetail.querySelector(".book-note");

  bookButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const book = books[Number(button.dataset.book)];
      bookButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      number.textContent = book.number;
      title.textContent = book.title;
      byline.textContent = book.author;
      note.textContent = book.note;
      bookDetail.animate(
        [
          { opacity: 0.25, transform: "translateY(7px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 260, easing: "ease-out" },
      );
    });
  });
}

// Do Not Press Easter egg
const dangerButton = document.querySelector(".do-not-press");
if (dangerButton) {
  dangerButton.addEventListener("click", () => {
    if (body.classList.contains("integrity-warning")) return;
    body.classList.add("integrity-warning");
    dangerButton.textContent = "YOU PRESSED IT";
    setTimeout(() => body.classList.add("integrity-safe"), 1450);
    setTimeout(() => {
      body.classList.remove("integrity-warning", "integrity-safe");
      dangerButton.textContent = "DO NOT PRESS";
    }, 3300);
  });
}
