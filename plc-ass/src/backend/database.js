import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config()

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password : "",
  database: "plc"
}).promise();


// latest 10 rows with different hours
export const getTempData = async () => {
  try {
    // Execute the SQL query to get the latest 50 records from the scada table
    // This is a safeguard to have enough data to filter out duplicates by hour
    const [rows] = await db.query(`
      SELECT Status, Date
      FROM scada
      ORDER BY Date DESC
      LIMIT 5
    `);

    // Map the rows to extract temp and date, and parse the JSON in Status
    const mappedRows = rows.map(row => {
      const status = JSON.parse(row.Status);
      return {
        temp: status.temp,
        date: new Date(row.Date)
      };
    });

    // Filter rows to only include one entry per hour
    const filteredRows = [];
    const seenHours = new Set();

    for (const row of mappedRows) {
      const hourString = row.date.toISOString().substring(0, 13); // Extract 'YYYY-MM-DDTHH'
      if (!seenHours.has(hourString)) {
        filteredRows.push(row);
        seenHours.add(hourString);
      }
      if (filteredRows.length >= 20) {
        break; // Stop when we have 10 unique hour entries
      }
    }

    // Return the filtered rows, converting dates back to strings if needed
    return filteredRows.map(row => ({
      temp: row.temp,
      date: formatDate(new Date(row.date.toISOString()))
    }));
  } catch (error) {
    // Handle any errors that occur during the database query or JSON parsing
    console.error('Error fetching temperature data:', error);
    throw error; // Optionally rethrow the error to be handled by the caller
  }
};

//latest 12 rows with different hours
export async function getStatus() {
  // Fetch more rows initially to ensure we have enough data to filter out duplicates by hour
  const [rows] = await db.query("SELECT * FROM scada ORDER BY Date DESC LIMIT 10");

  let result = []; // Define an empty array to store results
  const seenHours = new Set(); // Set to keep track of seen hours

  // Loop through each row returned by the query
  for (const row of rows) {
    const jsonString = row.Status;
    const date = new Date(row.Date);

    // Generate a string representing the year, month, day, and hour of the date
    const hourString = date.toISOString().substring(0, 13); // 'YYYY-MM-DDTHH'

    // Only include the row if we haven't seen this hour before
    if (!seenHours.has(hourString)) {
      // Parse the JSON string to a JavaScript object
      const jsonObject = JSON.parse(jsonString);

      // Count true values for properties in the JavaScript object using countTrueValues() function
      const counts = countTrueValues(jsonObject, date);

      // Push counts to the result array
      result.push(counts);

      // Add the hour to the seen hours set
      seenHours.add(hourString);
    }

    // Stop if we have 12 unique hour entries
    if (result.length >= 20) {
      break;
    }
  }

  return result;
}

export async function getHomeData() {
  try {
    // console.log("Fetching data from database");
    // Fetch the most recent row from the scada table
    const rows = await db.query("SELECT * FROM scada ORDER BY Date DESC LIMIT 1");
    // console.log("Fetched data from database");

    if (rows.length === 0) {
      throw new Error("No data found in the scada table.");
    }

    // Assuming the row is returned as an array
    const row = rows[0][0];
    // console.log(row);
    const status = JSON.parse(row.Status);

    // console.log(status);
    return status;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error; // Re-throw the error after logging it
  }
}

function countTrueValues(data, date) {
  let counts = {
    light: 0,
    medium: 0,
    heavy: 0,
    date: formatDate(date) // Initialize the date property with the provided date
  };
  console.log(data);

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (key.startsWith('Light') && data[key] === false) {
        counts.light++;
      } else if (key.startsWith('Medium') && data[key] === false) {
        counts.medium++;
      } else if (key.startsWith('Heavy') && data[key] === false) {
        counts.heavy++;
      }
      // if (key.startsWith('Light')) {
      //   counts.light++;
      // } else if (key.startsWith('Medium')) {
      //   counts.medium++;
      // } else if (key.startsWith('Heavy')) {
      //   counts.heavy++;
      // }
    }
  }
  console.log(counts);
  return counts;
}

// Function to format date as "YYYY-MM-DD HH:mm:ss"
function formatDate(date) {
  // Add 8 hours to the date
  date.setHours(date.getHours() + 8);

  const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return formattedDate;
}