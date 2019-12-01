// import * as functions from 'firebase-functions'
// import { DocumentSnapshot } from '@google-cloud/firestore'
// import * as algoliasearch from 'algoliasearch'
// import * as types from '../../../types'
// import { ALGOLIA_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX_USERS } from '../../../env'
// const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
// const indexUsers = client.initIndex(ALGOLIA_INDEX_USERS)

// module.exports = functions
//   .region('asia-northeast1')
//   .firestore.document('users/{userId}')
//   .onWrite((change, context) => {
//     // 登録、更新
//     if ((change.after as DocumentSnapshot).exists) {
//       const snapShotData: any = (change.after as DocumentSnapshot).data()

//       let accountName = snapShotData.email ? snapShotData.email.match(/[0-9a-z!#\$%\&'\*\+\/\=\?\^\|\-\{\}\.]+/) : ''
//       accountName = Array.isArray(accountName) ? accountName[0] : ''

//       const user: types.IndexUser = {
//         objectID: context.params.userId,
//         id: context.params.userId,
//         accountName: accountName,
//         description: '',
//         email: snapShotData.email,
//         icon: snapShotData.photoURL,
//         displayName: snapShotData.displayName,
//         createdAt: snapShotData.createdAt
//       }

//       console.log('user', snapShotData)

//       // AlgoliaのUserへ追加
//       const saveIndexUsers = indexUsers.saveObject(user)
//       return saveIndexUsers
//     }
//     // 削除
//     else {
//       // AlgoliaのUserから削除
//       const saveIndexUsers = indexUsers.deleteObject(context.params.userId)
//       return saveIndexUsers
//     }
//   })
