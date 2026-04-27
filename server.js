import express from "express";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "15mb" }));
app.use(express.static(path.join(__dirname, "public")));

function requireSmtpConfig() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    const err = new Error(`Missing SMTP config: ${missing.join(", ")}`);
    err.statusCode = 503;
    throw err;
  }
}

function pngAttachment(name, dataUrl) {
  const match = /^data:image\/png;base64,(?<data>.+)$/u.exec(dataUrl || "");

  if (!match?.groups?.data) {
    const err = new Error(`Invalid PNG data for ${name}`);
    err.statusCode = 400;
    throw err;
  }

  return {
    filename: name,
    content: Buffer.from(match.groups.data, "base64"),
    contentType: "image/png"
  };
}

app.post("/api/send-signatures", async (req, res, next) => {
  try {
    requireSmtpConfig();

    const { recipientEmail, employeeName, signatures } = req.body;

    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(recipientEmail)) {
      return res.status(400).json({ message: "כתובת מייל לא תקינה." });
    }

    if (!signatures?.he || !signatures?.en) {
      return res.status(400).json({ message: "חסרות חתימות לשליחה." });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipientEmail,
      subject: "החתימות שלך למייל",
      text: `שלום ${employeeName || ""},\n\nמצורפות שתי החתימות שלך בפורמט PNG.\nיש להוסיף את הקובץ המתאים להגדרות החתימה בתיבת המייל.\n`,
      attachments: [
        pngAttachment("signature-hebrew.png", signatures.he),
        pngAttachment("signature-english.png", signatures.en)
      ]
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message:
      statusCode === 503
        ? "השרת עדיין לא מוגדר לשליחת מייל. אפשר להוריד את החתימות, או להגדיר SMTP בקובץ ההפעלה."
        : error.message || "אירעה שגיאה בשליחה."
  });
});

app.listen(port, () => {
  console.log(`Signature generator is running at http://localhost:${port}`);
});
