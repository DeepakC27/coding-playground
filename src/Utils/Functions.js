const Babel = require("babel-standalone")

const CustomInternalFunc = () => {
  return `const BotResponse = (msg) => { return (Math.random().toString(36).substring(5)) }`
}

const addCustomFunctionScript = () => {
  try {
    if (document.getElementById('custom-handler-script')) {
      document.body.removeChild(document.getElementById('custom-handler-script'))
    }
    const dynamicScript = document.createElement('script')
    dynamicScript.id = 'custom-handler-script'
    dynamicScript.innerHTML = `${parseCode(CustomInternalFunc())}`
    return document.body.appendChild(dynamicScript)
  } catch {
    return false
  }
}

const parseCode = (code) => {
  let response = Babel.transform(code, {
    presets: ['es2015'],
    plugins: [
      'transform-es2015-arrow-functions',
      // 'transform-es2015-spread',
    //   'transform-es2015-function-name'
    ]
  })
  return response.code
}

export {
  addCustomFunctionScript,
  parseCode
}
