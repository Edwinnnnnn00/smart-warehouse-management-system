import express from 'express';
import { getStatus, getTempData} from './database.js'; // Assuming you have defined the appropriate functions in database.js

const app = express();

app.use(express.json());

app.get("/status", async (req, res) => {

  let status = await getStatus()
  setTimeout(() => {
    res.send(status)
  }, 500)
})

app.get("/tempd", async (req, res) => {

  let tempd = await getTempData()
  setTimeout(() => {
    res.send(tempd)
  }, 500)
})


app.get('/temp', async (req, res) => {
  try {
    const data = await getTempData();
    const reversedData = data.reverse();  // Reverse to show the latest data on the right

    // console.log('Data:', reversedData);  // Log the data for debugging

    const chartConfig = {
      type: 'line',
      data: {
        labels: reversedData.map(item => item.date),
        datasets: [{
          label: 'Temperature',
          data: reversedData.map(item => item.temp),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            type: 'category',  //'category' instead of 'time' to avoid the automatic generation of time intervals
            labels: reversedData.map(item => item.date), // Use the exact labels from your data
            title: {
              display: true,
              text: 'Timestamp'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          }
        }
      }
    };

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Temperature Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
      </head>
      <body>
        <h1>Temperature Chart</h1>
        <canvas id="tempChart"></canvas>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            console.log('Chart.js is loaded:', Chart);
            const ctx = document.getElementById('tempChart').getContext('2d');
            new Chart(ctx, ${JSON.stringify(chartConfig)});
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
    res.status(500).send('Error retrieving data from the database');
  }
});


app.get("/data", async (req, res) => {
    try {
        let status = await getStatus();
        res.send(status);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/chart", async (req, res) => {
    try {
        let data_ori = await getStatus();
        const data = data_ori.reverse();  // Reverse to show the latest data on the right
        // Extract data for chart
        const labels = data.map(item => item.date);
        const lightData = data.map(item => item.light);
        const mediumData = data.map(item => item.medium);
        const heavyData = data.map(item => item.heavy);
        // Create chart configuration
        const chartConfig = {
            type: 'bar',
            data: {
            labels: labels,
            datasets: [
                {
                label: 'Light',
                data: lightData,
                backgroundColor: 'rgba(255, 206, 86, 0.5)'
                },
                {
                label: 'Medium',
                data: mediumData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
                },
                {
                label: 'Heavy',
                data: heavyData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }
            ]
            },
            options: {
            scales: {
                x: {
                stacked: true
                },
                y: {
                stacked: true
                }
            }
            }
        };
        // Send HTML with embedded chart
        setTimeout(() => {     
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Stacked Bar Chart</title>
                    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                </head>
                <body>
                    <canvas id="barChart"></canvas>
                    <div style="width:95%">
                    <canvas id="stackedBarChart"></canvas>
                    </div>
                    <script>
                    var ctx = document.getElementById('stackedBarChart').getContext('2d');
                    new Chart(ctx, ${JSON.stringify(chartConfig)});
                    </script>
                </body>
                </html>
            `);
        }, 500) 
    } catch (error) {
    res.status(500).send('Error retrieving status');
    }
});

app.listen(8080, () => {
console.log('Server is running on port 8080')
})