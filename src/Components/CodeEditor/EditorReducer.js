const InitialState = [{
  fileName: 'main.js',
  code: `function handleResponse (msg) {\n\t// YOUR CODE HERE
    return new Promise(resolve => { \n\t\tsetTimeout(() => {\n\t\t\tresolve(msg)\n\t\t}, 3000)\n\t})\n}`
}]

const EditorReducer = (state = InitialState, action) => {
  switch (action.type) {
    case 'ADD_NEW_FILE':
      return [
        ...state,
        {
          fileName: Math.random().toString(36).substring(9) + '.js',
          code: 'function handleResponse (msg) {\n\t // YOUR CODE HERE\n return msg \n}'
        }
      ]
    case 'REMOVE_FILE':
      return state.filter((file, idx) => idx !== action.fileIdx)

    case 'UPDATE_FILE_CODE':
      let updatedState = state.map((file, idx) => {
        if (idx === action.fileIdx) {
          file.code = action.code
        }
        return file
      })
      return updatedState
    default:
      return state
  }
}

export {
  EditorReducer,
  InitialState
}