import React, { useState } from 'react';
import Login from './src/components/login';
import Menu from './src/components/menu';

export default function App() {
  //const [user, setUser] = useState('');
  //se não estiver logado acessa o login
  //if (!user) {
    //return <Login changeStatus={(user) => setUser(user)} />
  //}
  //logado acessa o menu tabs
    return <Menu/>
}