import React from 'react';
import { AITools } from '../components';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Link to={'/chat'}>Chats</Link>
      <br />
      <AITools />
    </div>
  );
};

export default HomePage;
