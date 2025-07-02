import {env as dynamicPrivateEnv} from '$env/dynamic/private'
import {isAdminEmail} from '$lib/authZ/isAdminEmail'
import {checkEnv} from '$lib/server/checkEnv'
import PostgresAdapter from '@auth/pg-adapter'
import {type DefaultSession, SvelteKitAuth} from '@auth/sveltekit'
import Resend from '@auth/sveltekit/providers/resend'
import {getDb} from '@i/repository/getDb'
import crypto from 'crypto'
import Debug from 'debug'

const debug = Debug('indiemap:authjs')

declare module '@auth/sveltekit' {
  interface Session {
    user: DefaultSession['user'] & {
      isAdmin: boolean
      /**
       * Use libravatar (simiar to gravatar) to get the user's avatar.
       * Only relevant for admin users as they log in with email.
       */
      libravatar: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    }
  }
}

export const {handle, signIn, signOut} = SvelteKitAuth(async () => {
  /**
   * Create a new pool for Authjs that is bound to the relevant schema
   */
  const env = checkEnv(dynamicPrivateEnv)

  // Authjs uses the same DB but not the public schema
  const {pool: authPool} = getDb(env.DATABASE_URL)
  await authPool.query('SET search_path TO public, authjs')

  return {
    adapter: PostgresAdapter(authPool),
    callbacks: {
      jwt({token, user}) {
        if (user) {
          token.isAdmin = isAdminEmail(env.ADMIN_USER_EMAILS, user.email)
          token.libravatar = `https://www.libravatar.org/avatar/${
            crypto
              .createHash('md5')
              .update(user.email ?? '')
              .digest('hex')
          }?s=64`
        }

        return token
      },
      session({session, token}) {
        session.user.isAdmin = token.isAdmin as boolean
        session.user.libravatar = token.libravatar as string

        return session
      },
      signIn({account, user}) {
        // Only allow email login for the admin users, this is to avoid abuse, bots and spam.
        if (account?.type !== 'email') {
          debug('signIn: not email login, allowed')
          return true
        }

        const isAdmin = isAdminEmail(env.ADMIN_USER_EMAILS, user?.email)

        if (!isAdmin) {
          debug('signIn: refusing email login to', user.email)
          return false
        }

        return true
      },
    },

    providers: [
      Resend({
        apiKey: env.AUTH_RESEND_KEY,
        from: 'team@indiemap.uk',
        name: 'Magic Link 🪄',
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    trustHost: true,
  }
})
