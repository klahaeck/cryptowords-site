import { useEthers } from '@usedapp/core';
import useHasRole from '../hooks/useHasRole';
import useAdminData from '../hooks/useAdminData';

const Notices = () => {
  const { discountPercentage, discountPercentageGlobal, paused } = useAdminData();
  const { account } = useEthers();

  const isDiscountedUser = useHasRole('DISCOUNTED_ROLE', account);
  const isMinter = useHasRole('MINTER_ROLE', account);
  
  const hasDiscount = () => isMinter === false && (isDiscountedUser || discountPercentageGlobal > 0);
  const getDiscount = () => isDiscountedUser ? Math.max(discountPercentage, discountPercentageGlobal) : discountPercentageGlobal;

  return (
    <>
      {paused && <div className="p-0 m-0 bg-warning text-dark text-center">
        <p className="h5 p-2 m-0">All purchases are currently paused.</p>
      </div>}
      {account && hasDiscount() && <div className="p-0 m-0 bg-primary text-dark text-center">
        <p className="h5 p-2 m-0 text-uppercase">You have a {getDiscount()}% discount!</p>
      </div>}
    </>
  );
};

export default Notices;