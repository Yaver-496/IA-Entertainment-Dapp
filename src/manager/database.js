export async function insertData(userData) {

    const sqlQuery = `INSERT INTO User (UserID, UserName, Score) VALUES (${userData.UserID}, '${userData.UserName}', ${userData.Score})`;
    const response = await fetchDatabase(sqlQuery);

    if (response.success) {
        return ("new_data_added_successfull");
    } else {
        return ("data_not_added");
    }
}

export async function updateData(userData) {

    const sqlQuery = `UPDATE User SET UserName = '${userData.UserName}', Score = ${userData.Score} WHERE UserID = ${userData.UserID}`;
    const response = await fetchDatabase(sqlQuery);

    if (response.success) {
        return ("data_update_successfull");
    } else {
        return ("data_not_updated");
    }
}

export async function getData(userID) {

    const sqlQuery = `SELECT * FROM User WHERE UserID = ${userID}`;
    const response = await fetchDatabase(sqlQuery);

    if (response.success) {

        const data = response.data;

        if (data.success) {

            if (data.results.length > 0) {
                const userData = data.results[0];
                return userData;
            } else {
                return ("data_not_found");
            }

        } else {
            return ("request_not_success");
        }
    } else {
        return("data_not_getted");
    }
}

export async function getAllUsers(){
    const sqlQuery = `SELECT * FROM User`;
    const response = await fetchDatabase(sqlQuery);
    
    if (response.success) {

        const data = response.data;

        if (data.success) {

            if (data.results.length > 0) {
                return data.results;
            } else {
                return ("data_not_found");
            }

        } else {
            return ("request_not_success");
        }
    } else {
        return("data_not_getted");
    }
}

async function fetchDatabase(sqlQuery) {

    const fetchResult = {
        success: false,
        data: null,
        error: false
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sqlQuery)
    };

    try {        
        const url = `https://sur-ay-brat.bombomdon.workers.dev/tg-user-data`;

        await fetch(url, options).then( async (response) => {
            
            const data = await response.json();

            fetchResult.success = data.success;
            fetchResult.error = false;
            fetchResult.data = data;
        }).catch((err) => console.log("error: " + err));


    } catch (err) { fetchResult.success = false; fetchResult.error = true; fetchResult.data = err; }

    return fetchResult;
}
