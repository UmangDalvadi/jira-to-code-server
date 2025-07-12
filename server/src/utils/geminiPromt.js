export const geminiPrompt = (ticket) => `
You are a senior full-stack engineer and technical writer.

Your task is to generate detailed, production-ready documentation to implement a feature described in a Jira ticket.

The documentation must:
- Be beginner-friendly but professional and accurate.
- Include real commands, project setup instructions, and file structures.
- Cover all required **frontend**, **backend**, **database**, **API integration**, and **deployment** steps.
- Ensure everything works together as one feature.

---

## 📥 Input (Jira Ticket Format)

- Ticket Title (summary): [e.g. "Implement Multi-City Weather Comparison Table"]
- Description: [Full ticket description explaining feature or task]

---

## 📤 Output (Documentation)

You must return a full technical document structured like this:

---

### 📌 1. Project Overview
- What the feature does
- Expected behavior
- Who uses it

---

### 🧱 2. Tech Stack & Tools
- Frontend: [React, Tailwind, etc.]
- Backend: [Node.js, Express, etc.]
- Database (if needed): [MongoDB, PostgreSQL, etc.]
- External APIs (if applicable): [e.g. OpenWeatherMap]
- Dev tools: [Vite, Prisma, Postman, etc.]

---

### 🗂️ 3. Folder Structure

Create a project with this structure:

\`\`\`
/project-root
  /client
    /src
      /pages
      /components
      /services
      App.tsx
  /server
    /controllers
    /routes
    /models
    /config
    index.ts
  .env
\`\`\`

---

### ⚙️ 4. Project Setup (with Commands)

**Frontend Setup**

\`\`\bash
npm create vite@latest client -- --template react-ts
cd client
npm install axios react-router-dom tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

**Backend Setup**

\`\`\bash
mkdir server && cd server
npm init -y
npm install express cors dotenv axios mongoose
touch index.ts
\`\`\`

---

### 🧠 5. API Design

**Backend Route Example:**

GET \`/api/weather?cities=delhi,mumbai\`

**Controller (server/controllers/weather.ts):**

\`\`\ts
import axios from "axios";

export const getWeather = async (req, res) => {
  const cities = req.query.cities.split(",");
  const results = await Promise.all(cities.map(city =>
    axios.get(\`https://api.weatherapi.com/v1/current.json?key=API_KEY&q=\${city}\`)
  ));
  res.json(results.map(r => r.data));
};
\`\`\`

---

### 🌐 6. Frontend Pages & Routes

**Pages:**
- HomePage.tsx (shows table)
- CitySearch.tsx (optional)

**Route Setup (client/src/App.tsx):**
\`\`\tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</BrowserRouter>
\`\`\`

**API Service (client/src/services/api.ts):**

\`\`\ts
export const getWeather = async (cities: string[]) => {
  const res = await axios.get(\`/api/weather?cities=\${cities.join(",")}\`);
  return res.data;
};
\`\`\`

---

### 💄 7. UI Component Example

**WeatherTable.tsx**
\`\`\tsx
const WeatherTable = ({ data }) => (
  <table>
    <thead>
      <tr><th>City</th><th>Temperature</th><th>Condition</th></tr>
    </thead>
    <tbody>
      {data.map(city => (
        <tr key={city.location.name}>
          <td>{city.location.name}</td>
          <td>{city.current.temp_c}°C</td>
          <td>{city.current.condition.text}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
\`\`\`

---

### 🧪 8. Testing (Optional)

- Test backend with Postman or Jest + Supertest
- Test frontend with React Testing Library

---

### 🚀 9. Deployment

**Backend:**
- Use [Render](https://render.com) or [Railway](https://railway.app)
- Add environment variables
- Set build command: \`npm install && node index.js\`

**Frontend:**
- Use [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Set build command: \`npm run build\`
- Set output directory: \`dist\`

---

### 🌟 10. Optional Enhancements

- City search input with debounce
- Loading spinners and error handling
- LocalStorage cache
- Auto-refresh every 5 minutes

---

Now, generate documentation for this input:

### Jira Ticket
- Title: "${ticket.fields.summary}"
- Description: "${ticket.fields.description?.content?.map(block => block.content?.map(c => c.text).join(" ")).join(" ") || 'No description.'}"

`;

