import './settings.css';
import Sidebar from '../../components/sidebar/Sidebar';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/Context';
import axios from 'axios';

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkValidUserName,setCheckValidUserName]=useState(true);
  const { user, dispatch } = useContext(Context);
  const PF = 'http://localhost:5000/images/';

  useEffect(()=>{
    setUsername(user.username);
    setPassword(user.password);
  },[])

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    dispatch({ type: 'UPDATE_START' });
    const updatedUser = {
      userId: user._id,
      username,
      email: user.email,
      password,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append('name', filename);
      data.append('file', file);
      updatedUser.profilePic = filename;
      try {
        await axios.post('/upload', data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const res = await axios.put('/users/' + user._id, updatedUser);
      setSuccess(true);
      console.log(res.data);
      dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'UPDATE_FAILURE' });
    }
  };


  const handleDelete = async () => {
    try {
      //   await axios.delete('/posts', { data: { answer: user.username } });
      // await axios.delete('/auth')
      //await axios.delete('/user')
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">
            <button className="settingsDeleteTitle" onClick={handleDelete}>
              Delete Account
            </button>
          </span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF + user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Edit your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {success && (
            <span
              style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}
            >
              Profile has been updated...
            </span>
          )}
          {
            !setCheckValidUserName  && (
              <span
              style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}
            >
              Enter valid Username
            </span>
            )
          }
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
