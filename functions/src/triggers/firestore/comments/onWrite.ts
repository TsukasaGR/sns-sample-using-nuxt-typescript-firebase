import * as functions from 'firebase-functions'
import { DocumentSnapshot } from '@google-cloud/firestore'
import { Comment } from '../../../types'
import { FIREBASE_REGION } from '../../../env'

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 540,
  // memory: '1GB',
}

module.exports = functions
  .region(FIREBASE_REGION)
  .runWith(runtimeOpts)
  .firestore.document('goals/{goalId}')
  // @ts-ignore
  .onWrite((change: functions.Change<DocumentSnapshot>) => {
    // 登録、更新
    if ((change.after as DocumentSnapshot).exists) {
      const before: Comment | undefined = change.before
        ? ((change.before as DocumentSnapshot).data() as Comment)
        : undefined
      const after: Comment | undefined = change.before
        ? ((change.after as DocumentSnapshot).data() as Comment)
        : undefined

      // 新規登録の場合はobjectIDをセット前にTriggerが動くため、手動でobjectIDをセットしておく
      if (before && !before.objectID)
        before.objectID = (change.before as DocumentSnapshot).id
      if (after && !after.objectID)
        after.objectID = (change.after as DocumentSnapshot).id

      let promiseAll: Promise<any>[] = []

      return Promise.all(promiseAll)
    }
    // 削除
    else {
      // const before: Comment = (change.before as DocumentSnapshot).data() as Comment
      // return deleteSchedules(before.objectID)
    }
  })
