import fs from "node:fs";

const savePre = "PmGame";
const savePath = './data/userGmDate'
const gmType = {
    1: {en: 'digitalBomb', zn: '数字炸'},
    2: {en: 'tictactoe', zn: '井字棋'},
    3: {en: 'gobang', zn: '五子棋'},
    4: {en: 'sudoku', zn: '数独'}
}

const GmDao = {
    async getCnt(type, res, qq) {
        let key = `${savePre}:${gmType[type].en}-${res}:${qq}`;
        let cnt = await redis.get(key);
        if (!cnt) {
            let ans = 0;
            if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
            if (!fs.existsSync(savePath + `/${qq}.json`)) return 0;
            let userDate = JSON.parse(fs.readFileSync(`${savePath}/${qq}.json`, "utf-8"));
            for (let k of Object.keys(userDate)) {
                if (k === key) ans = userDate[k];
                await redis.set(k, userDate[k]);
            }
            return ans;
        } else {
            return cnt;
        }
    },
    async updateCnt(type, res, qq, cnt) {
        let key = `${savePre}:${gmType[type].en}-${res}:${qq}`;
        await redis.set(key, cnt);
        if (!fs.existsSync(savePath + `/${qq}.json`)) {
            fs.writeFileSync(savePath + `/${qq}.json`, "{}");
        }
        let userDate = JSON.parse(fs.readFileSync(`${savePath}/${qq}.json`, "utf-8"));
        userDate[key] = cnt;
        writeBackJson(userDate, qq);
    }
}

function writeBackJson(obj, qq) {
    let content = JSON.stringify(obj, null, "\t");
    fs.writeFileSync(`${savePath}/${qq}.json`, content, "utf-8");
}

export default GmDao;

export function gmErrorMsg() {
    return `当前正在进行${gmType[isPmPlaying[e.group_id]].zn}，一个群同时只能打开一个游戏`;
}