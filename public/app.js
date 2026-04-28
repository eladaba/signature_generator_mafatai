const form = document.querySelector("#signature-form");
const statusEl = document.querySelector("#status");
const canvases = {
  he: document.querySelector("#signature-he"),
  en: document.querySelector("#signature-en")
};

const logo = new Image();
logo.src = "./assets/ai-autonomy-logo.png";

const colors = {
  nameBlue: "#244e75",
  dividerBlue: "#4d93c9",
  lineBlue: "#244e75",
  black: "#000000",
  white: "#ffffff"
};

const canvasFont = '"Google Sans", Arial, sans-serif';

function getData() {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function fitText(ctx, text, maxWidth, baseSize, minSize, weight = 700) {
  let size = baseSize;

  do {
    ctx.font = `${weight} ${size}px ${canvasFont}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  } while (size >= minSize);

  return minSize;
}

function drawLogo(ctx, x, y, width, height) {
  if (logo.complete && logo.naturalWidth > 0) {
    ctx.drawImage(logo, x, y, width, height);
    return;
  }

  ctx.fillStyle = colors.nameBlue;
  ctx.font = `800 74px ${canvasFont}`;
  ctx.textAlign = "center";
  ctx.direction = "ltr";
  ctx.fillText("AI", x + width / 2, y + height / 2);
  ctx.font = `800 36px ${canvasFont}`;
  ctx.fillText("& Autonomy", x + width / 2, y + height / 2 + 54);
}

function drawDivider(ctx, x, top = 30, bottom = 382) {
  ctx.save();
  ctx.strokeStyle = colors.dividerBlue;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(77, 147, 201, 0.25)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
  ctx.restore();
}

function drawHorizontalRule(ctx, x, y, width) {
  ctx.save();
  ctx.strokeStyle = colors.lineBlue;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(36, 78, 117, 0.2)";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.restore();
}

function drawEnglishSignature(ctx, data) {
  const textX = 505;
  const maxTextWidth = 610;

  drawLogo(ctx, 52, 42, 330, 305);
  drawDivider(ctx, 444);

  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const nameSize = fitText(ctx, data.nameEn, maxTextWidth, 47, 30, 800);
  ctx.fillStyle = colors.nameBlue;
  ctx.font = `800 ${nameSize}px ${canvasFont}`;
  ctx.fillText(data.nameEn, textX, 88);

  const roleSize = fitText(ctx, data.roleEn, maxTextWidth, 46, 30, 800);
  ctx.fillStyle = colors.black;
  ctx.font = `800 ${roleSize}px ${canvasFont}`;
  ctx.fillText(data.roleEn, textX, 143);

  const unitSize = fitText(ctx, data.unitEn, maxTextWidth, 45, 29, 400);
  ctx.font = `400 ${unitSize}px ${canvasFont}`;
  ctx.fillText(data.unitEn, textX, 198);

  drawHorizontalRule(ctx, textX - 18, 226, 665);

  ctx.font = `800 37px ${canvasFont}`;
  ctx.fillText("T:", textX, 282);
  ctx.font = `400 37px ${canvasFont}`;
  ctx.fillText(data.phone, textX + 58, 282);

  ctx.font = `800 37px ${canvasFont}`;
  ctx.fillText("M:", textX, 328);
  ctx.font = `400 37px ${canvasFont}`;
  ctx.fillText(data.email, textX + 63, 328);

  ctx.font = `800 37px ${canvasFont}`;
  ctx.fillText("A:", textX, 374);
  ctx.font = `400 37px ${canvasFont}`;
  ctx.fillText(data.addressEn, textX + 58, 374);
}

function drawHebrewContact(ctx, label, value, x, y) {
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.font = `800 34px ${canvasFont}`;
  ctx.fillStyle = colors.black;
  ctx.fillText(`${label}:`, x, y);

  ctx.direction = "ltr";
  ctx.textAlign = "right";
  ctx.font = `400 34px ${canvasFont}`;
  ctx.fillText(value, x - 122, y);
}

function drawHebrewSignature(ctx, data) {
  const textRight = 735;
  const lineLeft = 120;
  const maxTextWidth = 600;

  drawLogo(ctx, 815, 49, 320, 295);
  drawDivider(ctx, 775);

  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";

  const nameSize = fitText(ctx, data.nameHe, maxTextWidth, 47, 30, 800);
  ctx.fillStyle = colors.nameBlue;
  ctx.font = `800 ${nameSize}px ${canvasFont}`;
  ctx.fillText(data.nameHe, textRight, 87);

  const role = data.roleHe || data.roleEn;
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  const roleSize = fitText(ctx, role, maxTextWidth, 45, 30, 800);
  ctx.fillStyle = colors.black;
  ctx.font = `800 ${roleSize}px ${canvasFont}`;
  ctx.fillText(role, textRight, 141);

  const unit = data.unitHe || data.unitEn;
  const unitSize = fitText(ctx, unit, maxTextWidth, 45, 29, 400);
  ctx.font = `400 ${unitSize}px ${canvasFont}`;
  ctx.fillText(unit, textRight, 196);

  drawHorizontalRule(ctx, lineLeft, 224, 610);

  drawHebrewContact(ctx, "טלפון", data.phone, textRight, 279);
  drawHebrewContact(ctx, "מייל", data.email, textRight, 324);
  drawHebrewContact(ctx, "כתובת", data.addressHe, textRight, 369);
}

function drawSignature(kind, data) {
  const canvas = canvases[kind];
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colors.white;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (kind === "he") {
    drawHebrewSignature(ctx, data);
  } else {
    drawEnglishSignature(ctx, data);
  }
}

function redraw() {
  const data = getData();
  drawSignature("he", data);
  drawSignature("en", data);
}

function downloadSignature(kind) {
  redraw();
  const link = document.createElement("a");
  link.href = canvases[kind].toDataURL("image/png");
  link.download = kind === "he" ? "signature-hebrew.png" : "signature-english.png";
  link.click();
}

form.addEventListener("input", redraw);
form.addEventListener("submit", (event) => event.preventDefault());

document.querySelector("#download-he").addEventListener("click", () => downloadSignature("he"));
document.querySelector("#download-en").addEventListener("click", () => downloadSignature("en"));

logo.addEventListener("load", redraw);
redraw();

if (document.fonts?.ready) {
  document.fonts.ready.then(redraw);
}
