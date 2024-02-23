import axios from 'axios';

const url = "http://localhost:5000";

export const getAllModules = () => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${url}/accessControl/allAccessControl`)
			.then((response) => resolve(response.data))
			.catch((error) => {
				if (error.response.data !== undefined) {
					reject(error.response.data);
					console.log("err", error)
				}
				reject(error);
				console.log("err", error)


			});
	});
};
