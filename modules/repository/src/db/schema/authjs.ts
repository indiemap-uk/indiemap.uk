import {bigint, integer, pgSchema, primaryKey, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core'

export const authjs = pgSchema('authjs')

export const verificationToken = authjs.table(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    expires: timestamp('expires', {withTimezone: true}).notNull(),
    token: text('token').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
    }),
  ],
)

export const accounts = authjs.table('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull(),
  type: varchar('type', {length: 255}).notNull(),
  provider: varchar('provider', {length: 255}).notNull(),
  providerAccountId: varchar('providerAccountId', {length: 255}).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: bigint('expires_at', {mode: 'number'}),
  id_token: text('id_token'),
  scope: text('scope'),
  session_state: text('session_state'),
  token_type: text('token_type'),
})

export const sessions = authjs.table('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull(),
  expires: timestamp('expires', {withTimezone: true}).notNull(),
  sessionToken: varchar('sessionToken', {length: 255}).notNull(),
})

export const users = authjs.table('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 255}),
  email: varchar('email', {length: 255}),
  emailVerified: timestamp('emailVerified', {withTimezone: true}),
  image: text('image'),
})
