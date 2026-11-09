export type User = {
	user_id: number;
	username: string,
	email: string;
	password: string;
	credits: number;
	created_at?: Date;
};
