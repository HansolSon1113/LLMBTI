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
        this.alpha = 0.4;
    }

    Update(mbtiData) {
        for (let key in mbtiData) {
            this.data[key] = (1 - this.alpha) * this.data[key] + this.alpha * mbtiData[key]; //EMA
        }
        console.log(this.data);
        console.log(this.Result());
    }

    Result() {
        const dimensions = {
            "IE": ["Sociable", "Active"],
            "SN": ["Curious", "Reflective", "Creative"],
            "FT": ["Empathetic", "Emotional", "Reflective"],
            "PJ": ["Active", "Persistent", "Planful"]
        };

        const results = Object.fromEntries(
            Object.entries(dimensions).map(([key, keys]) => [
                key,
                keys.reduce((sum, k) => sum + this.data[k], 0) / keys.length
            ])
        );

        let MBTI = {};
        MBTI["IE"] = results["IE"] >= 1.5 ? "E" : "I";
        MBTI["SN"] = results["SN"] >= 0.6 ? "N" : "S";
        MBTI["FT"] = results["FT"] >= 0.2 ? "T" : "F";
        MBTI["PJ"] = results["PJ"] >= 1 ? "J" : "P";

        return { "Value": results, "Result": MBTI };
    }
}

export default mbtiDatabase;
