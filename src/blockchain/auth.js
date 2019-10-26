import pcl from 'postchain-client';

import blockchain from './blockchain';

const auth = (function () {
  let currentUser = {};

  const register = async username => {
    try {
      const user = pcl.util.makeKeyPair();
      const { pubKey, privKey } = user;
      const rq = blockchain.getGtx().newTransaction([pubKey]);
      rq.addOperation('register', pubKey, username);
      rq.sign(privKey, pubKey);

      await rq.postAndWaitConfirmation();

      return await login(privKey.toString('hex'));
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const login = async privKeyAsText => {
    try {
      const privKey = Buffer.from(privKeyAsText, 'hex');
      const pubKey = pcl.util.createPublicKey(privKey);
      const pubKeyAsText = pubKey.toString('hex');
      const { id, username } = await blockchain.getGtx().query("get_user", {
        user_pubkey: pubKeyAsText
      });

      currentUser = {
        id,
        username,
        pubKey,
        privKey
      };

      return {
        username,
        pubKey: pubKeyAsText,
        privKey: privKeyAsText
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  const logout = () => {
    currentUser = {};
  }

  const isLoggedIn = () => !!currentUser.privKey;

  const getCurrentUser = () => ({ ...currentUser });

  return {
    register,
    login,
    logout,
    isLoggedIn,
    getCurrentUser
  }
})();

export default auth;

// 79b112a4ea299eef788366d9f4dfb69bed58e892344e52525709ea14cc0da6bf
// 26fd363f90c1c6b103a01a22e9921d62118593e3bde5f4da09f947213bb62126