const axios = require("axios");
const log = require("./log");

class Action {
  constructor(email, passwd, host = "cordcloud.us", code = "") {
    // console.log(email, passwd, code, host);
    this.email = email;
    this.passwd = passwd;
    this.code = code;
    this.host = host.replace("https://", "").replace("http://", "").trim();
    this.session = axios.create({ timeout: 6000, withCredentials: true });
  }

  formatUrl(path) {
    return `https://${this.host}/${path}`;
  }

  async login() {
    const loginUrl = this.formatUrl("auth/login");
    const form_data = {
      email: this.email,
      passwd: this.passwd,
      code: this.code
    };
    const response = await this.session.post(loginUrl, form_data, {
      validateStatus: () => true
    });
    /** 这个站点是用cookie来做权限验证的，需要传递cookie */
    const cookie = response.headers["set-cookie"];
    this.session.defaults.headers["Cookie"] = cookie;
    return response.data.msg ? response.data : {}; // 错误的时候返回html, 强行替换成空对象，太长了不想看
  }

  async checkIn() {
    const checkInUrl = this.formatUrl("user/checkin");
    const response = await this.session.post(checkInUrl, null, {
      validateStatus: () => true
    });
    return response.data.msg ? response.data : {};
  }

  async info() {
    const userUrl = this.formatUrl("user");
    const response = await this.session.get(userUrl, {
      timeout: 6000,
      validateStatus: () => true
    });
    const html = response.data;

    const todayUsedMatch = html.match(
      /<span class="traffic-info">今日已用<\/span>(.*?)<code class="card-tag tag-red">(.*?)<\/code>/s
    );
    const totalUsedMatch = html.match(
      /<span class="traffic-info">过去已用<\/span>(.*?)<code class="card-tag tag-orange">(.*?)<\/code>/s
    );
    const restMatch = html.match(
      /<span class="traffic-info">剩余流量<\/span>(.*?)<code class="card-tag tag-green" id="remain">(.*?)<\/code>/s
    );

    if (todayUsedMatch && totalUsedMatch && restMatch) {
      return [todayUsedMatch[2], totalUsedMatch[2], restMatch[2]];
    }
    return [];
  }

  async run() {
    // 登录
    const login = await this.login();
    log.info(`尝试帐号登录，结果：${JSON.stringify(login)}`);

    // 签到
    const check = await this.checkIn();
    log.info(`CordCloud 帐号续命失败，错误信息: ${JSON.stringify(check)}`);

    // 流量信息
    const info = await this.info();
    log.info(`帐号流量使用情况：今日已用 ${info[0]}, 过去已用 ${info[1]}, 剩余流量 ${info[2]}`);
  }
}

module.exports = Action;
