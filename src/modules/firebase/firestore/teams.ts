import { DocumentSnapshot } from '@firebase/firestore-types'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import {
  snapshotErrorHandle,
  existErrorHandle,
} from '~/modules/firebase/firestore/errorHandle'
const firestore = firebase.firestore()
const teamsCollection = firestore.collection('teams')

export async function allTeam(): Promise<types.Team[]> {
  const teams: types.Team[] = []
  await snapshotErrorHandle(teamsCollection.get()).then(qs => {
    qs.forEach(doc => teams.push(doc.data() as types.Team))
  })
  return teams
}

export async function team(teamId: string): Promise<types.Team> {
  const teamDoc: DocumentSnapshot = await existErrorHandle(
    teamsCollection.doc(teamId).get()
  )
  return teamDoc.data() as types.Team
}
