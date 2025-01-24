var userData = {
    'Age' : 20,
    'Job' : "Student(CS)",
    'Country' : "Korea",
    'Interest' : "AI",
};

function userInfoTool(key) {
    return `${key}: ${userData[key]}`;
}

export default userInfoTool;