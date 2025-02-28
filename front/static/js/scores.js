class Scores {
    constructor() {
        this.left_score = 0;
        this.right_score = 0;
    }

    get l_score() {
        return this.left_score;
    }

    get r_score() {
        return this.right_score;
    }

    increment_lscore() {
        this.left_score += 1;
    }

    increment_rscore() {
        this.right_score += 1;
    }
}