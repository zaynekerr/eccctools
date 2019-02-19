const apiKey = "CovgPVCcHJ60ZGtdGCdMqaCC28qKVW0M1MYm2Qhs";

const baseUrl = " https://qi8gcyskj4.execute-api.eu-west-1.amazonaws.com/DEV";
const tokenUrl = baseUrl + "/token";
const actionUrl = baseUrl + "/action";

const aebaseurl = "https://rco60s22e3.execute-api.eu-west-1.amazonaws.com/DEV";
const requestUrl = aebaseurl + "/request";

const stateMachineArn = "arn:aws:states:eu-west-1:715662236651:stateMachine:upsell-startProcess";

var pureCloudToken = undefined;
var pureCloudEnvironment = undefined;

function connectToPureCloud(clientId, clientSecret, environment) {
  console.log(`Connecting to PureCloud... Client Id: ${clientId}, environment: ${environment}`);
  pureCloudEnvironment = environment;
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: tokenUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          clientId: clientId,
          clientSecret: clientSecret,
          env: environment
        }),
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data.hasOwnProperty("token")) {
          pureCloudToken = data.token;
          console.log("Token:", pureCloudToken)
          resolve(pureCloudToken);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(error);
      })
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#region AE Upsell

function submitRequest(clientId, clientSecret, environment, startDate, duration, emailAddress, taskId) {
  console.log("Submitting Request...");
  return new Promise(function (resolve, reject) {
    try {

      var options = {
        "async": true,
        "crossDomain": true,
        "url": requestUrl,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        "processData": false,
        "data": `{ \"input\": \"{ \\\"name\\\": \\\"${taskId}\\\", \\\"clientId\\\" : \\\"${clientId}\\\", \\\"clientSecret\\\" : \\\"${clientSecret}\\\",\\\"env\\\" : \\\"${environment}\\\" , \\\"startDate\\\": \\\"${startDate}\\\", \\\"duration\\\": ${duration} }\", \"name\": \"${taskId}\", \"stateMachineArn\": \"${stateMachineArn}\"}`
      }

      console.log(options);

      $.ajax(options).done((response) => {
        console.log(response);
        if (response.hasOwnProperty("errorMessage")) {
          reject(response);
          return;
        }
        resolve(response.token);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        reject(errorThrown);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function getRequestData(taskId) {
  console.log(`Getting Request (${taskId})...`);
  return new Promise(function (resolve, reject) {
    try {

      var options = {
        "async": true,
        "crossDomain": true,
        "url": `${requestUrl}?name=${taskId}`,
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        "processData": false
      }

      console.log(options);

      $.ajax(options).done((response) => {
        console.log(response);
        resolve(response);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        reject(errorThrown);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#endregion

//#region PureClean

function getItems(type) {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: actionUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          env: pureCloudEnvironment,
          token: pureCloudToken,
          objectType: type,
          actionType: "GET"
        })
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data) {
          resolve(data.items);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(errorThrown);
      })
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function deleteItems(type, items) {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: actionUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          env: pureCloudEnvironment,
          token: pureCloudToken,
          objectType: type,
          actionType: "DELETE",
          items: items
        })
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data) {
          resolve(data);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(errorThrown);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#endregion
