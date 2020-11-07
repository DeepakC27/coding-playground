const CustomInternalFunc = () => {
  return `function BotResponse (msg) { return (Math.random().toString(36).substring(5)) }`
}

const addCustomFunctionScript = () => {
  try {
    if (document.getElementById('custom-handler-script')) {
      document.body.removeChild(document.getElementById('custom-handler-script'))
    }
    const dynamicScript = document.createElement('script')
    dynamicScript.id = 'custom-handler-script'
    dynamicScript.innerHTML = `${CustomInternalFunc()}`
    return document.body.appendChild(dynamicScript)
  } catch {
    return false
  }
}

export { addCustomFunctionScript }
