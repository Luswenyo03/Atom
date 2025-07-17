const miningMethods = [
  {
    method: "isl",
    name: "In-situ Leaching (ISL)",
    description:
      "In-situ Leaching (ISL) injects a leaching solution into underground uranium deposits to dissolve and extract uranium, as used at Namibia’s Langer Heinrich mine.",
    beforeImage:
      "https://www.mining.com/wp-content/uploads/2016/06/five-ways-mining-green.png",
    afterImage:
      "https://tse3.mm.bing.net/th/id/OIP.Z0HMCtH6lpfe96b8gSy6SQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", // Placeholder: minimal change
    damageScore: 3,
    damageDescription:
      "Low environmental impact due to minimal surface disruption, but potential groundwater contamination.",
    cost: "Setup: $10M, Annual Operation: $2M",
    namibiaContext:
      "Widely used at Langer Heinrich, ideal for sandstone-hosted deposits.",
  },
  {
    method: "open-pit",
    name: "Open-Pit Mining",
    description:
      "Open-Pit Mining removes large amounts of earth to access shallow uranium deposits, as practiced at Namibia’s Rössing mine.",
    beforeImage:
      "https://www.mining.com/wp-content/uploads/2016/06/five-ways-mining-green.png",
    afterImage:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Arandis_Mine_quer.jpg", // Placeholder: large pit
    damageScore: 8,
    damageDescription:
      "High environmental impact due to significant surface disruption and large waste rock volumes.",
    cost: "Setup: $50M, Annual Operation: $5M",
    namibiaContext:
      "Used at Rössing, one of the world’s largest uranium mines.",
  },
  {
    method: "underground",
    name: "Underground Mining",
    description:
      "Underground Mining accesses deep uranium deposits via tunnels and shafts, suitable for high-grade deposits like those at Husab in Namibia.",
    beforeImage:
      "https://www.mining.com/wp-content/uploads/2016/06/five-ways-mining-green.png",
    afterImage:
      "https://tse4.mm.bing.net/th/id/OIP.XiD9OaQ0Rgup6uT4Xid4xgHaEg?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", // Placeholder: mine entrance
    damageScore: 5,
    damageDescription:
      "Moderate environmental impact with less surface disruption but complex safety requirements.",
    cost: "Setup: $30M, Annual Operation: $3M",
    namibiaContext:
      "Applicable at Husab, supporting Namibia’s 11% global uranium supply.",
  },
];

let isSimulating = false;

function showResult(method) {
  if (isSimulating) return;
  isSimulating = true;
  console.log("Method selected:", method); // Debug
  const grid = document.querySelector(".simulator-grid");
  const cards = document.querySelectorAll(".simulator-card");
  const resultCard = document.querySelector(".result-card");
  const beforeImage = document.getElementById("sim-before-image");
  const afterImage = document.getElementById("sim-after-image");
  grid.classList.add("simulating");
  cards.forEach((card) => {
    card.style.display = "none";
  });
  setTimeout(() => {
    const selectedMethod = miningMethods.find((m) => m.method === method);
    beforeImage.src = selectedMethod.beforeImage;
    beforeImage.style.display = "block";
    afterImage.src = selectedMethod.afterImage;
    afterImage.style.display = "block";
    document.getElementById("sim-result").innerHTML = `
      <p><strong>Method:</strong> ${selectedMethod.name}</p>
      <p><strong>Description:</strong> ${selectedMethod.description}</p>
      <p><strong>Namibia Context:</strong> ${selectedMethod.namibiaContext}</p>
      <p><strong>Environmental Damage (1-10):</strong> ${selectedMethod.damageScore} - ${selectedMethod.damageDescription}</p>
      <p><strong>Estimated Cost:</strong> ${selectedMethod.cost}</p>
    `;
    resultCard.style.display = "flex";
    resultCard.classList.add("visible");
    grid.classList.remove("simulating");
    isSimulating = false;
  }, 600);
}

function resetSimulation() {
  if (isSimulating) return;
  isSimulating = true;
  const grid = document.querySelector(".simulator-grid");
  const cards = document.querySelectorAll(".simulator-card");
  const resultCard = document.querySelector(".result-card");
  const beforeImage = document.getElementById("sim-before-image");
  const afterImage = document.getElementById("sim-after-image");
  grid.classList.add("simulating");
  resultCard.classList.remove("visible");
  setTimeout(() => {
    resultCard.style.display = "none";
    beforeImage.style.display = "none";
    beforeImage.src = "";
    afterImage.style.display = "none";
    afterImage.src = "";
    document.getElementById("sim-result").innerHTML = "";
    cards.forEach((card) => {
      card.style.display = "flex";
    });
    grid.classList.remove("simulating");
    grid.classList.add("restored");
    setTimeout(() => {
      grid.classList.remove("restored");
      isSimulating = false;
    }, 600);
  }, 600);
}

document.querySelectorAll(".simulator-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    e.stopPropagation();
    showResult(card.dataset.method);
  });
});

document.getElementById("sim-reset").addEventListener("click", (e) => {
  e.stopPropagation();
  resetSimulation();
});

// Initialize
resetSimulation();
