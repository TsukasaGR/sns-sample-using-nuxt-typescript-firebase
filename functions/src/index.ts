type FunctionGroupDetail = {
  [key: string]: Function
}

type FunctionGroup = {
  [key: string]: FunctionGroupDetail
  api: FunctionGroupDetail
  trigger: FunctionGroupDetail
  pubsub: FunctionGroupDetail
}

const funcs: FunctionGroup = {
  api: {
    userOnRequest: require('./https/users'),
    goalOnRequest: require('./https/goals'),
    recordOnRequest: require('./https/records'),
    retrospectiveOnRequest: require('./https/retrospectives'),
    teamOnRequest: require('./https/teams'),
    alertOnRequest: require('./https/alerts'),
  },
  trigger: {
    goalOnWrite: require('./triggers/firestore/goals/onWrite'),
  },
  pubsub: {
    noticeDeploy: require('./pubsubs/noticeDeploy'),
  },
}

const loadFunctions = (funcsObj: FunctionGroup) => {
  for (const group in funcsObj) {
    // グループ単位のデプロイ
    if (process.env.FUNCTION_NAME === group) {
      exports[group] = funcsObj[group]
    }

    // function単位の(or全)デプロイ
    for (const name in funcsObj) {
      if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name) {
        exports[name] = funcsObj[name]
      }
    }
  }
}

loadFunctions(funcs)
