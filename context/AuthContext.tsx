

import React, { createContext, useReducer, ReactNode, useContext } from 'react';

type AuthState = {
  userId: number | null;
  username: string | null;
  token: string | null;
};

type AuthAction = 
  | { type: 'LOGIN'; payload: { userId: number; username: string, token:string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  userId: null,
  username: null,
  token: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { userId: action.payload.userId, username: action.payload.username, token: action.payload.token };
    case 'LOGOUT':
      return { userId: null, username: null, token: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
