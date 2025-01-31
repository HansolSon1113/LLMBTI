let userData = {
    'Age' : 20,
    'Job' : "Student(CS)",
    'Country' : "Korea",
    'Interest' : "AI",
};

export const setUserData = (newData) => {
    userData = { ...userData, ...newData };
};

function userInfoTool(key) {
    return `${key}: ${userData[key]}`;
}

export default userInfoTool;