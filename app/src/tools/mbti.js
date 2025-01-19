class mbtiDatabase {
    constructor() {
        this.data = {
            "Sociable": 0,
            "Curious": 0,
            "Empathetic": 0,
            "Active": 0,
            "Persistent": 0,
            "Emotional": 0,
            "Planful": 0,
            "Reflective": 0,
            "Creative": 0,
        };
    }

    Update(mbtiData) {
        for (let key in mbtiData) {
            this.data[key] += mbtiData[key];
        }
        console.log(this.data);
    }
}

export default mbtiDatabase;