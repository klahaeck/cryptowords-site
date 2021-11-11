import { useEthers, shortenAddress } from '@usedapp/core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const AccountDisplay = ({ avatarSize = 16 }) => {
  const { account } = useEthers();

  return account ? <><span className="me-2">{shortenAddress(account)}</span> <Jazzicon diameter={avatarSize} seed={jsNumberForAddress(account)} /></> : <></>;
};

export default AccountDisplay;