const uuid_valid = (data) => {
    // Regular expression to check if string is a valid UUID
            const regexExp = [
                        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/gi,
                        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[2][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/gi,
                        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[3][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/gi,
                        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/gi,
                        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[5][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/gi,
            ];
            // find in array 
                const valid = regexExp.find( item => item.test(data) === true);
                return (valid)?true:false;
}

// handler not validate post request
const validate_post_data = (body) => {
    try {
        const data = JSON.parse(body);
        if(typeof data.age === 'number' && typeof data.username === 'string' && Array.isArray(data.hobbies)) {
            // check array only string type item
            if (!data.hobbies.find( item => typeof item !== 'string')){
                return data;
            }
        }
        process.stdout.write("Status: 400\nError validate request body. Check for required fields\n");
            const error = {
                statusCode: 400, 
                message: "Error validate request body. Check for required fields"
            }
        return error;
    }catch (e) {
        process.stdout.write("Status: 400\n"+e.message+"\n");
            const error = {
                statusCode: 400, 
                message: e.message
            }
        throw new Error(JSON.stringify(error));
    }
};

module.exports = { uuid_valid, validate_post_data };