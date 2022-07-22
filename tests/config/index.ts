let conf = require('./global').default;

try {
    const localConf = require('./local').default;
    conf = {...conf, ...localConf}
}
catch (e) {}

export const config = conf;