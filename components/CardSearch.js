import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { useEthers, useContractFunction, useNotifications, ChainId } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setCardStatus,
  showModal,
  addToast,
  addAlert,
} from '../store/root/reducer';
import usePrice from '../hooks/usePrice';
import useContract from '../hooks/useContract';
import useCurrency from '../hooks/useCurrency';
import {
  Card,
} from 'react-bootstrap';
import FullError from './CardSearch/FullError';
import FullLoading from './CardSearch/FullLoading';
import Full from './CardSearch/Full';
import SlimError from './CardSearch/SlimError';
import SlimLoading from './CardSearch/SlimLoading';
import Slim from './CardSearch/Slim';

const CardSearch = (props) => {
  const { slim, search, onCloseClick, setCardStatus, showModal, addAlert, addToast, className } = props;

  const { account, chainId } = useEthers();
  const { notifications } = useNotifications();
  const price = usePrice(account, search.name);
  const contract = useContract();
  const currency = useCurrency();

  const { state, send } = useContractFunction(contract, 'purchaseWord');
  
  const { data, error } = useSWR(search.name ? `/api/token/${search.name}` : null, fetcher);
  
  const purchaseWord = (searchName) => {
    if (account) {
      send(account, searchName, { value: price });
    } else {
      addAlert({position: 'global', color: 'primary', msg:'You must connect your wallet to purchase a word'});
    }
  };

  useEffect(() => {
    const purchaseSuccess = notifications.filter(n => n.type === 'transactionSucceed' && n.transaction.nonce === search.nonce);
    if (purchaseSuccess.length > 0) {
      if (search.status === 'mining') {
        addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> has been minted to your wallet.</p>});
        setCardStatus({ name: search.name, status: null });
      }
    }
  }, [notifications]);

  useEffect(() => {
    switch(state.status) {
      case 'Mining':
        setCardStatus({ name: search.name, nonce: state.transaction.nonce, status: 'mining' });
        addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> is minting.</p>});
        break;
      // case 'Success':
      //   setCardStatus({name: search.name, status: null});
      //   addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> has been minted to your wallet.</p>});
      //   break;
      case 'Exception':
        setCardStatus({name: search.name, status: null});
        if (state.errorMessage?.includes('insufficient funds')) {
          showModal({size:'lg', header: 'Insufficient funds', body:<>
            <p>There is not enough {currency} in your wallet to make this purchase including the gas fee.</p>
            {chainId === ChainId.Polygon && <p>If you need to transfer funds from the Ethereum mainnet to Polygon, you can use the <a href="https://wallet.polygon.technology/bridge" target="_blank" rel="noreferrer" className="color-polygon"><b>Polygon Bridge</b></a></p>}
          </>});
        }
        // } else {
        //   showModal({size:'lg', header: 'Error', body:<>
        //     <p>There has been an error making this purchase. Be sure there is not enough {currency} in your wallet to make this purchase including the gas fee.</p>
        //     {chainId === ChainId.Polygon && <p>If you need to transfer funds from the Ethereum mainnet to Polygon, you can use the <a href="https://wallet.polygon.technology/bridge" target="_blank" rel="noreferrer" className="color-polygon"><b>Polygon Bridge</b></a></p>}
        //   </>});
        // }
        break;
    }
  }, [state]);

  const handleClickExpand = () => {
    showModal({body:<Card.Img variant="top" width="100%" src={data.image} alt={data.name} />})
  };

  if (slim) {

  }
  if (error) return slim ? <SlimError search={search} className={className} onCloseClick={onCloseClick} /> : <FullError search={search} className={className} onCloseClick={onCloseClick} />;
  if (!data) return slim ? <SlimLoading search={search} className={className} onCloseClick={onCloseClick} /> : <FullLoading search={search} className={className} onCloseClick={onCloseClick} />;
  return slim ? <Slim search={search} onCloseClick={onCloseClick} handleClickExpand={handleClickExpand} purchaseWord={purchaseWord} /> : <Full search={search} data={data} onCloseClick={onCloseClick} handleClickExpand={handleClickExpand} purchaseWord={purchaseWord} />;
};

const mapDispatchToProps = (dispatch) => ({
  setCardStatus: bindActionCreators(setCardStatus, dispatch),
  showModal: bindActionCreators(showModal, dispatch),
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(CardSearch);