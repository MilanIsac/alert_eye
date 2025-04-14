const axios = require("axios");
const FormData = require("form-data");

class MLClient{
    constructor(){
        this.mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5000";
    }

    async predictDisaster(imagePath){
        try {
            const formData = new FormData();
            formData.append("file", fs.createReadStream(imagePath));

            const response = await axios.post(`${this.mlServiceUrl}/predict`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            return response.data;
        }
        catch(error){
            console.error("Error calling ML serivce: ", error.response ? error.response.data : error.message);
            throw new Error;
        }
    }
}

module.exports = new MLClient();