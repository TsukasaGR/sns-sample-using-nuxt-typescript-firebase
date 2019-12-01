import * as types from '~/types/domainTypes'
import { allTeam as getAllTeam } from '~/modules/firebase/firestore/teams'

export async function teamsOfUser(userId: string): Promise<types.Team[]> {
  const teams: types.Team[] = []
  const allTeam = await getAllTeam()
  for (const team of allTeam) {
    if (existsUser(team, userId)) teams.push(team)
  }

  return teams
}

function existsUser(team: types.Team, userId: string): boolean {
  return team.members.find(member => member.objectID === userId) !== undefined
}
