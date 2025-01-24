async function sendSearch(searchBody){
    const url = "http://138.2.120.185:3000/search"
    const data = {
        "search": searchBody,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    });
    
    return response.json();
}

function searchTool(searchBody){
    return sendSearch(searchBody);
}

export default searchTool;