import { atom } from "jotai";

type User = {
	email: string;
	username: string;
	profilePic: string;
};

export const userAtom = atom<User | undefined>(undefined);
