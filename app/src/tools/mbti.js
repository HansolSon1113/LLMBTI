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
        this.cnt = 0;
    }

    Update(mbtiData) {
        this.cnt++;
        for (let key in mbtiData) {
            this.data[key] += mbtiData[key];
        }
        console.log(this.data);
        console.log(this.Result());
    }

    Result() {
        const dimensions = {
            //작을수록 앞, 클수록 뒤
            "IE": ["Sociable", "Active"],
            "SN": ["Curious", "Reflective", "Creative"],
            "FT": ["Empathetic", "Emotional", "Reflective"],
            "PJ": ["Active", "Persistent", "Planful"]
        };

        const results = Object.fromEntries(
            Object.entries(dimensions).map(([key, keys]) => [
                key,
                keys.reduce((sum, k) => sum + (this.data[k] || 0) / this.cnt, 0)
            ])
        );

        let MBTI = {}
        if (dimensions["IE"] >= 4) {
            MBTI["IE"] = "E"
        } else {
            MBTI["IE"] = "I"
        }
        if (dimensions["SN"] >= 2) {
            MBTI["SN"] = "N"
        } else {
            MBTI["SN"] = "S"
        }
        if (dimensions["FT"] >= 3) {
            MBTI["FT"] = "T"
        } else {
            MBTI["FT"] = "F"
        }
        if (dimensions["PJ"] >= 1) {
            MBTI["PJ"] = "J"
        } else {
            MBTI["PJ"] = "P"
        }

        return { "Value": results, "Result": MBTI };
    }
}

export default mbtiDatabase;