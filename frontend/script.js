// ============================================================
// DÉRIVE — frontend logic
// Talks only to our own FastAPI backend. The Watson Orchestrate
// API key never touches this file or the browser.
// ============================================================

const BACKEND_URL = "http://localhost:8000"; // change if you deploy the backend elsewhere

const form          = document.getElementById("skinForm");
const submitBtn     = document.getElementById("submitBtn");
const formHint      = document.getElementById("formHint");
const emptyState    = document.getElementById("emptyState");
const thinkingState = document.getElementById("thinkingState");
const agentAnswer   = document.getElementById("agentAnswer");
const routineSection= document.getElementById("routineSection");
const connStatus    = document.getElementById("connStatus");

let threadId = null; // preserved across turns so the agent keeps context

// ---- backend health check on load -------------------------------------
(async function checkBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    connStatus.textContent = `backend connected · agent ${data.agent_configured ? "configured" : "not configured"}`;
    connStatus.classList.add("ok");
  } catch (err) {
    connStatus.textContent = "backend unreachable — start the FastAPI server on :8000";
    connStatus.classList.add("err");
  }
})();

// ---- form submission ----------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const skinType = formData.get("skinType");
  const concern  = formData.get("concern");
  const climate  = formData.get("climate");
  const cycle    = formData.get("cycle");

  const userMessage =
    `Skin type: ${skinType}. Active concern: ${concern}. ` +
    `Climate: ${climate}. Routine cycle: ${cycle}. ` +
    `Please give me a clinical 3-step skincare routine (cleanse, treat, protect) ` +
    `tailored to this profile, with product-type recommendations and brief reasoning.`;

  setLoadingState(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, thread_id: threadId }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Server responded ${res.status}`);
    }

    const data = await res.json();
    threadId = data.thread_id || threadId;

    await revealAnswer(data.reply);
    populateRoutine(data.reply);

  } catch (err) {
    await revealAnswer(
      `Something went wrong reaching your agent: ${err.message}\n\n` +
      `Check that the FastAPI backend is running and that your .env ` +
      `credentials are correct.`
    );
  } finally {
    setLoadingState(false);
  }
});

// ---- UI state helpers -----------------------------------------------------
function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  formHint.textContent = isLoading
    ? "Talking to the orchestrated agent…"
    : "Orchestrated by watsonx · your session is not stored";

  emptyState.hidden = true;

  if (isLoading) {
    agentAnswer.hidden = true;
    thinkingState.hidden = false;
  } else {
    thinkingState.hidden = true;
  }
}

// types the answer out for a bit of ceremony, without being gimmicky
async function revealAnswer(text) {
  agentAnswer.hidden = false;
  agentAnswer.textContent = "";

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  agentAnswer.appendChild(cursor);

  const chunks = text.split(/(\s+)/); // keep whitespace tokens
  for (const chunk of chunks) {
    cursor.before(document.createTextNode(chunk));
    await sleep(6);
  }
  cursor.remove();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- naive 3-step parser ---------------------------------------------------
// Looks for cleanse / treat / protect (or step 1/2/3) segments in the
// agent's free-text reply and drops them into the droplet cards.
// Falls back gracefully if the agent's phrasing doesn't match.
function populateRoutine(text) {
  const slots = {
    cleanse: document.querySelector('[data-slot="cleanse"]'),
    treat:   document.querySelector('[data-slot="treat"]'),
    protect: document.querySelector('[data-slot="protect"]'),
  };

  const patterns = {
    cleanse: /(cleanse[^:.\n]*[:.\-–]?)([\s\S]*?)(?=treat|step\s*2|protect|$)/i,
    treat:   /(treat[^:.\n]*[:.\-–]?)([\s\S]*?)(?=protect|step\s*3|$)/i,
    protect: /(protect[^:.\n]*[:.\-–]?)([\s\S]*)/i,
  };

  let found = false;
  for (const key of Object.keys(patterns)) {
    const match = text.match(patterns[key]);
    if (match && match[2] && match[2].trim().length > 4) {
      slots[key].textContent = truncate(match[2].trim(), 220);
      found = true;
    }
  }

  if (found) {
    routineSection.hidden = false;
    routineSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
