import { useEthers } from '@usedapp/core';
import useHasRole from '../hooks/useHasRole';
import useAdminData from '../hooks/useAdminData';

const Notices = () => {
  const { discountPercentage, paused } = useAdminData();
  const { account } = useEthers();
  const hasDiscount = useHasRole('DISCOUNTED_ROLE', account);

  return (
    <>
      {paused && <div className="p-0 m-0 bg-warning text-dark text-center">
        <p className="h5 p-2 m-0">All purchases are currently paused.</p>
      </div>}
      {account && hasDiscount && <div className="p-0 m-0 bg-primary text-dark text-center">
        <p className="h5 p-2 m-0 text-uppercase">You have a {discountPercentage * .01}% discount!</p>
      </div>}
    </>
  );
};

export default Notices;