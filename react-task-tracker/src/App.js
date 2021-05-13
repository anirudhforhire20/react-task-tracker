import './App.css'
import Header from './components/Header/Header.js';
import {TaskManager, tm} from './components/Tasks/TaskManager';
import Auth from './components/Auth/Auth';
import { useState } from 'react';

const ENV_VAR = {
  uname : '',
  pass : ''
};

function App() {
  console.log('calling App');
  let [authCheck, updateAuth] = useState(false);
  const onSubmit = () => {
    let json = {};
    json['uname'] = document.querySelector('fieldset#uname').querySelector('input').value;
    json['password'] = document.querySelector('fieldset#password').querySelector('input').value;

    fetch(`http://localhost:5000?uname=${json.uname}&pass=${json.password}&qid=101`).then(res => {
      if(res.ok)
      {
        ENV_VAR.uname = json.uname;
        ENV_VAR.pass = json.password;
        authCheck = true;
        tm.get(() => {
          updateAuth(true);
        })
        // updateAuth(true);
      }
    })
  }
  return (
    <div className="container">
      {authCheck? (<TaskManager/>) : (<Auth onSubmit={onSubmit}/>)}
    </div>
  );
}

export {App, ENV_VAR};
