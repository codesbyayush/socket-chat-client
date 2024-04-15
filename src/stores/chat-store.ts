"use client";

import { create } from "zustand";

export type LoggedInUserData = {
  id: string | undefined;
  avatar: string;
  name: string;
  email: string;
  updateName: (data: string) => void;
  updateId: (data: string | undefined) => void;
  updateAvatar: (url: string) => void;
  updateUser: ({
    avatar,
    name,
    email,
  }: {
    avatar: string;
    name: string;
    email: string;
  }) => void;
};

export const useLoggedInUserData = create<LoggedInUserData>((set) => ({
  id: undefined,
  avatar: "",
  name: "Ayush-default",
  email: "",
  updateUser: ({
    avatar = "",
    name,
    email,
  }: {
    avatar?: string;
    name: string;
    email: string;
  }) =>
    set((state) => ({ ...state, name: name, email: email, avatar: avatar })),
  updateName: (newName: string) =>
    set((state) => ({ ...state, name: newName })),
  updateId: (newId) => set((state) => ({ ...state, id: newId })),
  updateAvatar: (imageUrl: string) =>
    set((state) => ({ ...state, avatar: imageUrl })),
}));

export type AvailableUsers = {
  users: User[];
  addUser: (user: User) => void;
  removeUser: (email: string) => void;
  clearUsers: () => void;
};

export const useAvailableUsers = create<AvailableUsers>((set) => ({
  users: [],
  addUser: (user) =>
    set((state) => {
      if (!user.name || user.name.length < 1)
        user.name = String(state.users.length + 1);
      state.users.push(user);
      return { users: state.users };
    }),
  removeUser: (email) =>
    set((state) => {
      const updatesUsers = state.users.filter((user) => user.email !== email);
      console.log(updatesUsers);
      return { users: updatesUsers };
    }),
  clearUsers: () => set((state) => ({ users: [] })),
}));

export type User = {
  name: string;
  avatar: string | undefined;
  email: string;
};

export type Message = {
  message: string;
  sentBy: string;
};

export type PastMessages = {
  messages: Map<string, Message[]>;
  addMessage: (connectedTo: string, message: Message) => void;
};

export const useSentMessages = create<PastMessages>((set) => ({
  messages: new Map<string, Message[]>(),
  addMessage: (connectedTo: string, message: Message) => {
    set((state) => {
      const messageArr = state.messages;
      let msgs = messageArr.get(connectedTo);
      if (!msgs) {
        msgs = [];
      }
      msgs.push(message);
      messageArr.set(connectedTo, msgs);
      console.log(msgs);
      return { messages: messageArr };
    });
  },
}));

// const _User = {
//   id: 'user_2ezfYf5dREydGb8sgfW5u9RtQaD',
//   passwordEnabled: false,
//   totpEnabled: false,
//   backupCodeEnabled: false,
//   twoFactorEnabled: false,
//   banned: false,
//   createdAt: 1712912375656,
//   updatedAt: 1712912375754,
//   imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZXpmWWQyWlVGa0Vib1hPZVFxbVhyUTBzSDcifQ',
//   hasImage: true,
//   gender: undefined,
//   birthday: undefined,
//   primaryEmailAddressId: 'idn_2ezfYMgfM6H67DL4tvVEfGpXSRC',
//   primaryPhoneNumberId: null,
//   primaryWeb3WalletId: null,
//   lastSignInAt: 1712912375661,
//   externalId: null,
//   email: null,
//   firstName: 'ayush',
//   lastName: 'patel',
//   publicMetadata: {},
//   privateMetadata: {},
//   unsafeMetadata: {},
//   emailAddresses: [
//     _EmailAddress {
//       id: 'idn_2ezfYMgfM6H67DL4tvVEfGpXSRC',
//       emailAddress: 'codesbyayush@gmail.com',
//       verification: [_Verification],
//       linkedTo: [Array]
//     }
//   ],
//   phoneNumbers: [],
//   web3Wallets: [],
//   externalAccounts: [
//     _ExternalAccount {
//       id: 'idn_2ezfYLbPsQlGuReLCkbpdCQGWku',
//       provider: undefined,
//       identificationId: undefined,
//       externalId: undefined,
//       approvedScopes: 'email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile',
//       emailAddress: 'codesbyayush@gmail.com',
//       firstName: undefined,
//       lastName: undefined,
//       imageUrl: undefined,
//       email: null,
//       publicMetadata: {},
//       label: null,
//       verification: [_Verification]
//     }
//   ],
//   createOrganizationEnabled: true
// }
