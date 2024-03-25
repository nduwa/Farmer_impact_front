import axios from "axios";

const url = "http://localhost:5000";
export const getAllGeneralHarvest = (data) => {
  console.log("data", data);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${url}/harvests/generalHarvest?season=${data.season}&station=${data.station}`
      )
      .then((response) => resolve(response.data))
      .catch((error) => {
        if (error.response?.data !== undefined) {
          reject(error.response.data);
        }
        reject(error);
      });
  });
};

export const getAllSeasons = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/harvests/seasons`)
      .then((response) => resolve(response.data))
      .catch((error) => {
        if (error.response?.data !== undefined) {
          reject(error.response.data);
        }
        reject(error);
      });
  });
};
