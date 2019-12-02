type FunctionGroupDetail = {
  [key: string]: Function
}

type FunctionGroup = {
  [key: string]: FunctionGroupDetail
  api: FunctionGroupDetail
  // trigger: FunctionGroupDetail
  // pubsub: FunctionGroupDetail
}

const funcs: FunctionGroup = {
  api: {
    comments: require('./https/comments'),
    users: require('./https/users'),
  },
  // trigger: {
  //   goalOnWrite: require('./triggers/firestore/goals/onWrite'),
  // },
  // pubsub: {
  //   noticeDeploy: require('./pubsubs/noticeDeploy'),
  // },
}

const loadFunctions = (funcsObj: FunctionGroup) => {
  for (const group in funcsObj) {
    // グループ単位のデプロイ
    if (process.env.FUNCTION_NAME === group) {
      exports[group] = funcsObj[group]
    }
    // function単位の(or全)デプロイ
    else {
      for (const name in funcsObj) {
        if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name) {
          exports[name] = funcsObj[name]
        }
      }
    }
  }
}

loadFunctions(funcs)
