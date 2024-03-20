import axios from 'axios';

const url = "http://localhost:5000";

export const allStations = async () => {
    try {
      const response = await axios.get(`${url}/station/stations`, {});
      return response.data;
    } catch (error) {
      if (error.response.data !== undefined) {
        throw error.response.data;
      }
      throw error;
    }
  };