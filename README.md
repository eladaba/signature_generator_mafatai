# מחולל חתימות מייל

ממשק WEB פשוט להזנת פרטי עובד בעברית ובאנגלית, יצירת שתי חתימות PNG ושליחה שלהן למייל.

## הפעלה

```bash
npm install
npm start
```

לאחר ההפעלה פותחים:

```text
http://localhost:3000
```

## שליחת מייל

כדי שהכפתור "שליחה למייל" ישלח בפועל, צריך להגדיר SMTP לפני הפעלת השרת:

```bash
export SMTP_HOST="smtp.example.com"
export SMTP_PORT="587"
export SMTP_USER="user@example.com"
export SMTP_PASS="password"
export SMTP_FROM="Signature Generator <user@example.com>"
export SMTP_SECURE="false"
npm start
```

גם בלי SMTP אפשר להשתמש בכפתורי ההורדה ולקבל את שתי החתימות כקבצי PNG.

## התאמת העיצוב לטמפלייט Google Slides

קובץ ה־`.gslides` שסופק הוא קישור למצגת Google ודורש התחברות, לכן אי אפשר היה לחלץ ממנו את השקופיות אוטומטית. אם מייצאים מהמצגת PNG רקע או שולחים קובץ `.pptx`, אפשר להחליף את ציור ה־Canvas ב־`public/app.js` כך שישב בדיוק על הטמפלייט המקורי.
