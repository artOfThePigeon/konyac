import { Hono } from "hono";
// import { serveStatic } from 'hono/bun';
import { html } from "hono/html";
import { ApiKeySession, ProfilesApi } from "klaviyo-api";

const app = new Hono();


const View = () => {
  return (
    <html>
      <head>
        <title>Konyac</title>
        {html` <script src="https://unpkg.com/htmx.org@1.9.6"></script> `}
      </head>
      <body>
        <h1> Konyac </h1>
        <h3>select tool:</h3>
        <div>
        <ul>
          <li hx-target="this" hx-swap="outerHTML" hx-post="/clicked">
            External ID Update Tool</li>
          </ul>
        </div>
      </body>
      
    </html>
  );
};

//instantiate page
app.get("/", (c) => {
  return c.html(<View />);
});

// entry form
app.post("/clicked", (c) =>
  c.html(
    <form
      id="form"
      method="post"
      hx-encoding="multipart/form-data"
      hx-post="/csv-action"
    >
      <input type="text" name="sheetId" placeholder="google sheets ID" />
      <input type="password" name="apiKey" placeholder="Api Key" />
      <input type="submit" value="Submit" />
      <br />
    </form>
  ),
);

// gets google sheet and passes user entered values 
app.post("/csv-action", async (c) => {
  const { sheetId, apiKey } = await c.req.parseBody();
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
  ); 
  if (response.status == 404){
    return c.html("<p>invalid sheet ID<p>");
  }
  const csv = await response.text();
 console.log(csvToList(csv));
  return c.html(`<p>success!</p>`)
});


// call klaviyo
function callK(uniqueID,externalID,apiKey) {
  const options = {
    method: "PATCH",
    headers: {
      accept: "application/json",
      revision: "2023-09-15",
      "content-type": "application/json",
      Authorization: `Klaviyo-API-Key ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile",
        id: `${"Unique ID"}`,
        attributes: {
          external_id: `${"External ID"}`,
        },
      },
    }),
  };

  fetch(`https://a.klaviyo.com/api/profiles/${"Unique ID"}`, options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

//build csv
function csvToList(csvText) {
  let csvList = [];
  let values = [];
  let lineItem = {};
  let rows = csvText.split("\n");
  let keys = rows.shift().split(",");
  for (let row = 0; row < rows.length; row++) {
    values = rows[row].split(",");
    lineItem = addRow(keys, values);
    csvList.push(lineItem);
  }
  return csvList;
}

function addRow(keys, values) {
  let rowObj = {};
  for (let i = 0; i < values.length; i++) {
    rowObj[keys[i]] = values[i];
  }

  return rowObj;
}

export default {
  port: 8000,
  fetch: app.fetch,
};