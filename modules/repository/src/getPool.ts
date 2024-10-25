import pg from 'pg'

export const getPool = (connectionString: string) => {
	if (!connectionString) {
		throw new Error('No connection string provided')
	}

	const p = new pg.Pool({connectionString})
	p.on('error', (err) => console.error(err)) // don't let a pg restart kill your app

	return p
}
