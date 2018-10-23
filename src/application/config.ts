const ENV = process.env.NODE_ENV || 'development'
import * as path from 'path'

const secretContext = require.context('./../../config/secret/', false, /\.json?$/)
const publicContext = require.context('./../../config/', false, /\.json?$/)

/**
    Access to the proper config file.
    Check for config under /config/secret/config.json
*/

function properConfig(configName: any) {
    const secretInclude = secretContext.keys().filter((key: any) => key.includes(configName + '.json'))[0]
    if (secretContext(secretInclude)[ENV]) {
        return secretContext(secretInclude)[ENV]

    } else {
        const publicInclude = publicContext.keys().filter((key: any) => key.includes(configName + '.json'))[0]
        return publicContext(publicInclude)[ENV]
    }
}

export default properConfig
