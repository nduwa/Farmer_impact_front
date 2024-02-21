
import axios from 'axios';

const url = "http://localhost:5000";

export const Userlogin = (userData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${url}/user/login`, {Name_User:userData.userName,password:userData.password})
			.then((response) => resolve(response.data))
			.catch((error) => {
				if (error.response.data !== undefined) {
					reject(error.response.data);
				}
				reject(error);
			});
	});
};


export const allUsers = async () => {
  try {
    const response = await axios.get(`${url}/user/allUsers`, {});
    return response.data;
  } catch (error) {
    if (error.response.data !== undefined) {
      throw error.response.data;
    }
    throw error;
  }
};

