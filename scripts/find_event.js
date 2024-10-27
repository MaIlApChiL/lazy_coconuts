const sqlite3 = require('sqlite3').verbose();
const fs = require('fs'); // Import the fs module

let db = new sqlite3.Database('../sber.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sber database.');
});

function find_id_event_categories(event_ids) {
    const placeholders = event_ids.map(() => '?').join(', ');
    const sql = `SELECT event_id FROM event_category WHERE category_id IN (${placeholders})`;

    return new Promise((resolve, reject) => {
        db.all(sql, event_ids, (err, rows) => { 
            if (err) {
                return reject(err.message);
            }
            const uniqueEventIds = [...new Set(rows.map(row => row.event_id))];
            resolve(uniqueEventIds);
        });
    });
}

function find_name_event(event_ids) {
    const placeholders = event_ids.map(() => '?').join(', ');
    const sql = `SELECT * FROM event WHERE id_event IN (${placeholders})`;

    return new Promise((resolve, reject) => {
        db.all(sql, event_ids, (err, rows) => { 
            if (err) {
                return reject(err.message);
            }
            resolve(rows); // Return the rows directly
        });
    });
}

let id_event = [];

// Example usage
find_id_event_categories([1, 3])
    .then(eventIds => {
        id_event = eventIds; // Store the unique event IDs in id_event
        return find_name_event(id_event); // Call find_name_event with the unique event IDs
    })
    .then(eventDetails => {
        // Write the event details to a JSON file
        fs.writeFile('eventDetails.json', JSON.stringify(eventDetails, null, 2), (err) => {
            if (err) {
                return console.error('Error writing to file:', err);
            }
            console.log('Event details saved to eventDetails.json');
        });
    })
    .catch(err => {
        console.error('Error retrieving event IDs or details:', err);
    })
    .finally(() => {
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });