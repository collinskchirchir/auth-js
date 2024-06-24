'use client';
import React from 'react';
import { logout } from '@/actions/logout';
import { useCurrentUser } from '@/hooks/use-current-user';


const SettingsPage = () => {
  const user = useCurrentUser();
  const onClick = () => {
    logout();
  };
  return (
    <div className="rounded-xl bg-white p-10">
      {JSON.stringify(user)}
      <form>
        <button onClick={onClick} type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default SettingsPage;