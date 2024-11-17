export const isAdminEmail = (adminEmails: string, email?: null | string) =>
	!!email && adminEmails.split(',').includes(email)
