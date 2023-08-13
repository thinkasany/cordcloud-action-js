const Action = require("./app/action");
const log = require("./app/log");
const speakeasy = require("speakeasy"); // 用于 OTP（一次性密码）生成
const core = require("@actions/core");

(async function() {
  try {
    // 获取输入
    const email = core.getInput("email", { required: true });
    const passwd = core.getInput("passwd", { required: true });
    const host =
      core.getInput("host") ||
      "cordcloud.us,cordcloud.one,cordcloud.biz,c-cloud.xyz";

    const secret = core.getInput("secret");

    const code = secret ? speakeasy.totp({ secret, encoding: "base32" }) : "";

    // 预处理主机
    const hosts = host.split(",").filter(h => h.trim());

    for (const h of hosts) {
      try {
        log.info(`当前尝试host: ${h}`);
        const action = new Action(email, passwd, h, code);
        await action.run();
        // 成功运行，退出循环
        log.info("CordCloud-JS Action 成功结束运行！");
        return;
      } catch (error) {
        log.warning(`运行异常，错误信息：${error}`);
        // 失败，尝试下一个主机
      }
    }

    // 尝试了所有 hosts，都失败
    log.warning("CordCloud Action 运行失败！");
  } catch (error) {
    log.setFailed("错误：", error);
  }
})();
