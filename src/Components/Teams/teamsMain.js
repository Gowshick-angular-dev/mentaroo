import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {  
  CallComposite, 
  fromFlatCommunicationIdentifier, 
  useAzureCommunicationCallAdapter 
} from '@azure/communication-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TeamsComponent = () => { 
  const displayName = 'Guest'
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [teamsMeetingLink, setTeamsMeetingLink] = useState('');
  const [message, setMessage] = useState('');
  const credential = useMemo(() => {
    if (token) {
      return new AzureCommunicationTokenCredential(token)
    } 
    return;
    }, [token]);

  const callAdapterArgs = useMemo(() => {
    if (userId && credential && displayName && teamsMeetingLink) {
      return {
        userId: fromFlatCommunicationIdentifier(userId),
        displayName,
        credential,
        locator: { meetingLink: teamsMeetingLink },
      }
    }
    return {};
  }, [userId, credential, displayName, teamsMeetingLink]);

  const callAdapter = useAzureCommunicationCallAdapter(callAdapterArgs);
  const location = useLocation();

  useEffect(() => {
    requestPermissions();
    const queryParams = new URLSearchParams(location.search);
    const myParam = queryParams.get('url');
    setTeamsMeetingLink(myParam);
    
    const init = async () => {
      setMessage('Getting ACS user');
      //Call Azure Function to get the ACS user identity and token
      const res = await fetch(process.env.REACT_APP_ACS_USER_FUNCTION);
      const user = await res.json();
      setUserId(user.userId);
      setToken(user.token);

      // setMessage('Getting Teams meeting link...');
      // //Call Azure Function to get the meeting link
      // const resTeams = await fetch(process.env.REACT_APP_TEAMS_MEETING_FUNCTION);
      // const link = await resTeams.text();
      // setTeamsMeetingLink(link);
      // setMessage('');
      // console.log('Teams meeting link', link);
    }
    init();
  }, []);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log('bbbbbbbbbbbbbbbbb: ', stream);
      
    } catch (err) {
      console.error('Permission denied', err);
    }
  };

  if (callAdapter) {
    return (
      <div className='vh-100'>
        {/* <h1>Contact Customer Service</h1> */}
        <div className="teams_wrapper h-75">
          <CallComposite
            adapter={callAdapter}
          />
        </div>
      </div>
    );
  }
  if (!credential) {
    return <div className='vh-100'>Failed to construct credential. Provided token is malformed.</div>;
  }
  if (message) {
    return <div className='vh-100'>{message}</div>;
  }
  return <div className='vh-100'>Initializing...</div>;
};

export default TeamsComponent;