import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assert, describe, test } from 'vitest'
import { ParseResult, Schema } from 'effect'
import {
  RawBranch,
  RawGuest,
  RawLobbyGroup,
  RawOrganisation,
  RawParliamentarian,
} from 'src/api/mappers/raw'

export const schemaMap = {
  [RawBranch.toString()]: RawBranch,
  [RawGuest.toString()]: RawGuest,
  [RawLobbyGroup.toString()]: RawLobbyGroup,
  [RawOrganisation.toString()]: RawOrganisation,
  [RawParliamentarian.toString()]: RawParliamentarian,
} as const

type TestData = Array<{
  decoder: keyof typeof schemaMap
  data: Array<unknown>
}>

// We can't load JSON through resolveJsonModule directly, because the data is too large for TS
const loadTestData = (name: string) =>
  JSON.parse(
    readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), `test/data/${name}.json`),
      'utf-8',
    ),
  ) as TestData

const assertSchema = (schema: Schema.Schema<any, any>) => (i: unknown) =>
  assert.doesNotThrow(() =>
    ParseResult.decodeUnknownSync(schema, {
      errors: 'all',
      // onExcessProperty: 'error',
    })(i),
  )

describe('Branches', () => {
  const testData = loadTestData('branches')
  test.each(testData)('$path', ({ decoder, data }) => {
    data.forEach(assertSchema(schemaMap[decoder]))
  })
})

describe('Guests', () => {
  const testData = loadTestData('guests')
  test.each(testData as TestData)('$path', ({ decoder, data }) => {
    data.forEach(assertSchema(schemaMap[decoder]))
  })
})

describe('LobbyGroups', () => {
  const testData = loadTestData('lobbyGroups')
  test.each(testData as TestData)('$path', ({ decoder, data }) => {
    data.forEach(assertSchema(schemaMap[decoder]))
  })
})

describe('Organisations', () => {
  const testData = loadTestData('organisations')
  test.each(testData as TestData)('$path', ({ decoder, data }) => {
    data.forEach(assertSchema(schemaMap[decoder]))
  })
})

describe('Parliamentarians', () => {
  const testData = loadTestData('parliamentarians')
  test.each(testData as TestData)('$path', ({ decoder, data }) => {
    data.forEach(assertSchema(schemaMap[decoder]))
  })
})
