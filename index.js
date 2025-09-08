const jsonFile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

(async () => {
  const git = simpleGit();

  // Start and end dates
  const startDate = moment("2024-09-08", "YYYY-MM-DD");
  const endDate = moment("2025-09-07", "YYYY-MM-DD");

  let currentDate = startDate.clone();

  // Dates to avoid (YYYY-MM-DD format)
  const avoidDates = [
    // "2024-09-16",
    "2024-09-18",
    // "2024-09-21",
    // "2024-10-02",
    // "2024-10-03",
    // "2024-10-05",
    // "2024-10-04",
    "2024-11-17",
    // "2025-04-03",
    "2025-07-10"
  ];

  while (currentDate.isSameOrBefore(endDate)) {
    var DATE = currentDate.format("YYYY-MM-DD HH:mm:ss");
    var DATE_KEY = currentDate.format("YYYY-MM-DD"); // only compare by date

    if (avoidDates.includes(DATE_KEY)) {
      console.log(`⏭️ Skipped commit for ${DATE_KEY}`);
    } else {
      var data = { date: DATE };

      // Write data.json with current date
      await jsonFile.writeFile(FILE_PATH, data);

      // Make git commit with custom date
      await git.add([FILE_PATH])
        .commit(`Commit for ${DATE}`, { '--date': DATE });

      console.log(`✅ Commit created for ${DATE}`);
    }

    // Next day
    currentDate.add(1, 'day');
  }

  // Push all commits
  await git.push("origin", "main");
  console.log("🚀 All commits pushed to GitHub!");
})();
